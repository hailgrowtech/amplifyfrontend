import React from 'react'
import { featured1, featured2, logo } from '../../assets'

const WebinarFeatured = () => {
  return (
    <div className='secondSection w-full flex md:flex-row flex-col justify-center items-center gap-4 mt-8'>
    <div className="flex flex-col md:flex-row justify-center items-center">
      <div className='flex flex-col justify-center items-center'>
        <span>Brought to you by</span>
        <span className='md:mt-4 mt-2'>
          <img src={logo} alt="Logo" className='w-50 max-w-[200px]' />
        </span>
      </div>
      <div className='flex flex-col justify-center items-center md:mt-0 mt-8'>
        <span>Featured In</span>
        <span className='mt-2 flex'>
          <img src={featured2} alt="Featured In" className='w-60' />
          <img src={featured1} alt="Featured In" className='w-60' />
        </span>
      </div>
    </div>
  </div>
  )
}

export default WebinarFeatured