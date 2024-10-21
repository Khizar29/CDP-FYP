import React from 'react';
import arrowleft from "../../Images/arrow-left.svg";
import arrowright from "../../Images/arrow-right.svg";

function Arrows({ nextSlide, prevSlide }) {
  return (
    <div className="flex justify-center space-x-4 pt-6 sm:absolute sm:bottom-4 sm:left-1/2 sm:transform sm:-translate-x-1/2">
      <button
        onClick={prevSlide}
        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-orange-200 rounded-full shadow-md"
      >
        <img src={arrowleft} alt="Previous" className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>
      <button
        onClick={nextSlide}
        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center  hover:bg-orange-200 rounded-full shadow-md"
      >
        <img src={arrowright} alt="Next" className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>
    </div>
  );
}


export default Arrows;
