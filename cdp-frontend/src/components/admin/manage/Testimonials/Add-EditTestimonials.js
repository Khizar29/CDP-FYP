import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AddEditTestimonial = () => {
    const location = useLocation();
    const testimonial = location.state?.data;

    const [formData, setFormData] = useState({
        name: testimonial?.name || '',
        message: testimonial?.message || '',
        title: testimonial?.title || '',
        isApproved: testimonial?.isApproved || false,
        image: null // File input state
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('FormData before submission: ', formData);

        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                throw new Error('No token found');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Required for file upload
                }
            };

            const submitData = new FormData();
            submitData.append("name", formData.name);
            submitData.append("message", formData.message);
            submitData.append("title", formData.title);
            submitData.append("isApproved", formData.isApproved);
            if (formData.image) {
                submitData.append("image", formData.image); // Append file to form data
            }

            if (testimonial) {
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/testimonials/${testimonial._id}`, submitData, config);
            } else {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/testimonials`, submitData, config);
            }

            navigate('/admin/testimonials');
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('Error saving testimonial: ' + error.message);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Add / Edit Testimonial</h2>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                        rows="6"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title / Position
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isApproved">
                        Approved
                    </label>
                    <select
                        id="isApproved"
                        name="isApproved"
                        value={formData.isApproved}
                        onChange={(e) => setFormData({ ...formData, isApproved: e.target.value === 'true' })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Upload Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                        accept="image/*"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-900 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-200"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/testimonials')}
                        className="bg-gray-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEditTestimonial;
