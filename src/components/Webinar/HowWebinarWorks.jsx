import React from 'react';
import { FaCheck } from "react-icons/fa6";
import './Webinar.css'
const HowWebinarWorks = () => {
  return (
    <div className='w-full mt-3 flex flex-col'>
      <div className='bg-[#18181B] rounded-[10px] mt-8 p-6'>
        <div className='text-[26px]'>
          Here’s how it Works over the <br/><span className='text-gradient font-bold'>3 Hours</span>
        </div>
        <p className='py-3 border-b border-[#fff] text-lg'>3 hours Webinar</p>
        <div className='mt-5'>
          <ul className='list-none space-y-4'>
            <li className='flex items-center'>
              <FaCheck className='text-xl mr-2' />
              <span>Field mapping customization</span>
            </li>
            <li className='flex items-center'>
              <FaCheck className='text-xl mr-2' />
              <span>Eventbrite embedded checkout</span>
            </li>
            <li className='flex items-center'>
              <FaCheck className='text-xl mr-2' />
              <span>Automated event updates</span>
            </li>
            <li className='flex items-center'>
              <FaCheck className='text-xl mr-2' />
              <span>Real-time data synchronisation</span>
            </li>
          </ul>
        </div>
      </div>
      <div className='w-full mt-3'>
        <button className="w-full md:w-[1000px] bg-[#006ADC] text-[15px] font-semibold md:py-3 py-4 rounded-md scale-animation">
          Buy Now at ₹1,999
        </button>
      </div>
    </div>
  );
};

export default HowWebinarWorks;
