import React, { useState, useEffect } from 'react';
import './chat.css';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import { useUserData } from '../../constants/context';
import { LiveChat } from '../../assets';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import LoginSignupPopup from '../LoginSignupPopup';

const LiveChatCards = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [liveChatPop, setLiveChatPop] = useState(false);
  const userData = useUserData();

  const getExpertType = (typeId) => {
    switch (typeId) {
      case 1:
        return "Commodity";
      case 2:
        return "Equity";
      case 3:
        return "Futures & Options";
      default:
        return "Unknown";
    }
  };

  const handleClosePopup = () => {
    setShowSignUp(false);
    setSelectedExpert(null);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const TypingAnimation = ({ name, type }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const [typingPhase, setTypingPhase] = useState('name');
    const [delay, setDelay] = useState(false);

    useEffect(() => {
      if (delay) {
        const delayTimeout = setTimeout(() => {
          setDelay(false);
          setIndex(0);
        }, 2000); // Delay of 2 seconds
        return () => clearTimeout(delayTimeout);
      }

      const text = typingPhase === 'name' ? name : type;
      const timeout = setTimeout(() => {
        setDisplayedText(text.substring(0, index));
        if (index < text.length) {
          setIndex(index + 1);
        } else {
          setDelay(true);
          setTypingPhase(typingPhase === 'name' ? 'type' : 'name');
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, [index, typingPhase, delay, name, type]);

    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {displayedText}
      </motion.span>
    );
  };

  const handleChatNow = async (expert) => {
    const userId = localStorage.getItem("userId");
    setLiveChatPop(true);
    setSelectedExpert(expert);

    if (!userId) {
      console.error('User ID not found in local storage');
      setShowSignUp(true);
      return;
    }

    try {
      const userResponse = await axios.get(`https://copartners.in:5131/api/User/${userId}`);
      const user = userResponse.data.data;

      const chatUrl = `https://chatui.d1qvqlb9bge3b2.amplifyapp.com/${userId}/${user.mobileNumber}/${expert.id}`;
      console.log(chatUrl);
      window.open(chatUrl, '_blank');

      const payload = {
        id: userId,
        userType: 'UR',
        username: user.mobileNumber,
      };

      try {
        await axios.post('https://copartners.in:5137/api/ChatConfiguration/PostChatUser', payload);
      } catch (postError) {
        if (postError.response && postError.response.data.errorMessage === "Record already exists") {
          console.log("Record already exists");
        } else {
          throw postError;
        }
      }
    } catch (error) {
      console.error('Error handling chat now:', error);
    }
  };

  const filteredUserData = userData?.filter(expert => expert.isChatLive === true);

  const settings = {
    infinite: filteredUserData.length > 1,
    speed: 500,
    slidesToShow: filteredUserData.length > 1 ? 4 : 1, // Show only one slide if there's only one item
    slidesToScroll: 1,
    arrows: filteredUserData.length > 1, // Disable arrows if only one item
    autoplay: filteredUserData.length > 1, // Disable autoplay if only one item
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: filteredUserData.length > 1 ? 2 : 1,
          slidesToScroll: 1,
          centerPadding: filteredUserData.length > 1 ? '40px' : '0',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: filteredUserData.length > 1 ? 2 : 1,
          slidesToScroll: 1,
          centerPadding: filteredUserData.length > 1 ? '20px' : '0',
        },
      },
    ],
  };

  return (
    <div className="container mx-auto">
      <Slider {...settings}>
        {filteredUserData?.map((expert, id) => (
          <div key={expert.id} className="text-[#000] flex justify-center my-4 ">
            <div className="card-container rounded-2xl md:w-[250px] w-[170px] sm:w-[140px] bg-[#f7f7f7] md:p-4 p-2 relative flex flex-col items-center border-[1px] hover:shadow-lg transition duration-300 ease-in-out">
              <div className="relative flex flex-col justify-center items-center">
                {/* Circular Image with Gradient Border */}
                <div className="image-container sm:w-[60px] sm:h-[60px]">
                  <img src={expert.expertImagePath} alt={expert.name} className="expert-image sm:w-[60px] sm:h-[60px]" />
                </div>
              </div>

              <div className="text-left w-full md:mt-4 mt-2">
                <span className="text-sm sm:text-xs text-gray-500">Live Chat With</span>
                <h3 className="md:text-lg text-md sm:text-sm font-bold text-black ">{expert.name}</h3>
              </div>

              <div className="flex justify-between w-full md:mt-3 md:px-4 text-sm sm:text-xs">
                <div className="text-center">
                  <span className="text-gray-500">Experience</span>
                  <p className="font-semibold text-black mt-1">{expert.experience}+</p>
                </div>
                <div className="text-center">
                  <span className="text-gray-500">Followers</span>
                  <p className="font-semibold text-black mt-1">{expert.telegramFollower}k</p>
                </div>
              </div>

              <button
                className="md:mt-5 mt-2 w-full flex items-center justify-center text-white sm:text-xs"
                onClick={() => handleChatNow(expert)}
                style={{ background: "#2BDE70", padding: '0.5rem', borderRadius: '9999px' }}
              >
                <span className="text-[14px] sm:text-[12px] font-bold flex">
                  <img src={LiveChat} alt="Live Chat" className="w-4 h-4 mr-1 inline-block" />
                  Chat Now
                </span>
              </button>
            </div>
          </div>
        ))}
      </Slider>
      {showSignUp && (
        <LoginSignupPopup
          onComplete={() => handleChatNow(selectedExpert)}
          onClose={handleClosePopup}
          liveChatPop={liveChatPop}
        />
      )}
    </div>
  );
};

export default LiveChatCards;
