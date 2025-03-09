import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone"; // Updated to useDropzone
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Cropper from "react-easy-crop";
import getCroppedImg from "../admin/manage/Testimonials/CropImage"; // Utility for cropping image
import Header from "../Header";
import Footer from "../Footer";

const EditGraduateProfile = () => {
  const { nuId } = useParams(); // Graduate's ID
  const navigate = useNavigate();
  const [graduate, setGraduate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image state management
  const [image, setImage] = useState(null); // Original image for cropping
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);

  const allowedFields = [
    "personalEmail",
    "contact",
    "tagline",
    "personalExperience",
    "certificate",
    "fyp",
  ];

  // Toolbar options for ReactQuill
  const toolbarOptions = [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    ["link", "image", "video"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  useEffect(() => {
    const fetchGraduate = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/${nuId}`
        );
        setGraduate(response.data.data);
      } catch (err) {
        setError("Error fetching graduate data");
      } finally {
        setLoading(false);
      }
    };

    fetchGraduate();
  }, [nuId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGraduate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuillChange = (field, value) => {
    setGraduate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result); // Set image for cropping
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Corrected 'accept' prop
    multiple: false,
    noClick: !!image, // Disable click if an image is already uploaded
  });

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImgBlob = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(URL.createObjectURL(croppedImgBlob));
      setGraduate((prev) => ({
        ...prev,
        profilePic: croppedImgBlob, // Add cropped image to graduate
      }));
    } catch (e) {
      console.error(e);
    }
  }, [image, croppedAreaPixels]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);

        const formData = new FormData();

        // Append allowed fields
        allowedFields.forEach((field) => {
            if (graduate[field] !== undefined) {
                formData.append(field, graduate[field]);
            }
        });

        // Append cropped image if available and valid
        if (graduate.profilePic instanceof Blob || graduate.profilePic instanceof File) {
            formData.append("profilePic", graduate.profilePic, "cropped-image.jpg");
        }

        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/${nuId}`,
          formData,
          {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
              withCredentials: true, // Include cookies in the request
          }
      );

        alert("Profile updated successfully!");
        navigate(`/profile/${nuId}`);
    } catch (err) {
        console.error("Error updating profile:", err);
        setError(err.response?.data?.message || "Error updating profile");
    } finally {
        setLoading(false);
    }
};


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-[#C1E4FB] flex flex-col">
      <Header />
      <main className="container mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
        <form onSubmit={handleSubmit}>
          {/* Dropzone and Cropper */}
          <div {...getRootProps()} className={`border-2 border-dashed p-4 text-center mb-4 ${image ? "cursor-default" : "cursor-pointer"}`}>
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
              <p>{isDragActive ? "Drop the image here..." : "Drag 'n' drop an image here, or click to select an image"}</p>
            )}
          </div>

          {image && (
            <button
              type="button"
              onClick={showCroppedImage}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
            >
              Crop & Preview
            </button>
          )}

          {croppedImage && (
            <div className="mt-4">
              <img src={croppedImage} alt="Cropped Preview" className="w-32 h-32 object-cover rounded-lg" />
            </div>
          )}

          {/* Editable Fields */}
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Personal Email</label>
              <input
                type="email"
                name="personalEmail"
                value={graduate.personalEmail || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Contact</label>
              <input
                type="text"
                name="contact"
                value={graduate.contact || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={graduate.tagline || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Personal Experience</label>
              <ReactQuill
                theme="snow"
                value={graduate.personalExperience || ""}
                onChange={(value) => handleQuillChange("personalExperience", value)}
                modules={modules}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Certifications</label>
              <ReactQuill
                theme="snow"
                value={graduate.certificate || ""}
                onChange={(value) => handleQuillChange("certificate", value)}
                modules={modules}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Final Year Project</label>
              <ReactQuill
                theme="snow"
                value={graduate.fyp || ""}
                onChange={(value) => handleQuillChange("fyp", value)}
                modules={modules}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Save Changes
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default EditGraduateProfile;
