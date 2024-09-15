// src/components/Testimonials.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    name: "John Doe",
    position: "Software Engineer",
    company: "Google",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    feedback: "FAST Career Development Portal helped me land my dream job at Google."
  },
  {
    name: "Jane Smith",
    position: "Product Manager",
    company: "Amazon",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    feedback: "Thanks to FAST's career services, I improved my resume and interview skills."
  },
  {
    name: "Emily Johnson",
    position: "Data Analyst",
    company: "Facebook",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    feedback: "The mock interviews were especially helpful in boosting my confidence."
  },
  {
    name: "Michael Brown",
    position: "Software Architect",
    company: "Microsoft",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    feedback: "A fantastic portal for students looking to build their careers!"
  },
  {
    name: "Lisa Taylor",
    position: "UX Designer",
    company: "Spotify",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    feedback: "Thanks to the resources at FAST, I secured my position at Spotify."
  },
  {
    name: "Mark Wilson",
    position: "DevOps Engineer",
    company: "Netflix",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    feedback: "This portal helped me streamline my job search and improve my skills."
  }
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,  // Show 3 testimonials at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,  // Change slides every 3 seconds
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,  // Show 2 slides on medium screens
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,  // Show 1 slide on small screens
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="bg-[#E3F6FD] py-12"> {/* Super light sky blue background */}
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Here's What People Are Saying</h2>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6">
              <div className="bg-white bg-opacity-60 p-8 rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-xl">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md"
                />
                <h3 className="text-2xl font-semibold text-gray-800">{testimonial.name}</h3>
                <p className="text-gray-500 italic">{testimonial.position}, {testimonial.company}</p>
                <p className="text-gray-700 mt-4">"{testimonial.feedback}"</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
