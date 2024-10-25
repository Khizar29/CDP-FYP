import React from 'react';
import Quoteicon from "../../Images/quote-icon.svg";
import dummyimg from "../../Images/IMG_8487.jpg";

function Slide({ slide }) {
  // Add fallback for when slide is undefined or missing properties
  const { name = 'Unknown', message = 'No message available', title = '', image = dummyimg } = slide || {};

  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full sm:space-x-6 space-y-4 sm:space-y-0">
      <div className="flex-1 p-4 text-center sm:text-left">
        <p className="text-gray-800 text-sm text-center sm:text-lg italic mb-4 sm:text-left">{message}</p>
        <h3 className="text-lg sm:text-xl font-bold text-orange-400">{name}</h3>
        <p className="text-black-500 text-sm">{title}</p>
      </div>
      <div className="w-28 h-28 sm:w-48 sm:h-48 relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        <div className="absolute bg-indigo-200 bottom-0 left-1/2 transform  -translate-x-1/2 translate-y-1/2 shadow-md p-1 sm:p-2 rounded-full border-2 border-black">
          <img src={Quoteicon} alt="Quotes Icon" className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}

export default Slide;
