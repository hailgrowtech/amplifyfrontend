import React from 'react';
import { continueCoursesData } from '../../constants';
import starImage from '../../assets/Stars Minimalistic.png';
import telegramImage from '../../assets/telegram.png';
import arrow from '../../assets/arrow.png';
import { Link } from 'react-router-dom';

const ContinueCards = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {continueCoursesData.map((course, index) => (
        <div key={index} className="w-full md:w-1/3 p-3 rounded-md mb-8 md:mb-0">
          <Link to="/subscription/course">
          <div className="group w-full overflow-hidden relative rounded-lg bg-transparent hover:border border-solid border-[#f4f4f51d] transition duration-300 ease-in-out transform hover:bg-[#18181ba6] hover:border-solid hover:border-[#f4f4f51d] hover:shadow-lg">
              <img
                src={course.imageUrl}
                alt="Course_Image"
                className="w-full h-60 object-cover rounded-md"
                style={{
                  maskImage: 'linear-gradient(rgba(0, 0, 0, 1) 70%, transparent)'
                }}
              />

              <div className="absolute top-0 right-0 m-2 flex items-center justify-center rounded-full bg-opacity-50 text-white">
                <img src={starImage} alt="Star" className="w-4 h-4 mr-1" />
                <span className="mr-1">4.4</span>
              </div>

              <div className='px-4'>
                <div className="mt-4 custom-progress-bar">
                  <div className="progress"></div>
                </div>
              </div>

              <div className="p-4 relative z-10">
                <h3 className="text-2xl text-left">{course.title}</h3>
                <div className="flex items-center mt-4">
                  <div className="flex-1 flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                      <img
                        src={course.image}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <p className="text-sm font-medium text-dimWhite">
                      {course.instructor}
                    </p>

                    <div className="flex-1 flex justify-end items-center">
                      <span className="join-Telegram flex text-dimWhite"> Join <img src={telegramImage} alt="Telegram" className="w-5 h-5 ml-1" /></span>
                    </div>
                  </div>
                </div>

                <div className="border-white mt-2 pt-1 flex justify-center">
                  <div className="border-r border-white px-[60px] text-center">
                    <p className="mb-1 text-dimWhite">Experience</p>
                    <p>{course.experience}+</p>
                  </div>
                  <div className="px-[60px] text-center">
                    <p className="mb-1 text-dimWhite">Followers</p>
                    <p>{course.followers}</p>
                  </div>
                </div>

                <div className="mt-2 pt-3 flex justify-between">
                  <div className="pl-1">
                    <p className="mb-1 text-dimWhite">Duration: <span className="text-white">{course.duration}</span> </p>
                  </div>
                  <div className="px-4">
                    <p className="mb-1 text-dimWhite text-right">Session: <span className="text-white">{course.session}</span></p>
                  </div>
                </div>

                <div className="pl-1">
                  <p className="mb-1 text-dimWhite">Completed Session: <span className="text-white">{course.completedSession}</span> </p>
                </div>

                <div className="mt-4 pt-3 flex justify-center items-center">
                  <button className="continueBtn" style={{ backgroundColor: 'transparent', border: '1px solid #ffffff6b', borderRadius: '20px', padding: '10px 20px', color: 'white', display: 'flex', alignItems: 'center' }}>
                    Continue Course
                    <img src={arrow} alt="" className='md:w-5 md:mt-1 w-5 mt-1' style={{ marginLeft: '5px' }} />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ContinueCards;
