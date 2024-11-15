import React from 'react';
import { FaChartLine, FaLightbulb, FaTools } from 'react-icons/fa';
import { HiUsers } from "react-icons/hi2";
import { GoGraph } from "react-icons/go";

const LearnMinorSub = () => {
  return (
    <div className='flex flex-col justify-center items-center mt-10'>
      <h3 className='text-[30px] md:text-[40px] text-center mb-5'>
      Here’s how it works over  <br/> after <span className='text-gradient font-bold'>Payment</span>
      </h3>
      <div className='grid md:grid-cols-3 gap-3 md:gap-8'>
        <div className='flex flex-col items-start sm:items-center text-left p-6 rounded-xl sm:text-center'>
          <HiUsers  className='text-4xl mb-4 text-gradient text-[#008EFF]' />
          <h4 className='text-xl font-bold mb-2'>Market Analysis</h4>
          <p className='text-gray-300'>Understand the intricacies of market trends and how to analyze them effectively.</p>
        </div>
        <div className='flex flex-col items-start text-left p-6  rounded-xl sm:items-center sm:text-center'>
          <GoGraph className='text-4xl mb-4 text-gradient text-[#14B082]' />
          <h4 className='text-xl font-bold mb-2'>Innovative Strategies</h4>
          <p className='text-gray-300'>Learn about innovative trading strategies that can give you an edge in the market.</p>
        </div>
        <div className='flex flex-col items-start text-left p-6 rounded-xl sm:items-center sm:text-center'>
          <HiUsers  className='text-4xl mb-4 text-gradient text-[#008EFF] ' />
          <h4 className='text-xl font-bold mb-2'>Practical Tools</h4>
          <p className='text-gray-300'>Get hands-on experience with practical tools and techniques used by professionals.</p>
        </div>
      </div>
    </div>
  );
};

export default LearnMinorSub;