import React from "react";
import {
  logo,
  linkedin,
  instagram,
  exclamation,
  danger,
  arrow,
} from "../../assets";
import { Link } from "react-router-dom";

const ProductList = [
  { name: "About Us", link: "/about", id: "about" },
  { name: "FAQ's", link: "/faqs", id: "faqs" },
  { name: "Features", link: "/about", id: "features" },
  { name: "Blog", link: "/blogs", id: "blog" },
  { name: "Privacy Policy", link: "/privacy", id: "privacy" },
  { name: "Terms of Service", link: "/terms_of_service", id: "terms" },
];

const CommunityList = [
  { name: "Expertises", link: "/expertise" },
  { name: "Subscription", link: "/subscription" },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="md:w-[1440px] w-full md:h-[198px] md:gap-0 h-[540px] md:pt-[8rem] pt-4 justify-around border-t border-solid border-gray-200 flex md:flex-row flex-col items-center">
        <div className="flex flex-col gap-[0.5rem] relative">
          <div className="relative">
            <img src={logo} alt="Logo" className="md:w-56 w-40" />
            <div className="absolute top-1 right-0 transform -translate-x-1/2 flex gap-2 md:hidden">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.linkedin.com/company/copartnerindia/"
              >
                <img src={linkedin} alt="LinkedIn" className="w-8" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.instagram.com/copartner.in"
              >
                <img src={instagram} alt="Instagram" className="w-8" />
              </a>
            </div>
          </div>
          <span className="md:w-[296px] w-[296px] md:h-[84px] h-[66px] font-normal md:text-[16px] text-[14px] md:leading-[20px] leading-[22px] text-gray-700">
            Connecting India’s SEBI registered Research Analysts, guiding you
            thoroughly to maximizing profits in the dynamic world of stock
            trading.
          </span>
          <div className="flex gap-7 rounded-full md:flex hidden">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/company/copartnerindia/"
            >
              <img src={linkedin} alt="LinkedIn" className="w-8" />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/copartner.in"
            >
              <img src={instagram} alt="Instagram" className="w-8" />
            </a>
          </div>
          <div className="justify-start flex-col md:block hidden items-start py-2 md:w-[296px] w-[296px] md:h-[80px] h-[66px] md:leading-[20px] leading-[14px]">
            <span className="flex items-start gap-2 md:text-[12px] text-[10px] text-gray-500 mt-[10px]">
              <img src={exclamation} className="w-5 h-5" alt="Exclamation" />
              Disclaimer: Investments in securities market are subject to market
              risks, read all the related documents carefully before investing.
              For further disclosures.
            </span>
            <Link
              onClick={scrollToTop}
              className="text-gray-700 text-sm ml-7 flex items-center"
              to="disclaimer"
            >
              Read More <img className="w-4" src={arrow} alt="Arrow" />
            </Link>
          </div>
        </div>
        <div className="flex flex-row gap-[4rem]">
          <div className="flex flex-col justify-around w-full h-[210px]">
            <span className="w-[48px] h-[15px] font-medium md:text-[20px] text-[18px] leading-[14.7px] mb-4 text-gray-900">
              Company
            </span>
            {ProductList.map((product) => (
              <Link
                onClick={scrollToTop}
                to={product.link}
                key={product.id}
                className="font-normal text-[0.9rem] text-left leading-[14.7px] text-gray-700 hover:text-gray-900"
              >
                {product.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col justify-between w-[117px] md:h-[86px] h-[86px] mt-[4px]">
            <span className="md:w-[140px] w-[125px] font-medium md:text-[20px] text-[18px] leading-[20px] text-gray-900">
              What We Offer
            </span>
            {CommunityList.map((community) => (
              <Link
                onClick={scrollToTop}
                to={community.link}
                key={community.link}
                className="font-normal text-[0.9rem] leading-[14.7px] text-gray-700 text-left hover:text-gray-900"
              >
                {community.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="justify-start flex-col md:hidden block items-start py-2 md:w-[296px] md:h-[80px] mx-8 md:leading-[20px] leading-[14px]">
          <span className="flex items-start gap-2 md:text-[12px] text-xs text-gray-500 mt-[10px]">
            <img src={exclamation} className="w-5 h-5" alt="Exclamation" />
            Disclaimer: Investments in securities market are subject to market
            risks, read all the related documents carefully before investing.
            For further disclosures.
          </span>
          <Link
            onClick={scrollToTop}
            className="text-gray-700 text-sm ml-7 flex items-center"
            to="disclaimer"
          >
            Read More <img className="w-4" src={arrow} alt="Arrow" />
          </Link>
        </div>
      </div>
      <span className="text-gray-700 flex justify-center md:w-full mx-auto items-center text-center font-[400] text-[12px] leading-[15px] md:mb-0 mb-4 md:mt-[11rem]">
        @Copyright 2024. All rights reserved
      </span>
      <div
        style={{
          backgroundImage:
            "linear-gradient(94.34deg, #FFFFFF 0%, #9BD0F5 100%)",
        }}
        className="md:mt-[2rem] w-full justify-around flex md:flex-row flex-col items-center"
      >
        <div className="border-[1px] p-2 md:px-[50px] rounded-md">
          <span className="flex gap-2 md:text-[16px] text-[15px] text-gray-700 md:my-[10px] marquee">
            <img src={danger} className="w-5 h-5" alt="Danger" />
            <span>
              Disclaimer: The investment advice, trading tips, strategies,
              courses, webinars, and other information provided by SEBI
              registered research analysts on the COPARTNER platform represent
              their individual views and opinions. COPARTNER does not endorse or
              validate these views, and users are encouraged to conduct their
              own research and exercise caution before acting upon any
              information provided.
            </span>
          </span>
        </div>
      </div>
    </>
  );
};

export default Footer;
