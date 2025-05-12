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

  const [imageError, setImageError] = useState(""); // To hold error messages for image size
  const [showGradToggle, setShowGradToggle] = useState(false);
  const [markingAsGraduate, setMarkingAsGraduate] = useState(false);
  const [graduationYearInput, setGraduationYearInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  // Allowed image size in bytes (2MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const allowedFields = [
    "cgpa",
    "discipline",
    "skills",
    "personalEmail",
    "contact",
    "tagline",
    "yearOfGraduation",
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
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/edit/${nuId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const grad = response.data.data;
        setGraduate(grad);

        // Check eligibility for showing the toggle
        const enrolledYear = 2000 + parseInt(nuId.substring(0, 2));
        const currentYear = new Date().getFullYear();
        if (!grad.isGraduate && currentYear - enrolledYear >= 4) {
          setShowGradToggle(true);
        }
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
      [name]: name === "skills" ? value.split(",").map(s => s.trim()) : value,
    }));
  };

  useEffect(() => {
    if (graduate.skills) {
      setSkillsInput(graduate.skills.join(", "));
    }
  }, [graduate.skills]);

  const handleQuillChange = (field, value) => {
    setGraduate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setImageError("File size should not exceed 2MB.");
      setImage(null); // Reset image
    } else {
      setImageError(""); // Clear any previous error
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set image for cropping
      };
      reader.readAsDataURL(file);
    }
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

  const handleMarkAsGraduate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/markAsGraduated/${nuId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Successfully marked as graduate!");
      setGraduate(response.data.data);
      setShowGradToggle(false);
      setMarkingAsGraduate(false);
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "You are not eligible to mark yourself as graduate yet."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      setLoading(true);

      const formData = new FormData();

      // Process skills to ensure proper format
      const processedSkills = graduate.skills
        ? graduate.skills.filter(skill => typeof skill === 'string' && skill.trim().length > 0)
        : [];

      // Append all fields including properly formatted skills
      allowedFields.forEach((field) => {
        if (field === 'skills') {
          formData.append(field, JSON.stringify(processedSkills));
        } else if (graduate[field] !== undefined) {
          formData.append(field, graduate[field]);
        }
      });

      // Handle image upload if exists
      if (graduate.profilePic instanceof Blob) {
        formData.append("profilePic", graduate.profilePic, "profile.jpg");
      }

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/${nuId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully!");
      navigate(`/profile/${nuId}?type=${graduate.isGraduate ? "graduate" : "student"}`);
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
          {/* File upload and cropping */}
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

          {imageError && (
            <p className="text-red-600 text-sm mt-2">{imageError}</p> // Show error if image size is too large
          )}

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

          {/* Mark as Graduate Toggle */}
          {showGradToggle && (
            <div className="mb-6">
              <label className="text-gray-700 font-bold mr-4">
                Mark yourself as graduated?
              </label>
              <input
                type="checkbox"
                checked={markingAsGraduate}
                onChange={(e) => setMarkingAsGraduate(e.target.checked)}
              />
              {markingAsGraduate && (
                <div className="mt-4">
                  <label className="block text-gray-700 font-bold">
                    Year of Graduation
                  </label>
                  <input
                    type="number"
                    name="yearOfGraduation"
                    value={graduationYearInput}
                    onChange={(e) => setGraduationYearInput(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
                    onClick={handleMarkAsGraduate}
                  >
                    Confirm Graduation
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Editable Fields */}
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">CGPA</label>
              <input
                type="number"
                name="cgpa"
                step="0.01"
                value={graduate.cgpa || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

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

            <label className="block text-gray-700 font-bold">Discipline</label>
            <select name="discipline" value={graduate.discipline || ""} onChange={handleInputChange} className="w-full p-2 border rounded-lg">
              <option value="">Select Discipline</option>
              <option value="BS(CS)">Computer Science</option>
              <option value="BS(AI and Data Science)">Artificial Intelligence</option>
              <option value="BS(AI and Data Science)">Data Science</option>
              <option value="BS(SE)">Software Engineering</option>
              <option value="BS(CY)">Cyber Security</option>
              <option value="BS(EE)">Electrical Engineering</option>
              <option value="BS (Business Analytics)">Business Analytics</option>
              <option value="BS(FinTech)">Financial Technology</option>
            </select>

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
              <label className="block text-gray-700 font-bold">Skills</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => {
                  setSkillsInput(e.target.value);
                }}
                onBlur={() => {
                  // When input loses focus, update the graduate skills
                  const skillsArray = skillsInput
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(skill => skill.length > 0);

                  setGraduate(prev => ({
                    ...prev,
                    skills: skillsArray
                  }));
                }}
                onKeyDown={(e) => {
                  // Also update when Enter is pressed
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const skillsArray = skillsInput
                      .split(',')
                      .map(skill => skill.trim())
                      .filter(skill => skill.length > 0);

                    setGraduate(prev => ({
                      ...prev,
                      skills: skillsArray
                    }));
                  }
                }}
                placeholder="Type skills separated by commas (e.g., JavaScript, Python, React)"
                className="w-full p-2 border rounded-lg"
              />
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">
                  Separate skills with commas. Press Enter or click outside to save.
                </p>
                <div className="flex flex-wrap gap-2">
                  {graduate.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-sky-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          const newSkills = graduate.skills.filter((_, i) => i !== index);
                          setGraduate(prev => ({ ...prev, skills: newSkills }));
                          setSkillsInput(newSkills.join(", "));
                        }}
                        className="ml-2 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
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
