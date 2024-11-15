import React, { useState } from 'react';
import { liveCourseData } from '../../constants';

const WebinarTabs = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [dropdownValue, setDropdownValue] = useState('');

  const filteredData = activeTab === 'tab1'
    ? liveCourseData
    : liveCourseData.filter(course => {
      switch (activeTab) {
        case 'tab2':
          return course.subject === 'Futures & Options';
        case 'tab3':
          return course.subject === 'Commodity';
        case 'tab4':
          return course.subject === 'Investor';
        default:
          return true;
      }
    });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (dropdownValue) {
      case 'price':
        return a.price - b.price;
      case 'latest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      default:
        return 0;
    }
  });

  return (
    <div className="w-full py-3">
      <div className="flex justify-between bg-[#f5f5f5] items-center p-3 rounded-xl mb-4">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 transition-colors duration-300 ${activeTab === 'tab1' ? 'rounded-md text-white bg-black' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab('tab1')}
          >
            All
          </button>
          <button
            className={`py-2 px-4 transition-colors duration-300 ${activeTab === 'tab2' ? 'rounded-md text-white bg-black' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab('tab2')}
          >
            Future & Options
          </button>
          <button
            className={`py-2 px-4 transition-colors duration-300 ${activeTab === 'tab3' ? 'rounded-md text-white bg-black' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab('tab3')}
          >
            Commodity
          </button>
          <button
            className={`py-2 px-4 transition-colors duration-300 ${activeTab === 'tab4' ? 'rounded-md text-white bg-black' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab('tab4')}
          >
            Investor
          </button>
        </div>
        <div className="relative">
          <select
            value={dropdownValue}
            onChange={(e) => setDropdownValue(e.target.value)}
            className="border rounded-lg py-2 bg-white border-gray-300 px-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled className="text-gray-400">Select an option</option>
            <option value="price" className="text-black">Price</option>
            <option value="latest" className="text-black">Latest</option>
            <option value="oldest" className="text-black">Oldest</option>
          </select>
        </div>
      </div>
      <div className="transition-all duration-500 flex flex-wrap">
        {sortedData.map((course, index) => {
          let widthClass = "w-full lg:w-1/2";
          if (index % 6 === 0) {
            widthClass = "w-full lg:w-1/3";
          } else if (index % 6 === 1) {
            widthClass = "w-full lg:w-2/3";
          } else if (index % 6 === 2 || index % 6 === 3) {
            widthClass = "w-full lg:w-1/2";
          } else if (index % 6 === 4) {
            widthClass = "w-full lg:w-2/3";
          } else if (index % 6 === 5) {
            widthClass = "w-full lg:w-1/3";
          }

          return (
            <div key={index} className={`p-2 ${widthClass}`}>
              <div className="webinarCard p-2">
                <div className="box-border flex flex-col justify-start items-center w-full p-4 bg-white border-gray-300 border-[1px] rounded-xl relative">
                  <div className="md:p-4 relative z-10 w-full">
                    <h3 className="text-2xl font-semibold text-black text-left">
                      {course.title}
                    </h3>
                    <div className="flex items-center mt-4">
                      <div className="flex-1 flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-2">
                          <img
                            src={course.image}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-lg font-medium text-gray-600">
                          {course.instructor}
                        </p>
                      </div>
                    </div>
                    <div className="border-black mt-2 pt-1 flex justify-center">
                        <div className="border-r border-black px-4 lg:px-12 text-center">
                          <p className="text-gray-600">Experience</p>
                          <p className="mb-1 text-gray-600">{course.experience}+</p>
                        </div>
                        <div className="px-4 lg:px-12 text-center">
                          <p className="text-gray-600">Followers</p>
                          <p className="mb-1 text-gray-600">{course.followers}k</p>
                        </div>
                      </div>
                    <div className="mt-2 pt-3 flex flex-col justify-center text-left">
                      <div className="flex flex-row">
                        <p className="mb-1 text-gray-600 pr-1">Date & Time:</p>
                        <p>{course.date}🔴</p>
                      </div>
                      <div className="flex flex-row">
                        <p className="mb-1 text-gray-600 pr-1">Duration:</p>
                        <p>{course.duration} hrs</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">
                          <span className="text-black text-4xl font-bold">₹1999</span>{" "}
                        </p>
                      </div>
                      <div>
                        <button className="bg-black rounded-md hover:bg-gray-800 text-base text-white py-1 px-8">
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WebinarTabs;
