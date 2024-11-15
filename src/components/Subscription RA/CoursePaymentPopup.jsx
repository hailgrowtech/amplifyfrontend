import React, { useEffect, useState } from 'react';
import { close } from '../../assets';
import KYCPopup from './KYCPopup';

const CoursePaymentPopup = ({ onClose, selectedPlan, planPrice, expertName }) => {
  const gstRate = 0.18;
  const [showKYCPopup, setShowKYCPopup] = useState(false);
  const handlePay = () => {
    setShowKYCPopup(true); // Show KYC popup when Pay button is clicked
  };


  // Calculate total price including GST
  const total = (planPrice || 0) * (1 + gstRate);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#18181be2] border-[1px] border-[#ffffff24] rounded shadow-md w-[400px] relative">
        <button className="absolute top-1 right-1" onClick={handleClose}>
          <img src={close} alt="" className="h-10 w-10" />
        </button>
        <div className='border-b-2 py-3 px-6'>
          <h2 className="text-2xl font-bold subheading-color text-left">Your Subscription Details</h2>
        </div>
        <div className="flex flex-col p-6">
          <div className="flex justify-between mb-2">
            <label className="block text-sm text-[#c9c9c9] font-normal">Subscription</label>
            <span className="text-sm">{selectedPlan || "Monthly"}</span> {/* Show default "Monthly" if no plan selected */}
          </div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm text-[#c9c9c9] font-normal">Name</label>
            <span className="text-sm">{expertName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm text-[#c9c9c9] font-normal">Amount</label>
            <span className="text-sm">₹{planPrice}</span>
          </div>
          <div className="flex justify-between py-2 mb-4 border-b-[1px] border-t-[1px] border-[#c9c9c962]">
            <label className="block text-lg text-[#c9c9c9] font-semibold">Total</label>
            <span className="text-lg font-semibold">₹{total.toFixed(2)}</span>
          </div>
          <button className="bg-[#fff] text-[#000] py-3 px-2 rounded-sm hover:bg-[#000] hover:text-[#fff] transition duration-300" onClick={handlePay}>
            Pay
          </button>
        </div>
      </div>
      {showKYCPopup && <KYCPopup onClose={handleClose} />} {/* Render KYCPopup when showKYCPopup is true */}
    </div>
  );
};

export default CoursePaymentPopup;
