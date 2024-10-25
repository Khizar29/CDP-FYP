import React, { useState, useEffect } from 'react';
import Slide from './Slide';
import Arrows from './Arrows';
import axios from 'axios'; // Import axios to make API calls

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]); // State to hold the fetched testimonials
  const [loading, setLoading] = useState(true); // For loading feedback

  // Fetch testimonials when the component is mounted
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/testimonials`);
        if (response.data.data && response.data.data.length > 0) {
          setSlides(response.data.data); // Set the slides with the fetched testimonials
        } else {
          console.log("No testimonials available");
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchTestimonials(); // Call the function
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Slide every 3 seconds
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  if (loading) {
    return <p>Loading testimonials...</p>; // Show a loading message while fetching testimonials
  }

  if (slides.length === 0) {
    return <p>No testimonials available.</p>; // Show this if no testimonials are available
  }

  return (
    <div className="relative max-w-4xl mx-10 p-8 space-y-4 sm:space-y-0 sm:p-14 sm:space-x-8 sm:flex sm:flex-row flex-col backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 rounded-lg shadow-xl border border-white/20">
      <Slide slide={slides[currentIndex]} />
      <Arrows nextSlide={nextSlide} prevSlide={prevSlide} />
    </div>
  );
}

export default Slider;
