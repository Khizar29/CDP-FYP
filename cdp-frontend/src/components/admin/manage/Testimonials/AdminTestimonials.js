import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Pagination from '../Graduates/Pagination'; // Reusing Pagination Component

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const testimonialsPerPage = 10;

  const fetchTestimonials = async (page = 1) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/testimonials`, {
        params: {
          page: page,
          limit: testimonialsPerPage,
          searchTerm: searchTerm,
        },
        withCredentials: true, // Include credentials with request
      });
      setTestimonials(response.data.data);
      setFilteredTestimonials(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTestimonials(currentPage);
  }, [currentPage, searchTerm]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this testimonial?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/testimonials/${id}`, {
        withCredentials: true,
      });

      fetchTestimonials(currentPage);
      alert('Testimonial Deleted Successfully');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 md:mb-0">Testimonials List</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by Name or Message"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full md:w-auto py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <Link
              to="/admin/testimonials/add"
              className="w-full md:w-auto inline-flex items-center justify-center bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              <FaPlus className="mr-2" /> New
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-md mb-6">
            <thead>
              <tr>
                <th className="py-2 px-3 text-center bg-blue-100 border-b">#</th>
                <th className="py-2 px-3 text-left bg-blue-100 border-b">Name</th>
                <th className="py-2 px-3 text-left bg-blue-100 border-b">Message</th>
                <th className="py-2 px-3 text-left bg-blue-100 border-b">Title</th>
                <th className="py-2 px-3 text-center bg-blue-100 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.length > 0 ? (
                filteredTestimonials.map((testimonial, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 transition duration-300">
                    <td className="py-2 px-3 text-center">{index + 1}</td>
                    <td className="py-2 px-3">{testimonial.name}</td>
                    <td className="py-2 px-3">{testimonial.message}</td>
                    <td className="py-2 px-3">{testimonial.title}</td>
                    <td className="py-2 px-3 text-center flex flex-col md:flex-row justify-center items-center gap-2">
                      {/* View Button */}
                      <Link 
                        to={`/admin/testimonials/view/${testimonial._id}`} 
                        state={{ data: testimonial }}
                      >
                        <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300">
                          View
                        </button>
                      </Link>

                      {/* Edit Button */}
                      <Link 
                        to={`/admin/testimonials/edit/${testimonial._id}`} 
                        state={{ data: testimonial }}
                      >
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-300">
                          Edit
                        </button>
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(testimonial._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">No Testimonials Available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonials;
