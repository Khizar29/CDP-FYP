
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewTestimonial = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const testimonial = state?.data;

  if (!testimonial) {
    return (
      <div className="p-6 text-center text-red-500 font-bold">
        No testimonial data found.
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col mx-auto items-center max-w-3xl">
      {/* Card with Gradient Background */}
      <div
        className="w-full rounded-xl shadow-lg p-8 mb-8"
        style={{
          background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
        }}
      >
        {/* IMAGE if exists */}
        {testimonial.image && (
          <div className="flex justify-center mb-6">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-32 h-32 object-cover rounded-full shadow-md"
            />
          </div>
        )}

        {/* Name */}
        <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">{testimonial.name}</h2>

        {/* Title / Position */}
        {testimonial.title && (
          <p className="text-lg text-blue-800 mb-6 text-center font-semibold">{testimonial.title}</p>
        )}

        {/* Message */}
        <p className="text-gray-700 text-justify leading-relaxed mb-6">
          {testimonial.message}
        </p>

        {/* Approval Status */}
        <div className="text-center">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              testimonial.isApproved ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
            }`}
          >
            {testimonial.isApproved ? 'Approved' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate('/admin/testimonials')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition duration-300"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default ViewTestimonial;
