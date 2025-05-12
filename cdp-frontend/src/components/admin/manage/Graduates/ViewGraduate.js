
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewGraduate = () => {
  const { nuId } = useParams();
  const navigate = useNavigate();
  const [graduate, setGraduate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraduate = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        setError(null);
        setLoading(true);

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/${nuId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGraduate(response.data.data);
      } catch (error) {
        setError(error.message || 'Error fetching graduate details');
      } finally {
        setLoading(false);
      }
    };
    fetchGraduate();
  }, [nuId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Graduate Details</h2>
  
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go Back
      </button>
  
      {graduate ? (
        <div className="bg-white p-6 rounded shadow-lg">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{graduate.fullName}</h3>
            <p className="text-gray-600">{graduate.discipline}</p>
          </div>
          <p><strong>NU ID:</strong> {graduate.nuId}</p>
          <p><strong>Email:</strong> {graduate.nuEmail}</p>
          <p><strong>Personal Email:</strong> {graduate.personalEmail || 'Not Available'}</p>
          <p><strong>Year of Graduation:</strong> {graduate.yearOfGraduation}</p>
          <p><strong>CGPA:</strong> {graduate.cgpa}</p>
          <p><strong>Contact:</strong> {graduate.contact || 'Not Available'}</p>
          <p><strong>Tagline:</strong> {graduate.tagline || 'No Tagline Available'}</p>
          <p><strong>Personal Experience:</strong> {graduate.personalExperience || 'No Experience Available'}</p>
          <p><strong>Certifications:</strong> {graduate.certificate || 'No Certifications Available'}</p>
          <p><strong>Final Year Project (FYP):</strong> {graduate.fyp || 'No FYP Available'}</p>
        </div>
      ) : (
        <div>No graduate data available</div>
      )}
    </div>
  );
  
};

export default ViewGraduate;
