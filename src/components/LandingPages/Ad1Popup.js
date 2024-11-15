import React from "react";
import {
  adityaBirla,
  angelOne,
  kotak,
  mStock,
  paisa5,
  upStock,
} from "../../assets/LandingPages";

const Ad1Popup = ({ isOpen, onClose }) => {
  return (
    <><div className={`overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`popup ${isOpen ? "open" : ""}`}>
        <div className="popup-content w-full grid grid-cols-2 gap-3">
          <a
            href="https://www.angelone.in/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center shadow-sm bg-white rounded-2xl py-2"
          >
            <img className="w-8 h-8 mx-2" src={angelOne} alt="" />
            <p className="text-sm">AngelOne</p>
          </a>
          <a
            href="https://www.5paisa.com/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center shadow-sm bg-white rounded-2xl py-2"
          >
            <img className="w-8 h-8 mx-2" src={paisa5} alt="" />
            <p className="text-sm">5 Paisa</p>
          </a>
          <a
            href="https://www.kotak.com/en/home.html"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center shadow-sm bg-white rounded-2xl py-2"
          >
            <img className="w-8 h-8 mx-2" src={kotak} alt="" />
            <p className="text-sm">Kotak</p>
          </a>
          <a
            href="https://www.mstock.com/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center shadow-sm bg-white rounded-2xl py-2"
          >
            <img className="w-8 h-8 mx-2" src={mStock} alt="" />
            <p className="text-sm">M Stock</p>
          </a>
          <a
            href="https://www.adityabirla.com/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center shadow-sm bg-white rounded-2xl py-2"
          >
            <img className="w-8 h-8 mx-2" src={adityaBirla} alt="" />
            <p className="text-sm">Aditya Birla</p>
          </a>
          <a
            href="https://upstox.com/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center shadow-sm bg-white rounded-2xl py-2"
          >
            <img className="w-8 h-8 mx-2" src={upStock} alt="" />
            <p className="text-sm">Up Stox</p>
          </a>
        </div>
        <button className="close-btn mb-2 w-2/3" onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default Ad1Popup;
