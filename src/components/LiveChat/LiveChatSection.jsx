import React from 'react';
import LiveChatCards from './LiveChatCards';
import Marquee from "react-fast-marquee";
import { useUserData } from '../../constants/context';

const LiveChatSection = () => {
  const userData = useUserData();

  // Filter userData to only include experts where isChatLive is true
  const filteredUserData = userData?.filter(expert => expert.isChatLive === true);

  // If no experts are live, don't render the LiveChatSection
  if (filteredUserData.length === 0) {
    return null; // Render nothing if no live experts
  }

  return (
    <div className='flex flex-col mt-8 border border-[#97979755] rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-50 to-white'>
      
      <div className='bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500'>
        <Marquee gradient={false} speed={40} className="py-1">
          <p className='mx-12 text-lg font-medium'>🥳 Celebrating 1 Million+ Learners 🥳 Special Offer!</p>
          <p className='mx-12 text-lg font-medium'>🥳 Celebrating 1 Million+ Learners 🥳 Special Offer!</p>
          <p className='mx-12 text-lg font-medium'>🥳 Celebrating 1 Million+ Learners 🥳 Special Offer!</p>
          <p className='mx-12 text-lg font-medium'>🥳 Celebrating 1 Million+ Learners 🥳 Special Offer!</p>
        </Marquee>
      </div>
      
      <div className='flex flex-col md:flex-row items-center justify-between py-6 px-8 bg-white'>
        <h1 className="text-4xl md:text-6xl text-[#000] font-bold">Live Chat</h1>
        <p className="mt-4 md:mt-0 md:text-lg text-gray-700 md:w-[600px] text-center md:text-left">
          Guiding Your Investments to Greatness: Our Expertise, Your Financial Advantage!
        </p>
      </div>
      
      <div className='md:p-8 bg-white'>
        <LiveChatCards />
      </div>

       {/* <div className='md:hidden'>
        <LiveChatCarousel />
      </div> */}

    </div>
  );
}

export default LiveChatSection;
