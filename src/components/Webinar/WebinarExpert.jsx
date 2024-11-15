import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../../style"; // Adjust the path based on your folder structure
import Marquee from "react-fast-marquee";
import { SlCalender } from "react-icons/sl";
import { CgLock } from "react-icons/cg";
import { demoImg, featured1, featured2, logo, SebiReg, userBck } from "../../assets";
import HowWebinarWorks from "./HowWebinarWorks";
import LearnWebinar from "./LearnWebinar";
import FAQs2 from "../About/FAQs2";
import WebinarFeatured from "./WebinarFeatured";

const WebinarExpert = () => {
  const { id } = useParams();
  const [expertData, setExpertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://copartners.in:5132/api/Experts/${id}`);
        setExpertData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expert data:", error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!expertData) {
    return <div>No data found</div>;
  }

  return (
    <div className="expertise-Bg text-white">
      <section className={`flex md:flex-row flex-col md:px-0 px-3 ${styles.paddingY} expertise-Bg`}>
        <div className={`flex-1 ${styles.flexStart} flex-col md:px-28 z-10`}>
          {/* <div className="md:hidden" style={{ width: '100vw', margin: '0 -50vw', left: '50%', position: 'relative' }}>
            <Marquee gradient={false} style={{ background: 'linear-gradient(90.81deg, #0181F1 -6.15%, #5ABEE2 54.57%, #AF53AC 107.78%)', color: 'white', padding: '10px 0' }}>
              <p className='px-30'>🥳 Celebrating 1 Million+ Learners 🥳 Special Offer!</p>
              <p className='px-40'>🥳 Celebrating 1 Million+ Learners 🥳 Special Offer!</p>
              <p className='px-40'>🥳 Celebrating 1 Million+ Learners 🥳 Special Offer!</p>
              <p className='px-40'>🥳 Celebrating 1 Million+ Learners 🥳 Special Offer!</p>
            </Marquee>
          </div> */}
          <div className="flex flex-col justify-between items-center w-full">
            <span className="font-inter text-center font-[700] md:text-[62px] text-[36px] text-gradient md:leading-[74px] leading-[48px]">
              Option Trading Tips <br /> Earn More
            </span>
            <p className="mt-2 text-center text-dimWhite md:text-[18px] text-[15px] md:block">
              Lorem ipsum dolor sit amet consectetur. Sit urna laoreet vel condimentum. 
            </p>
            <div className="flex flex-row justify-around items-center py-3 w-full">
              <span className="bg-[#ffffff4b] px-4 py-2 rounded-md border border-[#ffffff4b] flex flex-row items-center justify-center gap-2"><SlCalender />14th July 2024</span>
              <span className="bg-[#ffffff4b] px-4 py-2 rounded-md border border-[#ffffff4b] flex flex-row items-center justify-center gap-2"><CgLock /> 11:00 AM IST</span>
            </div>
          </div>
          
          <div key={expertData.id} className="flex flex-col justify-center items-center w-full mt-5">
            <div className="webinarProfile flex flex-row justify-around items-center w-full relative p-4">
              <div className="flex flex-col justify-between">
                <h1 className="text-2xl text-[#e4e4e790]">By</h1>
                <h1 className="text-2xl font-bold text-gradient">{expertData.name}</h1>
                <h3 className="text-md text-gray-400">{getExpertType(expertData.expertTypeId)}</h3>
                <div className="border-white mt-2 pt-1 flex justify-start">
                  <div className="border-r border-white pr-7 lg:px-12 text-center">
                    <p className="text-gray-300">Experience</p>
                    <p className="mb-1 text-gray-300">{expertData.experience}+</p>
                  </div>
                  <div className="pl-7 lg:px-12 text-center">
                    <p className="text-gray-300">Followers</p>
                    <p className="mb-1 text-gray-300">{(expertData.telegramFollower / 1000).toFixed(1)}k</p>
                  </div>
                </div>
              </div>
              <div className="relative flex-shrink-0 h-[150px] w-[150px] md:h-[150px] md:w-[150px] rounded-xl">
                <div className="relative h-full w-full">
                  <img src={userBck} alt="Background" className="absolute inset-0 h-full w-full object-contain" />
                  <img src={expertData.expertImagePath} alt="Expert" className="absolute inset-0 h-full w-full object-cover" style={{ zIndex: 0, maskImage: "linear-gradient(rgba(0, 0, 0, 1) 70%, transparent)" }} />
                  <img src={SebiReg} alt="SEBI Registration" className="absolute top-0 right-0 h-7 md:h-10 md:w-10" />
                </div>
              </div>
            </div>
            <div className="w-full px-4 flex flex-col justify-center items-center">
              <button className="w-full md:w-[1000px] bg-[#006ADC] text-[15px] font-semibold md:py-3 py-4 rounded-md">Buy Now at ₹1,999</button>
              <span className="mt-2">Offer ends in - <span className="text-[#A6EF67]">00:07</span></span>
            </div>
          </div>

          <WebinarFeatured />

          <div className="flex md:flex-row sm:flex-col flex-col">
            <HowWebinarWorks />
            <LearnWebinar />
          </div>
          <FAQs2 />
        </div>
      </section>
      <div className="fixed bottom-0 left-0 right-0 bg-[#006ADC] text-white text-center py-4 md:hidden z-50">
        <div className="flex justify-between items-center px-4">
          <div className="flex flex-col">
          <span className="text-[1.5rem] font-semibold">Enroll Now at </span>
          <span className="text-[1.5rem] font-semibold"> just ₹1,999</span>
          </div>
          <button className="bg-white text-[#006ADC] font-semibold py-2 px-4 rounded-md text-[15px]">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

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

export default WebinarExpert;
