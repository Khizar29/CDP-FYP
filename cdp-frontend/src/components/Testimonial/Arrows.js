import React from 'react';

function Arrows({ nextSlide, prevSlide }) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
      <button
        onClick={prevSlide}
        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full shadow-md"
      >
        <img src="/icons/icon-prev.svg" alt="Previous" className="w-4 h-4" />
      </button>
      <button
        onClick={nextSlide}
        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full shadow-md"
      >
        <img src="/icons/icon-next.svg" alt="Next" className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Arrows;
