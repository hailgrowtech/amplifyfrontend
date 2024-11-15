import React from "react";
import { Group } from "../assets";
import { Link } from "react-router-dom";

const Stock = () => {
  return (
    <div className="p-1 mb-4">
      <div className="flex flex-col md:flex-row mb-8 md:text-left text-center items-center justify-start">
        <div className="md:pr-8 mb-8 md:mb-0">
          <h2 className="font-bold md:text-6xl text-3xl text-gray-900">
            Our Stock Market
            Expertise
          </h2>
          <p className="md:text-xl text-md text-gray-700 md:px-1 px-1 md:hidden">
            Guiding traders towards profitable decisions in the dynamic stock
            market landscape.
          </p>
          <p className="md:text-xl text-gray-700 mb-6 md:px-1 px-4 md:block hidden">
            Tap into our stock market expertise and elevate your trading journey
            with informed insights and strategic guidance.
            <br />
            Guiding traders towards profitable decisions in the dynamic stock
            market landscape.
          </p>
          <div className="ml-1 md:block hidden">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfvXlECAFh4J984zNsSwdKC7o0MSf2GKJndd7S1Lrfb4Eu9ew/viewform?vc=0&c=0&w=1&flr=0"
              target="_blank"
              rel="noreferrer"
              className="bg-black cursor-pointer text-white text-base font-medium px-5 py-2.5 rounded-md relative overflow-hidden transition-all duration-400 transform hover:bg-gray-700 hover:scale-110 hover:z-10"
            >
              Join Expert Team
            </a>
          </div>
        </div>

        <div className="w-1/2 relative">
          {/* <img
            src={Group}
            alt="Stock"
            className="w-90"
            style={{
              maskImage: "linear-gradient(rgba(0, 0, 0, 1) 70%, transparent)",
            }}
          /> */}
          <div className="md:hidden">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfvXlECAFh4J984zNsSwdKC7o0MSf2GKJndd7S1Lrfb4Eu9ew/viewform?vc=0&c=0&w=1&flr=0"
              target="_blank"
              rel="noreferrer"
              className="bg-black cursor-pointer text-white text-base font-medium px-5 py-2.5 rounded-md relative overflow-hidden transition-all duration-400 transform hover:bg-gray-700 hover:scale-110 hover:z-10"
            >
              Join Expert Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;
