import React, { useState, useEffect } from 'react';
import Slide from './Slide';
import Arrows from './Arrows';
import dummyimg from "../../Images/IMG_8487.jpg"

const slides = [
  {
    url: '/images/image-tanya.jpg',
    name: 'Tanya Sinclair',
    text: '“I’ve been interested in coding for a while but never taken the jump, until now. I couldn’t recommend this course enough. I’m now in the job of my dreams and so excited about the future.”',
    title: 'UX Engineer',
  },
  {
    url: '/images/image-john.jpg',
    name: 'John Tarkpor',
    text: '“If you want to lay the best foundation possible I’d recommend taking this course. The depth the instructors go into is incredible. I now feel so confident about starting up as a professional developer.”',
    title: 'Junior Front-End Developer',
  },
];

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Slide every 5 seconds
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  return (
    <div className="relative max-w-4xl mx-10 p-8 space-y-4 sm:space-y-0 sm:p-14 sm:space-x-8 sm:flex sm:flex-row flex-col backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 rounded-lg shadow-xl border border-white/20">
      <Slide slide={slides[currentIndex]}  />
      <Arrows nextSlide={nextSlide} prevSlide={prevSlide} />
    </div>
  );
}

export default Slider;
