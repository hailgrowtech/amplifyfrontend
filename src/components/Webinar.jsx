import React from 'react'
import styles from "../style";

const Webinar = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6 z-10 md:bottom-[10rem]`}
      >
        <div className="flex flex-row justify-between items-center w-full">
          <span
            className="flex-1 font-poppins font-semibold md:text-[62px] text-[36px]
      text-gradient md:leading-[84px] leading-[48px]"
          >
            Webinar
          </span>
        </div>
      </div>
    </section>
  )
}

export default Webinar