import React from 'react';

function Slide({ slide }) {
  return (
    <div className="flex items-center justify-between w-full space-x-6">
      <div className="flex-1 p-4">
        <p className="text-gray-700 text-lg italic mb-6">{slide.text}</p>
        <h3 className="text-xl font-bold text-blue-900">{slide.name}</h3>
        <p className="text-gray-500">{slide.title}</p>
      </div>
      <div className="w-48 h-48 relative">
        <img
          src={slide.url}
          alt={slide.name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-md p-2 rounded-full">
          <img src="/icons/icon-quotes.svg" alt="Quotes Icon" className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}

export default Slide;
