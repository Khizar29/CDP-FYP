import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage'; // Utility function to handle image cropping

const AddEditTestimonial = () => {
    const location = useLocation();
    const testimonial = location.state?.data;

    // Initialize formData
    const [formData, setFormData] = useState({
        name: testimonial?.name || '',
        message: testimonial?.message || '',
        title: testimonial?.title || '',
        isApproved: testimonial?.isApproved || false,
    });

    // State for image handling
    const [image, setImage] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedImage, setCroppedImage] = useState(null);

    const navigate = useNavigate();

    // Dropzone setup
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result); // Set the image for cropping
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
        noClick: !!image, // Disable click if an image is already uploaded
    });

    // Handle cropping
    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImgBlob = await getCroppedImg(image, croppedAreaPixels);
            setCroppedImage(URL.createObjectURL(croppedImgBlob));
            setFormData((prev) => ({ ...prev, image: croppedImgBlob }));
        } catch (e) {
            console.error(e);
        }
    }, [image, croppedAreaPixels]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("message", formData.message);
        submitData.append("title", formData.title);
        submitData.append("isApproved", formData.isApproved);
    
        if (formData.image) {
            console.log("Appending Image:", formData.image);  // Debugging
            submitData.append("image", formData.image);
        } else {
            console.log("No image found in formData.");
        }
    
        for (let pair of submitData.entries()) {
            console.log(pair[0], pair[1]);  // Check if image is appended properly
        }
    
        try {
            const apiUrl = testimonial
                ? `${process.env.REACT_APP_BACKEND_URL}/api/v1/testimonials/${testimonial._id}`
                : `${process.env.REACT_APP_BACKEND_URL}/api/v1/testimonials`;
    
            const method = testimonial ? "put" : "post";
    
            await axios({
                method: method,
                url: apiUrl,
                data: submitData,
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
    
            navigate("/admin/testimonials");
        } catch (error) {
            console.error("Error saving testimonial:", error);
            alert("Error saving testimonial: " + error.message);
        }
    };
    
    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container mx-auto p-8">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Add / Edit Testimonial</h2>

                {/* Name Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900"
                        required
                    />
                </div>

                {/* Message Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900"
                        rows="6"
                        required
                    />
                </div>

                {/* Title Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Title / Position</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900"
                    />
                </div>

                {/* Approval Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Approved</label>
                    <select
                        name="isApproved"
                        value={formData.isApproved}
                        onChange={(e) => setFormData({ ...formData, isApproved: e.target.value === 'true' })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900"
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                {/* Image Drag-and-Drop and Crop Section */}
                <div {...getRootProps()} className={`border-2 border-dashed p-4 text-center mb-4 ${image ? 'cursor-default' : 'cursor-pointer'}`}>
                    <input {...getInputProps()} />
                    {image ? (
                        <div className="crop-container relative w-full h-64">
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                    ) : (
                        <p>Drag 'n' drop an image here, or click to select an image</p>
                    )}
                </div>

                {image && (
                    <button type="button" onClick={showCroppedImage} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
                        Crop & Preview
                    </button>
                )}

                {/* Cropped Image Preview */}
                {croppedImage && (
                    <div className="mt-4">
                        <img src={croppedImage} alt="Cropped Preview" className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center justify-between mt-6">
                    <button
                        type="submit"
                        className="bg-blue-900 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 transition duration-200"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/testimonials')}
                        className="bg-gray-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-gray-500 transition duration-200"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEditTestimonial;
