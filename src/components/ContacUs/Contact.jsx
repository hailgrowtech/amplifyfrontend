import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "../../style";
import { call, message, location, contact } from "../../assets";
import { FaLocationDot } from "react-icons/fa6";
import emailjs from "@emailjs/browser";
import { IoMdCall } from "react-icons/io";
import { CgMail } from "react-icons/cg";

const ContactUs = () => {
  const form = useRef();
  const [formValues, setFormValues] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [sentSuccessfully, setSentSuccessfully] = useState(false);
  const [noMessageError, setNoMessageError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!formValues.message.trim()) {
      setNoMessageError(true);
      setTimeout(() => {
        setNoMessageError(false);
      }, 3000);
      return;
    }
    emailjs
      .sendForm("service_bhqnje8", "template_e0dbhce", form.current, {
        publicKey: "j1_x-tdXkLZ4zbrpW",
      })
      .then(
        (result) => {
          console.log(result.text);
          setSentSuccessfully(true);
          setFormValues({
            name: "",
            mobile: "",
            email: "",
            message: "",
          });
          setTimeout(() => {
            setSentSuccessfully(false);
          }, 3000);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <motion.div
      className="box"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01]
      }}
    >
      <div className={`flex flex-col ${styles.paddingY} header-bg `}>
        <div
          className={`flex-1 ${styles.flexCenter} flex-col xl:px-0 sm:px-4 px-2 z-10 md:bottom-[10rem] text-center`}
        >
          <div className="flex md:flex-row flex-col gap-4 text-black rounded-xl relative md:w-[1200px]">
            {/* Left Column */}
            <h2 className="text-5xl md:text-5xl font-bold text-[#24243F] md:hidden text-left px-3 pt-3">
              Contact Us
            </h2>
            <p className="text-base text-left px-3 md:text-lg mb-4 text-[#000] md:hidden z-20">
              We'd love to hear from you. Please fill out the form below and we'll
              get back to you as soon as possible.
            </p>
            <div className="w-full md:w-1/3 md:border md:bg-[#eeeeee] md:shadow-lg bg-transparent md:border-[#33333324] p-4 rounded-xl relative md:h-[600px]">
              {/* Contact Image */}
              <img
                src={contact}
                alt="Contact"
                className="absolute md:bottom-0 bottom-5 right-[0] z-10 md:w-[160px] w-[120px] md:h-[400px] h-70"
              />
              {/* Call */}
              <div className="flex items-center mb-4">
                {/* <img src={call} alt="Call" className="w-3 h-3 mr-2" /> */}
                <IoMdCall className="w-4 h-4 mr-2" />

                <p className="text-left text-black">+91-9205440790 (1 P.M - 7 P.M)</p>
              </div>
              {/* Mail */}
              <div className="flex items-center mb-4">
                {/* <img src={message} alt="Mail" className="w-4 h-4 mr-2" /> */}
                <CgMail className="w-5 h-5 mr-2"/>
                <a href="mailto:info@copartner.in" className="text-left text-black">
                  info@copartner.in
                </a>
              </div>
              {/* Location */}
              <div className="flex">
                {/* <img
                  src={location}
                  alt="Location"
                  className="w-5 h-5 mr-2 mt-1"
                /> */}
                <FaLocationDot className="w-5 h-5 mr-2 mt-1" />
                <p className="text-left text-black">
                  Copartner, Hailgro Tech, 546, 5th floor, JMD MEGAPOLIS, Sector
                  48, Gurugram, Haryana 122018
                </p>
              </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col w-full md:w-2/3 md:p-10 px-5 rounded-lg text-left bg-[#eeeeee] shadow-lg border-[1px] border-[#33333324] md:h-[600px] h-[520px]">
              {/* Heading */}
              <h2 className="md:text-6xl text-[#24243F] font-bold mb-4 md:block hidden">
                Contact Us
              </h2>
              {/* Description */}
              <p className="text-base md:text-lg mb-4 text-[#000] md:block hidden">
                We'd love to hear from you. Please fill out the form below and
                we'll get back to you as soon as possible.
              </p>
              {/* Form */}
              <form
                ref={form}
                className="flex flex-col gap-2"
                onSubmit={handleFormSubmit}
              >
                <div className="flex flex-col md:flex-row gap-7 py-5">
                  <div className="flex flex-col w-full md:w-1/2">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      id="name"
                      name="name"
                      value={formValues.name}
                      placeholder="Name"
                      className="border border-[#33333340] border-opacity-50 bg-transparent py-3 p-2 rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/2">
                    <input
                      onChange={handleInputChange}
                      type="email"
                      id="email"
                      name="email"
                      value={formValues.email}
                      placeholder="Email"
                      className="border border-[#3333333d] border-opacity-50 bg-transparent py-3 p-2 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col pb-4">
                  <input
                    onChange={handleInputChange}
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formValues.mobile}
                    placeholder="Mobile Number"
                    className="border border-[#3333333d] border-opacity-50 bg-transparent py-3 p-2 rounded-xl"
                  />
                </div>
                <div className="flex flex-col">
                  <textarea
                    onChange={handleInputChange}
                    id="message"
                    name="message"
                    value={formValues.message}
                    rows="6"
                    placeholder="Message"
                    className="border border-[#3333333d] border-opacity-50 bg-transparent py-3 p-2 rounded-xl"
                  ></textarea>
                </div>
                <div className="text-center md:py-3 py-3">
                  <button
                    type="submit"
                    className="bg-[#000] hover:bg-[#333] text-white py-2 px-7 rounded-md transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {sentSuccessfully && (
          <div className="fixed bottom-5 right-5 z-50">
            <div
              id="alert-border-3"
              className="flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-[#fff] dark:border-green-800 rounded-xl"
              role="alert"
              style={{ width: "300px" }}
            >
              <svg
                className="flex-shrink-0 w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <div className="ms-5 mr-5 text-sm font-medium">
                Your message has been sent!
              </div>
            </div>
          </div>
        )}
        {noMessageError && (
          <div className="fixed bottom-5 right-5 z-50">
            <div
              id="alert-border-4"
              className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-[#fff] dark:border-red-800 rounded-xl"
              role="alert"
              style={{ width: "300px" }}
            >
              <svg
                className="flex-shrink-0 w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2 2.5A1.5 1.5 0 0 1 3.5 1h13A1.5 1.5 0 0 1 18 2.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 15.5v-13zM5.62 7.38a.75.75 0 0 1 1.06-1.06L10 8.94l3.31-3.32a.75.75 0 1 1 1.06 1.06L11.06 10l3.31 3.31a.75.75 0 1 1-1.06 1.06L10 11.06l-3.32 3.31a.75.75 0 1 1-1.06-1.06L8.94 10 5.62 6.69z"
                ></path>
              </svg>
              <div className="ms-5 mr-5 text-sm font-medium">
                Please provide a message.
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactUs;
