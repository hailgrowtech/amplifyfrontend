import React from "react";
import BuyNowCards from "./BuyNowCards";

const BuyNow = () => {
  return (
    <div className="flex flex-col">
      {/* <div className="flex md:flex-row flex-col md:justify-between items-center py-3 w-full">
        <h1 className="subheading-color text-5xl">Buy Now</h1>
        <div className="md:w-[600px] md:text-left text-center text-[#ffffffa2] p-2">
          Guiding Your Investments to Greatness: Our Expertise, Your Financial
          Advantage!{" "}
          <span className="text-white">
            Say no to spreadsheets and tools designed in the 80s.
          </span>
        </div>
      </div> */}
      <div className="md:flex">
        <BuyNowCards />
      </div>

      {/* <div className='md:hidden'>
            <LiveChatCarousel />
            </div> */}
    </div>
  );
};

export default BuyNow;
