import React, { useEffect, useRef, useState, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
} from 'react-icons/bs';
import { FaPlay, FaSignOutAlt } from 'react-icons/fa';
import { MdScreenShare, MdStopScreenShare } from 'react-icons/md';
import Notification from './Notification';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';

function LiveFeature() {
  // References
  const agoraClient = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);
  const screenVideoTrack = useRef(null);
  const isInitialLoadingRef = useRef(true);
  const reconnectionAttemptRef = useRef(false);
  const isManualLeave = useRef(false);
  const socketRef = useRef(null);
  const channelNameRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const chatEndRef = useRef(null);

  // State variables
  const [isWebCam, setIsWebCam] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [token, setToken] = useState('');
  const [uid, setUid] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Chat state variables
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Notifications state
  const [notifications, setNotifications] = useState([]);

  // Constants
  const USER_ID = 690; // Replace with dynamic user ID if available
  const APP_ID = 'dd6ea9e2e9f941389b1108a8c27e11a0'; // Replace with your Agora App ID
  const CHANNEL_STORAGE_KEY = 'stackholderId';
  const SOCKET_SERVER_URL = 'https://streaming.copartner.in'; // Replace with your backend URL

  /**
   * Add a new notification.
   */
  const addNotification = useCallback((type, message) => {
    const id = uuidv4();
    setNotifications((prev) => [...prev, { id, type, message }]);
  }, []);

  /**
   * Remove a notification by ID.
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  /**
   * Fetch token from API and update the token state.
   */
  const fetchToken = useCallback(
    async (channel, uid) => {
      try {
        const tokenUrl = `${SOCKET_SERVER_URL}/token?channelName=${encodeURIComponent(
          channel
        )}&uid=${uid}`;

        const tokenResponse = await axios.get(tokenUrl);

        const fetchedToken = tokenResponse.data.token;

        if (fetchedToken) {
          setToken(fetchedToken);
          // Token expiry logic if needed
        } else {
          if (!isInitialLoadingRef.current) {
            addNotification('error', 'Token retrieval failed.');
          }
        }
      } catch (error) {
        if (!isInitialLoadingRef.current) {
          addNotification('error', 'Failed to fetch token.');
        }
        console.error('Fetch Token Error:', error);
      }
    },
    [SOCKET_SERVER_URL, addNotification]
  );

  /**
   * Create the channel on page load.
   */
  const createChannel = useCallback(
    async (channel, uid) => {
      try {
        const createChannelUrl = `${SOCKET_SERVER_URL}/create-channel`;

        const createResponse = await axios.post(createChannelUrl, {
          channelName: channel,
          uid: uid,
        });

        if (createResponse.data && createResponse.data.token) {
          await fetchToken(channel, uid);
        } else {
          if (!isInitialLoadingRef.current) {
            addNotification(
              'error',
              'Unexpected response from server while creating/updating channel.'
            );
          }
        }
      } catch (error) {
        if (!isInitialLoadingRef.current) {
          addNotification('error', 'Failed to create the channel.');
        }
        console.error('Create Channel Error:', error);
      }
    },
    [fetchToken, SOCKET_SERVER_URL, addNotification]
  );

  /**
   * Join the Agora channel and start streaming.
   */
  const joinChannel = useCallback(async () => {
    if (!channelName || !APP_ID || !token) {
      addNotification('error', 'Missing required information to join the channel.');
      return;
    }

    setIsLoading(true);

    try {
      agoraClient.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      await agoraClient.current.join(APP_ID, channelName, token, USER_ID);

      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
      localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

      // Publish local tracks
      await agoraClient.current.publish([localAudioTrack.current, localVideoTrack.current]);

      // Do not play the video here since the div may not be rendered yet

      addNotification('success', 'You are now live!');
      setIsJoined(true);
      setUid(USER_ID);

      // Emit 'joinChannel' event to backend
      if (socketRef.current) {
        console.log('Emitting joinChannel event:', { channelName, userID: USER_ID });
        socketRef.current.emit('joinChannel', { channelName, userID: USER_ID });
      }
    } catch (error) {
      addNotification('error', 'Failed to join the stream.');
      console.error('Join Channel Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [APP_ID, channelName, token, USER_ID, addNotification]);

  // Assign the joinChannel function to the ref
  const joinChannelRef = useRef();
  useEffect(() => {
    joinChannelRef.current = joinChannel;
  }, [joinChannel]);

  /**
   * Leave the Agora channel and stop streaming.
   */
  const leaveChannel = useCallback(async () => {
    if (!channelName) {
      addNotification('error', 'Channel name is missing.');
      return;
    }

    setIsLoading(true);
    isManualLeave.current = true;

    try {
      if (agoraClient.current) {
        if (localAudioTrack.current) {
          await agoraClient.current.unpublish(localAudioTrack.current);
          localAudioTrack.current.stop();
          localAudioTrack.current.close();
          localAudioTrack.current = null;
        }

        if (localVideoTrack.current) {
          await agoraClient.current.unpublish(localVideoTrack.current);
          localVideoTrack.current.stop();
          localVideoTrack.current.close();
          localVideoTrack.current = null;
        }

        if (screenVideoTrack.current) {
          await agoraClient.current.unpublish(screenVideoTrack.current);
          screenVideoTrack.current.stop();
          screenVideoTrack.current.close();
          screenVideoTrack.current = null;
          setIsScreenSharing(false);
        }

        await agoraClient.current.leave();
      }

      addNotification('info', 'You have left the stream.');

      // Emit 'leaveChannel' event to backend
      if (socketRef.current) {
        console.log('Emitting leaveChannel event:', { channelName, userID: USER_ID });
        socketRef.current.emit('leaveChannel', { channelName, userID: USER_ID });
      }

      setIsJoined(false);
      setToken('');
      setUid(null);
      setActiveUsers(0);
    } catch (error) {
      addNotification('error', 'Failed to leave the stream.');
      console.error('Leave Channel Error:', error);
    } finally {
      setIsLoading(false);
      isManualLeave.current = false;
    }
  }, [channelName, USER_ID, addNotification]);

  /**
   * Initialize the component by creating the channel.
   */
  useEffect(() => {
    const initialize = async () => {
      setIsInitialLoading(true);
      isInitialLoadingRef.current = true;

      const storedChannelName = sessionStorage.getItem(CHANNEL_STORAGE_KEY);
      console.log('Stored Channel Name:', storedChannelName);

      if (storedChannelName) {
        setChannelName(storedChannelName);
        channelNameRef.current = storedChannelName;

        await createChannel(storedChannelName, USER_ID);
      } else {
        addNotification(
          'error',
          'Channel name is missing. Please refresh the page or contact support.'
        );
      }

      setTimeout(() => {
        setIsInitialLoading(false);
        isInitialLoadingRef.current = false;
      }, 2000);
    };

    initialize();
  }, [createChannel, USER_ID, addNotification]);

  /**
   * Initialize Socket.io client and listen for user events.
   * This useEffect runs when channelName changes.
   */
  useEffect(() => {
    if (!channelName) {
      console.log('Socket.io initialization delayed: channelName is not set yet.');
      return;
    }

    console.log('Initializing Socket.io with channelName:', channelName);
    const socket = io(SOCKET_SERVER_URL);

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to Socket.io server.');
    });

    socket.on('userActive', (user) => {
      addNotification('info', `${user.name} has joined the stream.`);
      console.log('Received userActive:', user);
    });

    socket.on('userInactive', (user) => {
      addNotification('warning', `${user.name} has left the stream.`);
      console.log('Received userInactive:', user);
    });

    socket.on('activeUsersCount', (count) => {
      try {
        console.log('Socket.io activeUsersCount event received:', count);
        setActiveUsers(count);
      } catch (error) {
        console.error('Error in activeUsersCount handler:', error);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.io server.', reason);
    });

    socket.on('error', (error) => {
      console.error('Socket.io Error:', error);
      addNotification('error', 'Socket.io connection error.');
    });

    // Clean up socket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [channelName, addNotification, SOCKET_SERVER_URL]);

  /**
   * Emit 'joinChannel' event when the user joins.
   */
  useEffect(() => {
    if (isJoined && socketRef.current) {
      console.log('Emitting joinChannel event:', { channelName, userID: USER_ID });
      socketRef.current.emit('joinChannel', { channelName, userID: USER_ID });
    }
  }, [isJoined, channelName]);

  /**
   * Polling to fetch active users count every 1 second.
   */
  const fetchActiveUsersCount = useCallback(async () => {
    if (!channelName) {
      console.log('fetchActiveUsersCount: channelName is not set.');
      return;
    }

    try {
      console.log('Fetching active users count for channel:', channelName);
      const response = await axios.get(
        `${SOCKET_SERVER_URL}/channel/${encodeURIComponent(channelName)}/active-users-count`
      );
      const count = response.data.activeUsersCount;
      console.log('Active users count received from backend:', count);
      setActiveUsers(count);
    } catch (error) {
      console.error('Error fetching active users count:', error);
    }
  }, [channelName, SOCKET_SERVER_URL]);

  /**
   * Start polling when the user joins the channel.
   */
  useEffect(() => {
    if (isJoined) {
      console.log('User has joined the channel. Starting polling for active users count.');

      pollingIntervalRef.current = setInterval(fetchActiveUsersCount, 1000);

      // Fetch the active users count immediately
      fetchActiveUsersCount();
    } else {
      if (pollingIntervalRef.current) {
        console.log('User has left the channel or not joined yet. Clearing polling interval.');
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        setActiveUsers(0);
      }
    }

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        console.log('Component unmounted. Clearing polling interval.');
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isJoined, fetchActiveUsersCount]);

  /**
   * Toggle mute/unmute audio.
   */
  const toggleMute = useCallback(() => {
    if (localAudioTrack.current) {
      const newMutedState = !isMuted;
      localAudioTrack.current.setEnabled(!newMutedState);
      setIsMuted(newMutedState);
    }
  }, [isMuted]);

  /**
   * Toggle webcam on/off.
   */
  const toggleWebCam = useCallback(() => {
    if (localVideoTrack.current) {
      const newWebCamState = !isWebCam;
      localVideoTrack.current.setEnabled(newWebCamState);
      setIsWebCam(newWebCamState);
    }
  }, [isWebCam]);

  /**
   * Start screen sharing.
   */
  const startScreenSharing = useCallback(async () => {
    if (!agoraClient.current) {
      addNotification('error', 'Agora client is not initialized.');
      return;
    }

    try {
      screenVideoTrack.current = await AgoraRTC.createScreenVideoTrack();

      if (localVideoTrack.current) {
        await agoraClient.current.unpublish(localVideoTrack.current);
        localVideoTrack.current.stop();
      }

      await agoraClient.current.publish(screenVideoTrack.current);

      screenVideoTrack.current.play('local-stream', { fit: 'cover' });

      setIsScreenSharing(true);
      addNotification('success', 'Screen sharing started.');
    } catch (error) {
      addNotification('error', 'Failed to start screen sharing.');
      console.error('Start Screen Sharing Error:', error);
    }
  }, [addNotification]);

  /**
   * Stop screen sharing.
   */
  const stopScreenSharing = useCallback(async () => {
    if (!agoraClient.current || !screenVideoTrack.current) {
      return;
    }

    try {
      await agoraClient.current.unpublish(screenVideoTrack.current);

      screenVideoTrack.current.stop();
      screenVideoTrack.current.close();
      screenVideoTrack.current = null;

      if (localVideoTrack.current) {
        await agoraClient.current.publish(localVideoTrack.current);
        localVideoTrack.current.play('local-stream', { fit: 'cover' });
      }

      setIsScreenSharing(false);
      addNotification('info', 'Screen sharing stopped.');
    } catch (error) {
      addNotification('error', 'Failed to stop screen sharing.');
      console.error('Stop Screen Sharing Error:', error);
    }
  }, [addNotification]);

  /**
   * Toggle screen sharing.
   */
  const toggleScreenSharing = useCallback(() => {
    if (isScreenSharing) {
      stopScreenSharing();
    } else {
      startScreenSharing();
    }
  }, [isScreenSharing, startScreenSharing, stopScreenSharing]);

  /**
   * Fetch chat messages from the backend.
   */
  const fetchChatMessages = useCallback(async () => {
    if (!channelName) {
      console.log('fetchChatMessages: channelName is not set.');
      return;
    }

    try {
      console.log('Fetching chat messages for channel:', channelName);
      const response = await axios.get(
        `${SOCKET_SERVER_URL}/channel/${encodeURIComponent(channelName)}/chat`
      );
      const fetchedChats = response.data.chats;

      setChatMessages(fetchedChats);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      addNotification('error', 'Failed to load chat messages.');
    }
  }, [channelName, SOCKET_SERVER_URL, addNotification]);

  /**
   * Send a new chat message to the backend.
   */
  const sendChatMessage = useCallback(async () => {
    if (chatInput.trim() === '') return;

    try {
      const response = await axios.post(
        `${SOCKET_SERVER_URL}/channel/${encodeURIComponent(channelName)}/chat`,
        {
          name: 'Host', // Replace with dynamic user name if available
          userID: USER_ID.toString(),
          message: chatInput.trim(),
        }
      );

      if (response.data && response.data.chat) {
        setChatMessages((prevMessages) => [...prevMessages, response.data.chat]);
        setChatInput('');
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      addNotification('error', 'Failed to send chat message.');
    }
  }, [chatInput, channelName, USER_ID, SOCKET_SERVER_URL, addNotification]);

  /**
   * Handle Enter key press in chat input.
   */
  const handleChatInputKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    },
    [sendChatMessage]
  );

  /**
   * Start polling to fetch chat messages when the user joins the channel.
   */
  useEffect(() => {
    if (isJoined) {
      console.log('User has joined the channel. Starting polling for chat messages.');

      // Initial fetch
      fetchChatMessages();

      // Start polling every 2 seconds
      const interval = setInterval(fetchChatMessages, 2000);

      // Cleanup function
      return () => {
        clearInterval(interval);
      };
    } else {
      setChatMessages([]);
    }
  }, [isJoined, fetchChatMessages]);

  /**
   * Auto-scroll to the latest chat message.
   */
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  /**
   * Play local video track when isJoined changes.
   */
  useEffect(() => {
    if (isJoined && localVideoTrack.current) {
      localVideoTrack.current.play('local-stream', { fit: 'cover' });
    }
  }, [isJoined]);

  /**
   * Clean up on component unmount.
   */
  useEffect(() => {
    return () => {
      if (isJoined) {
        leaveChannel();
      }
      if (screenVideoTrack.current) {
        screenVideoTrack.current.stop();
        screenVideoTrack.current.close();
        screenVideoTrack.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isJoined, leaveChannel]);

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient p-4 md:ml-[220px]">
      {isInitialLoading ? (
        // Loading Spinner Overlay
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-30">
          <svg
            className="animate-spin h-12 w-12 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            {/* Spinner Paths */}
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      ) : (
        // Main Component UI
        <div
          className="
            relative flex flex-col justify-center items-center
            border border-white rounded-2xl
            w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2
            p-8
            min-h-[745px]
            bg-transparent
            overflow-y-auto
            overflow-x-auto
            z-10
            mt-0
          "
        >
          {/* Active Users Count Display */}
          <div className="bg-gray-600/50 backdrop-blur-sm text-white px-4 py-2 rounded-full z-30 mb-4">
            {activeUsers} {activeUsers === 1 ? 'User' : 'Users'} Watching
          </div>

          {/* Local Video Stream with overlays */}
          {isJoined && (
            <div className="relative w-full h-96 sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden mb-4">
              <div id="local-stream" className="w-full h-full"></div>

              {/* Chat Box - Positioned Bottom-Left */}
              <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-70 text-white rounded-lg p-4 z-30 w-80">
                <div className="h-40 overflow-y-scroll mb-2">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="mb-2">
                      {msg.type === 'system' ? (
                        <div className="text-center text-gray-400 italic">
                          {DOMPurify.sanitize(msg.message)}
                        </div>
                      ) : (
                        <div>
                          <span className="font-semibold text-blue-300">
                            {DOMPurify.sanitize(msg.name)}
                          </span>
                          : {DOMPurify.sanitize(msg.message)}{' '}
                          <span className="text-xs text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleChatInputKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-l-lg focus:outline-none text-black"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="
                      px-4 py-2 bg-blue-600 hover:bg-blue-700
                      rounded-r-lg focus:outline-none
                    "
                    aria-label="Send Message"
                    disabled={!isJoined || isLoading || chatInput.trim() === ''}
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* Buttons Container - Positioned Bottom-Right */}
              <div className="absolute bottom-4 right-4 flex space-x-4 z-30">
                {/* Button: Toggle Webcam */}
                <div className="group relative">
                  <button
                    onClick={toggleWebCam}
                    className="
                      flex items-center justify-center
                      w-12 h-12
                      bg-gray-600/50 backdrop-blur-sm text-white rounded-full
                      hover:bg-gray-500/50 transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                    "
                    aria-label={isWebCam ? 'Turn Off Camera' : 'Turn On Camera'}
                  >
                    {isWebCam ? (
                      <BsCameraVideoFill size={20} />
                    ) : (
                      <BsCameraVideoOffFill size={20} />
                    )}
                  </button>
                </div>

                {/* Button: Mute/Unmute Audio */}
                <div className="group relative">
                  <button
                    onClick={toggleMute}
                    className="
                      flex items-center justify-center
                      w-12 h-12
                      bg-gray-600/50 backdrop-blur-sm text-white rounded-full
                      hover:bg-gray-500/50 transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                    "
                    aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <BsFillMicMuteFill size={20} /> : <BsFillMicFill size={20} />}
                  </button>
                </div>

                {/* Button: Toggle Screen Sharing */}
                <div className="group relative">
                  <button
                    onClick={toggleScreenSharing}
                    className="
                      flex items-center justify-center
                      w-12 h-12
                      bg-gray-600/50 backdrop-blur-sm text-white rounded-full
                      hover:bg-gray-500/50 transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                    "
                    aria-label={isScreenSharing ? 'Stop Screen Sharing' : 'Start Screen Sharing'}
                  >
                    {isScreenSharing ? (
                      <MdStopScreenShare size={20} />
                    ) : (
                      <MdScreenShare size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!isJoined && (
            <div className="flex flex-col justify-center items-center flex-1 z-20 mb-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl text-white text-center mb-4">
                Live Stream
              </div>
            </div>
          )}

          {/* Join/Leave Button */}
          <div className="z-30 mb-4">
            <button
              onClick={isJoined ? leaveChannel : joinChannelRef.current}
              className={`
                px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full
                focus:outline-none focus:ring-2 focus:ring-blue-300
                ${isLoading || !token ? 'cursor-not-allowed opacity-50' : ''}
              `}
              aria-label={isJoined ? 'Leave Stream' : 'Join Stream'}
              disabled={isLoading || !token}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : isJoined ? (
                'Leave Stream'
              ) : (
                'Join Stream'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Notifications Container */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 z-50">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            id={notif.id}
            type={notif.type}
            message={notif.message}
            onClose={removeNotification}
            duration={5000}
          />
        ))}
      </div>
    </div>
  );
}

export default LiveFeature;
