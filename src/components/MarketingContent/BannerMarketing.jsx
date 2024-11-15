import React from 'react';
import { FaPen } from 'react-icons/fa';
import Bin from "../../assets/TrashBinMinimalistic.png";
import { toast } from 'react-toastify';

const BannerMarketing = ({ banner, update, onEditClick }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`https://copartners.in:5134/api/MarketingContent/${banner.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }

      toast.success('Banner deleted successfully!');
      update();
    } catch (error) {
      console.error('Deleting error:', error);
      toast.error('Failed to delete banner');
    }
  };

  return (
    <div className="bg-gray-100 rounded shadow-md flex flex-col items-center px-4 py-2">
      <div className="text-center flex items-center justify-between w-full">
        <div className="font-bold">
          {banner.bannerName}
        </div>
        <div className="flex space-x-2">
          <button
            aria-label="Edit"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => onEditClick(banner)}
          >
            <FaPen className="text-blue-600 cursor-pointer" />
          </button>
          <button
            aria-label="Delete"
            className="focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleDelete}
          >
            <img
              className="w-6 h-6 cursor-pointer"
              src={Bin}
              alt="Delete"
            />
          </button>
        </div>
      </div>
      <div className="w-full h-full my-2">
        <img
          src={banner?.imagePath}
          alt={banner.bannerName}
          className="w-full h-48 object-cover"
        />
      </div>
    </div>
  );
};

export default BannerMarketing;
