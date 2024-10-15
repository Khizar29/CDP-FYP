import React, { useState } from 'react';
import Slide from './Slide';
import Arrows from './Arrows';

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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  return (
    <div className="relative max-w-4xl mx-auto bg-white shadow-lg rounded-lg flex p-8 space-x-8">
      <Slide slide={slides[currentIndex]} />
      <Arrows nextSlide={nextSlide} prevSlide={prevSlide} />
    </div>
  );
}

export default Slider;
