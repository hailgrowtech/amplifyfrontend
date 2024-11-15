import React from 'react';
import { clientImg, stars, userBck, telegram, arrow } from '../../assets';
import { Link } from 'react-router-dom';

const SingleExpertCard = () => {
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Link onClick={scrollToTop} to="/ra-detail">
    <div className='profile-div rounded-xl'>
      <div className="background-wrapper">
        <img src={userBck} alt="Background" className="background-image" />
        <div>
          <img src={clientImg} alt="Default Profile" className="profile-image_1 mx-auto" />
        </div>
      </div>
      <div className="info">
        <div className="name-rating md:mb-6 mb-2">
          <div className="name-role text-white">
            <h3>Arun Kumar</h3>
            <p>Futures & Options</p>
          </div>
          <div className="rating text-white">
            <div className='flex items-center gap-1'>
              <img src={stars} alt="stars" className="w-[11.5px] h-[11.5px]" />4.4
            </div>
          </div>
        </div>
        <div className="experience-followers text-white md:mb-5 mb-2">
          <div className="experience"> <span>Experience</span> <br/>7+</div>
          <div className="followers"> <span>Followers </span><br/>3.1k</div>
        </div>
        <div className="description text-dimWhite md:mb-6 mb-2 text-[15px]">Have full control of your business finances on the go using our iOS</div>
        <div className="prize-subscription text-white">
          <button className='flex items-center mx-auto md:py-1.5 py-1 md:px-6 px-2 border-solid border-2 border-[#4e4e4ecc] rounded-3xl'>
            <img width={"24rem"} src={telegram} alt='telegram' className='rounded-[50%] text-[1.5rem] telegram me-3' />
              Join Telegram
              <img width={"17rem"} src={arrow} alt='arrow' className='ms-3'/>
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default SingleExpertCard;
