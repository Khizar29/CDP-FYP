// src/components/admin/manage/Graduates/GraduateEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateGraduate = () => {
  const { nuId } = useParams();
  const navigate = useNavigate();
  const [graduate, setGraduate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchGraduate = async () => {
      try {
        setError(null);
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8000/api/v1/graduates/${nuId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGraduate(response.data.data);
        setFormData(response.data.data); // Populate the form data with fetched graduate
      } catch (error) {
        setError(error.message || 'Error fetching graduate details');
      } finally {
        setLoading(false);
      }
    };
    fetchGraduate();
  }, [nuId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:8000/api/v1/graduates/${nuId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Graduate details updated successfully');
      navigate('/admin/graduates');
    } catch (error) {
      console.error('Error updating graduate details:', error);
      setError(error.message || 'Error updating graduate details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Graduate</h2>
      {graduate ? (
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">NU ID</label>
              <input
                type="text"
                name="nuId"
                value={formData.nuId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled // Disabling editing for nuId as it's unique and primary identifier
              />
            </div>
            <div>
              <label className="block mb-1">NU Email</label>
              <input
                type="email"
                name="nuEmail"
                value={formData.nuEmail}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Personal Email</label>
              <input
                type="email"
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Discipline</label>
              <input
                type="text"
                name="discipline"
                value={formData.discipline}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Year of Graduation</label>
              <input
                type="number"
                name="yearOfGraduation"
                value={formData.yearOfGraduation}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">CGPA</label>
              <input
                type="number"
                name="cgpa"
                step="0.01"
                value={formData.cgpa}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Personal Experience</label>
              <input
                type="text"
                name="personalExperience"
                value={formData.personalExperience}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Certifications</label>
              <input
                type="text"
                name="certificate"
                value={formData.certificate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Final Year Project</label>
              <input
                type="text"
                name="fyp"
                value={formData.fyp}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/graduates')}
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition duration-300"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>No graduate data available</div>
      )}
    </div>
  );
};

export default UpdateGraduate;
