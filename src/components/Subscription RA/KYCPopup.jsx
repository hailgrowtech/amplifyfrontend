import React, { useEffect, useRef, useState } from 'react';
import { close, exclamation } from '../../assets';

const KYCPopup = ({ onClose }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Disable scrolling on the body element when the popup is mounted
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling on the body element when the popup is unmounted
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleUpload = () => {
    // Trigger click event of file input element
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    // Handle file change event here
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#18181be2] border-[1px] border-[#ffffff24] rounded shadow-md md:w-[400px] relative">
        <button className="absolute top-1 right-1" onClick={handleClose}>
          <img src={close} alt="" className="h-8 w-8" />
        </button>
        <div className='border-b-2 py-3 px-6'>
          <h2 className="md:text-2xl text-xl font-bold subheading-color text-left">KYC Verification</h2>
        </div>
        <div className="flex flex-col p-6">
          <div className="text-sm mb-2">
            Upload Your Adhar Card Image
          </div>
          <div className='justify-center items-center flex md:mb-2 my-3 border-[1px] border-dashed rounded-lg'>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className='p-3 md:text-[20px] text-[10px]' onClick={handleUpload}>Select</button>
          </div>
          {selectedFile && (
            <div className="text-sm mb-2">
              Selected File: {selectedFile.name}
            </div>
          )}
          <div className='justify-start items-center flex py-2'>
            <span className='flex items-center gap-2 md:text-[12px] text-[10px]'>
                <img src={exclamation} className='w-5 h-5' alt="" />
                Subscription
            </span>
          </div>
          <button className="bg-[#fff] text-[#000] py-3 px-2 rounded-sm hover:bg-[#000] hover:text-[#fff] transition duration-300">
            Upload Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCPopup;
