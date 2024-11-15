// src/SignalRCallMessage.js
import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRCallMessage = () => {
  const [userId, setUserId] = useState('7EA053FE-8CC4-4481-8DDE-08DCE631284F');
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);

  // Function to handle connection
  const connectToHub = () => {
    // Prevent multiple connections
    if (connection) {
      console.warn('Already connected');
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://copartners.in:5132/CallMessageHub?userId=${encodeURIComponent(userId)}`)
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log('Connected to the hub!');
        setConnection(newConnection);
      })
      .catch((err) => {
        console.error('Error while starting connection: ', err.toString());
      });

    newConnection.on('ReceiveCallMessageFree', (message) => {
      console.log(message);
      setMessages((prevMessages) => [
        ...prevMessages,
        `New Call: ${message.action} for Post ID: ${message.callPostId} at Stop Loss: ${message.stopLoss} with Target: ${message.targetHit}. Exit Call: ${message.exitCall}`,
      ]);
    });
  };

  // Clean up connection on unmount
  useEffect(() => {
    return () => {
      if (connection) {
        connection.stop().then(() => console.log('Connection stopped.'));
      }
    };
  }, [connection]);

  return (
    <div className="pb-[5rem] xl:pl-[18rem] md:pl-[16rem] pl-6 md:py-[6rem] pt-[8rem] bg-gradient min-h-screen">
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">SignalR Call Message Hub</h1>

      <div className="w-full max-w-md bg-white p-6 rounded shadow-md mb-6">
        <div className="mb-4">
          <label htmlFor="userId" className="block text-gray-700 font-semibold mb-2">
            User ID:
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          onClick={connectToHub}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Connect to Hub
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Message from Admin (via Swagger or API)</h2>
        <div className="max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages received yet.</p>
          ) : (
            messages.map((msg, index) => (
              <p key={index} className="mb-2 p-2 bg-gray-50 border border-gray-200 rounded">
                {msg}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignalRCallMessage;
