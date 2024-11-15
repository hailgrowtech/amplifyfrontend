import React from 'react';
import starImage from '../../assets/Stars Minimalistic.png';
import telegramImage from '../../assets/telegram.png';
import { courses } from '../../constants';

const RecommendCourse = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {courses.slice(0, 6).map((course, index) => (
        <div key={index} className="w-full md:w-1/3 p-3 rounded-md mb-8 md:mb-0">
          <div className="w-full overflow-hidden relative rounded-lg bg-[#18181ba6] border border-solid border-[#f4f4f51d]">
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
              <span className="mr-1">{course.rating}</span>
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
              <div className="mt-4 pt-3 flex justify-between items-center">
            <div>
              <p className="text-dimWhite"><span className="text-white text-2xl font-bold">₹1599/-</span> </p>
            </div>
            <div>
              <button className="bg-white rounded-md hover:bg-white text-base text-black py-1 px-8">
                Buy Now
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendCourse;
