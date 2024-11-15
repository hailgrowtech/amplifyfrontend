import React from 'react';
import CourseCard from './CourseCard';
import { courses } from '../../constants';



const CourseList = () => {
 const slicedCourses = courses.slice(0, 5);


  return (
    <div className="flex flex-wrap justify-center courseCard">
      {slicedCourses.map((course, index) => (
        <CourseCard key={index} courseData={course} />
      ))}
    </div>
  );
};

export default CourseList;
