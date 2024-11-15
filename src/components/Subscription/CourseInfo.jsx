import React from 'react';
import calender from '../../assets/calender.png';
import chart from '../../assets/chart.png';
import price from '../../assets/Rupee.png';
import video from '../../assets/video.png';
import rate from '../../assets/rateVideo.png';
import time from '../../assets/time.png';
import devices from '../../assets/devices.png';
import {singleCourse} from '../../constants';

const CourseInfo = () => {
  return (
    <div className="text-white border border-solid border-white border-opacity-10 rounded-lg p-3 md:p-8">
      {/* Heading */}
      <h3 className="md:block hidden font-inter font-bold md:text-[50px] text-[30px] subheading-color md:leading-[50px] leading-[51px] md:mb-6">
        Course
      </h3>
      <div className="heading-course md:flex">
        <h3 className="md:hidden font-inter font-bold md:text-[50px] text-[30px] subheading-color md:leading-[50px] leading-[31px] md:mb-6">
          Course
        </h3>
        <div className="w-full pr-4 md:bg-[#18181B]  bg-transparent rounded-lg mb-4 md:mb-0">
          <img
            src={singleCourse.imageUrl}
            alt="Devices"
            className="w-full"
            style={{
              maskImage: 'linear-gradient(rgba(0, 0, 0, 1) 70%, transparent)'
            }}
          />
        </div>
        <div className="w-full flex flex-col justify-center pl-4">
          <h3 className="font-semibold md:text-[50px] text-[16px] md:leading-[50px] leading-[24px] md:mb-6">
            {singleCourse.title}
          </h3>
          <div className="custom-progress-bar md:mb-5 ">
            <div className="progress"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <img src={chart} alt="Chart" className="w-4 h-4 mr-2" />
              <h4 className="md:text-base text-[12px] font-semibold text-[#e4e4e7a3]">Level:</h4>
              <p className="text-xs md:text-sm text-white ml-1">Medium</p>
            </div>
            <div className="flex items-center">
              <img src={time} alt="Time" className="w-4 h-4 mr-2" />
              <h4 className="md:text-base text-[12px] font-semibold text-[#e4e4e7a3]">Duration:</h4>
              <p className="text-xs md:text-sm text-white ml-1">7 hr 20m</p>
            </div>
            <div className="flex items-center">
              <img src={video} alt="Video" className="w-4 h-4 mr-2" />
              <h4 className="md:text-base text-[12px] font-semibold text-[#e4e4e7a3]">Sessions:</h4>
              <p className="text-xs md:text-sm text-white ml-1">5</p>
            </div>
            <div className="flex items-center">
              <img src={video} alt="Video" className="w-4 h-4 mr-2" />
              <h4 className="md:text-base text-[12px] font-semibold text-[#e4e4e7a3]">Completed Sessions:</h4>
              <p className="text-xs md:text-sm text-white ml-1">3</p>
            </div>
            <div className="flex items-center">
              <img src={price} alt="Price" className="w-4 h-4 mr-2" />
              <h4 className="md:text-base text-[12px] font-semibold text-[#e4e4e7a3]">Amount:</h4>
              <p className="text-xs md:text-sm text-white ml-1">₹ 1,999/-</p>
            </div>
            <div className="flex items-center">
              <img src={calender} alt="Calendar" className="w-4 h-4 mr-2" />
              <h4 className="md:text-base text-[12px] font-semibold text-[#e4e4e7a3]">Buy date:</h4>
              <p className="text-xs md:text-sm text-white ml-1">28/01/2024</p>
            </div>
            <div className="flex items-center">
              <img src={rate} alt="Rate" className="w-4 h-4 mr-2" />
              <h4 className="md:text-base text-[12px] font-semibold text-[#e4e4e7a3]">Access:</h4>
              <p className="text-xs md:text-sm text-white ml-1">Lifetime Access</p>
            </div>
            <div className="col-span-2 flex items-center">
              <img src={devices} alt="Rate" className="w-4 h-4 mr-2" />
              <h4 className="md:text-base text-[12px] font-semibold text-[#e4e4e7a3]">
                Access From Any Computer, Tablet, or Mobile
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Details */}
      <div className="sessionsDetails mt-8">
        <h4 className="text-4xl font-semibold subheading-color md:block hidden">Sessions Details</h4>
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
          {singleCourse.sessionsDetails.map((session) => (
            <div key={session.id} className="bg-transparent p-5 rounded-lg flex items-center justify-between hover:bg-[#18181B] transition duration-300 ease-in-out">
              {/* Session details JSX */}
              <div className="flex">
                <div className="border border-solid border-white border-opacity-10 rounded-2xl h-10 w-10 p-6 flex items-center justify-center mr-3">
                  <p className="text-3xl font-bold">{session.id}</p>
                </div>
                <div className='p-0'>
                  <h5 className="text-xl font-semibold">{session.title}</h5>
                  <p className="text-xs md:text-sm text-gray-300 mt-1">{session.description}</p>
                  <p className="text-xs md:text-sm text-gray-300 mt-1">Duration: {session.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Course */}
      <div className="boutCourse mt-8">
        <h4 className="text-4xl font-semibold subheading-color">About Course</h4>
        <p className="text-base text-gray-300 mt-4">{singleCourse.aboutCourse}</p>
      </div>
    </div>
  );
};

export default CourseInfo;