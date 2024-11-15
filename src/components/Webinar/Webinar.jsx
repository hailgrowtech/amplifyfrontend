import React from "react";
import styles from "../../style"; // Adjust the path based on your folder structure
import LiveWebinar from "./LiveWebinar";
import WebinarTabs from "./WebinarTabs";

const Webinar = () => {
  return (
    <div className="expertise-Bg text-black">
      <section
      className={`flex md:flex-row flex-col md:px-0 px-3 ${styles.paddingY} expertise-Bg`}
      >
        <div
          className={`flex-1 ${styles.flexStart} flex-col md:px-28 z-10`}
        >
          <div className="flex flex-col justify-between items-center w-full">
            <span className="font-inter font-[700] md:text-[62px] text-[36px] text-gradient md:leading-[74px] leading-[48px]">
              Webinar
            </span>
            <p className="mt-2 text-center text-gray-700 md:text-[18px] text-[15px] md:block">
              Access premium insights from our expert team, guiding you
              <br />
              towards successful trades and informed decisions in the markets.
            </p>
           
          </div>
          <div className="flex flex-col justify-center items-center w-full mt-10">
            <div className="flex md:flex-row flex-col md:justify-between items-center py-3 w-full">
              <h1 className="subheading-color text-5xl">Currently Live</h1>
              <div className="md:w-[600px] md:text-left text-center text-gray-600 p-2">
                With Cobalt, managing your business finances is effortless,
                empowering.
                <span className="text-black">
                  Say no to spreadsheets and tools designed in the 80s.
                </span>{" "}
              </div>
            </div>
            <LiveWebinar />
          </div>

          <div className="flex flex-col justify-center items-center w-full mt-10">
            <div className="w-full">
              <h1 className="subheading-color md:text-left text-center text-5xl">Webinar</h1>
              <div>
                <WebinarTabs />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Webinar;
