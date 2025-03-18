import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Import toast
import { UserCircle2, Mail, Building2, Phone, School, GraduationCap, UserCog } from 'lucide-react';
import clsx from 'clsx';

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nuEmail: '',
    department: '',
    phoneNumber: '',
    nuid: '',
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    designation: '',
  });
  const [errors, setErrors] = useState({});
  const [maskedEmail, setMaskedEmail] = useState('');

  const validateNuId = (id) => {
    if (!id) return false;
    const nuIdRegex = /^\d{2}[A-Z]-\d{4}$/;
    return nuIdRegex.test(id);
  };

  const validateFacultyEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@nu\.edu\.pk$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({
        ...prev,
        nuEmail: 'Invalid email format. Example: firstname.lastname@nu.edu.pk'
      }));
      return false;
    }
    setErrors(prev => ({ ...prev, nuEmail: '' }));
    return true;
  };

  const validateStudentEmail = (email, nuid) => {
    if (!email || !nuid) return false;

    // First validate NU ID format
    if (!validateNuId(nuid)) {
      setErrors(prev => ({
        ...prev,
        nuid: 'Invalid NU ID format. Example: 21K-3329'
      }));
      return false;
    }

    const emailRegex = /^([A-Z])(\d{2})(\d{4})@nu\.edu\.pk$/i;
    const match = email.match(emailRegex);

    if (!match) {
      setErrors(prev => ({
        ...prev,
        nuEmail: 'Invalid email format. Example: K213329@nu.edu.pk'
      }));
      return false;
    }

    // Extract components from email
    const campusCode = match[1].toUpperCase();
    const batchYear = match[2];
    const studentNumber = match[3];

    // Extract components from NU ID
    const [nuIdYear, nuIdRest] = nuid.split('-');
    const nuIdCampus = nuIdYear.slice(2);
    const nuIdNumber = nuIdRest;

    // Compare components
    if (batchYear !== nuIdYear.slice(0, 2) ||
      campusCode !== nuIdCampus ||
      studentNumber !== nuIdNumber) {
      setErrors(prev => ({
        ...prev,
        nuid: `NU ID must match email pattern. Expected: ${batchYear}${campusCode}-${studentNumber}`
      }));
      return false;
    }

    setErrors(prev => ({ ...prev, nuEmail: '', nuid: '' }));
    return true;
  };

  const validateForm = () => {
    const newErrors = {};

    if (userType === 'student' || userType === 'faculty' || userType === 'recruiter') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
    }

    if (userType === 'student' || userType === 'faculty') {
      if (!formData.nuEmail.trim()) {
        newErrors.nuEmail = 'NU email is required';
      }
    }

    if (userType === 'faculty') {
      if (!formData.department?.trim()) {
        newErrors.department = 'Department is required';
      }
      if (!formData.phoneNumber?.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }
    }

    if (userType === 'student' || userType === 'graduate') {
      if (!formData.nuid?.trim()) {
        newErrors.nuid = 'NU ID is required';
      } else if (!validateNuId(formData.nuid)) {
        newErrors.nuid = 'Invalid NU ID format. Example: 21K-3329';
      }
    }

    if (userType === 'recruiter') {
      if (!formData.companyName?.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.companyEmail?.trim()) {
        newErrors.companyEmail = 'Company email is required';
      }
      if (!formData.companyPhone?.trim()) {
        newErrors.companyPhone = 'Company phone is required';
      }
      if (!formData.designation?.trim()) {
        newErrors.designation = 'Designation is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nuid') {
      let formattedValue = value.toUpperCase().replace(/[^0-9A-Z-]/g, '');

      // Auto-format NU ID
      if (formattedValue.length === 3 && !formattedValue.includes('-')) {
        formattedValue = formattedValue + '-';
      }

      // Allow full NU ID length (7 characters: XX[A-Z]-XXXX)
      if (formattedValue.length <= 8) {
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
      }

      // Clear related errors
      setErrors(prev => ({ ...prev, nuid: '', nuEmail: '' }));

      // If student type, validate email match when NU ID changes
      if (userType === 'student' && formData.nuEmail) {
        validateStudentEmail(formData.nuEmail, formattedValue);
      }
    } else if (name === 'nuEmail') {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Clear related errors
      setErrors(prev => ({ ...prev, nuEmail: '', nuid: '' }));

      // Validate email based on user type
      if (userType === 'faculty') {
        validateFacultyEmail(value);
      } else if (userType === 'student' && formData.nuid) {
        validateStudentEmail(value, formData.nuid);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear specific field error when user starts typing
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting.'); // Error alert
      return;
    }

    setLoading(true);

    try {
      let response;

      if (userType === 'student') {
        if (!validateStudentEmail(formData.nuEmail, formData.nuid)) {
          toast.error('Invalid student email or NU ID.'); // Error alert
          setLoading(false);
          return;
        }

        response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/register`, {
          fullName: formData.fullName,
          email: formData.nuEmail,
          nuId: formData.nuid,
        });
      } else if (userType === 'graduate') {
        if (!validateNuId(formData.nuid)) {
          toast.error('Invalid NU ID format. Example: 21K-3329'); // Error alert
          setErrors(prev => ({
            ...prev,
            nuid: 'Invalid NU ID format. Example: 21K-3329'
          }));
          setLoading(false);
          return;
        }

        response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/register-graduate`, {
          nuId: formData.nuid,
        });
      } else if (userType === 'faculty') {
        if (!validateFacultyEmail(formData.nuEmail)) {
          toast.error('Invalid faculty email format.'); // Error alert
          setLoading(false);
          return;
        }

        response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faculty/register`, {
          fullName: formData.fullName,
          nuEmail: formData.nuEmail,
          phoneNumber: formData.phoneNumber,
          department: formData.department,
        });
      } else if (userType === 'recruiter') {
        // Handle Recruiter registration
        response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/register`, {
          fullName: formData.fullName,
          companyName: formData.companyName,
          companyEmail: formData.companyEmail,
          companyPhone: formData.companyPhone,
          designation: formData.designation,
        });
      }

      toast.success(response.data.message || 'Registration successful!');
      navigate('/signin');
    } catch (error) {
      // Handle different types of error responses
      let errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage); // Error alert

      // Set form-specific errors if they exist
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGraduateCheck = async () => {
    if (!validateNuId(formData.nuid)) {
      toast.error('Invalid NU ID format. Example: 21K-3329'); // Error alert
      setErrors(prev => ({
        ...prev,
        nuid: 'Invalid NU ID format. Example: 21K-3329'
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/check-graduate`, {
        nuId: formData.nuid,
      });
      setMaskedEmail(response.data.data.maskedEmail);
      toast.success('Graduate found! Please proceed with registration.');
    } catch (error) {
      // Log the error for debugging
      console.log('Backend error:', error.response?.data);

      // Handle different types of error responses
      let errorMessage = error.response?.data?.message || 'Graduate not found or already registered.';
      toast.error(errorMessage); // Error alert
      setMaskedEmail('');

      // Set form-specific errors if they exist
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-yellow-500">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* User Type Selection */}
          <div className="flex justify-center space-x-4 mb-8">
            {['student', 'graduate', 'faculty', 'recruiter'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setUserType(type);
                  setErrors({});
                  setMaskedEmail('');
                  setFormData({
                    fullName: '',
                    nuEmail: '',
                    department: '',
                    phoneNumber: '',
                    nuid: '',
                    companyName: '',
                    companyEmail: '',
                    companyPhone: '',
                    designation: '',
                  });
                }}
                className={clsx(
                  'flex flex-col items-center p-3 rounded-lg transition-colors',
                  userType === type
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                )}
              >
                {type === 'student' && <School className="w-6 h-6 mb-1" />}
                {type === 'graduate' && <GraduationCap className="w-6 h-6 mb-1" />}
                {type === 'faculty' && <UserCog className="w-6 h-6 mb-1" />}
                {type === 'recruiter' && <UserCog className="w-6 h-6 mb-1" />} {/* Add an appropriate icon */}
                <span className="text-sm font-medium capitalize">{type}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            {(userType === 'student' || userType === 'faculty') && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={clsx(
                        'block w-full pl-10 sm:text-sm rounded-md',
                        errors.fullName
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      )}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nuEmail" className="block text-sm font-medium text-gray-700">
                    NU Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="nuEmail"
                      id="nuEmail"
                      value={formData.nuEmail}
                      onChange={handleInputChange}
                      className={clsx(
                        'block w-full pl-10 sm:text-sm rounded-md',
                        errors.nuEmail
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      )}
                      placeholder={userType === 'student' ? 'k213329@nu.edu.pk' : 'firstname.lastname@nu.edu.pk'}
                    />
                  </div>
                  {errors.nuEmail && (
                    <p className="mt-2 text-sm text-red-600">{errors.nuEmail}</p>
                  )}
                </div>
              </>
            )}

            {/* Student/Graduate Fields */}
            {(userType === 'student' || userType === 'graduate') && (
              <div>
                <label htmlFor="nuid" className="block text-sm font-medium text-gray-700">
                  NU ID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <School className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nuid"
                    id="nuid"
                    value={formData.nuid}
                    onChange={handleInputChange}
                    className={clsx(
                      'block w-full pl-10 sm:text-sm rounded-md',
                      errors.nuid
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    )}
                    placeholder="21K-3329"
                  />
                </div>
                {errors.nuid && (
                  <p className="mt-2 text-sm text-red-600">{errors.nuid}</p>
                )}
              </div>
            )}
            {userType === 'recruiter' && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={clsx(
                        'block w-full pl-10 sm:text-sm rounded-md',
                        errors.fullName
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      )}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={clsx(
                        'block w-full pl-10 sm:text-sm rounded-md',
                        errors.companyName
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      )}
                      placeholder="Company Name"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700">
                    Company Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="companyEmail"
                      id="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      className={clsx(
                        'block w-full pl-10 sm:text-sm rounded-md',
                        errors.companyEmail
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      )}
                      placeholder="company@example.com"
                    />
                  </div>
                  {errors.companyEmail && (
                    <p className="mt-2 text-sm text-red-600">{errors.companyEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">
                    Company Phone
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="companyPhone"
                      id="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      className={clsx(
                        'block w-full pl-10 sm:text-sm rounded-md',
                        errors.companyPhone
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      )}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  {errors.companyPhone && (
                    <p className="mt-2 text-sm text-red-600">{errors.companyPhone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCog className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="designation"
                      id="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className={clsx(
                        'block w-full pl-10 sm:text-sm rounded-md',
                        errors.designation
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      )}
                      placeholder="Designation"
                    />
                  </div>
                  {errors.designation && (
                    <p className="mt-2 text-sm text-red-600">{errors.designation}</p>
                  )}
                </div>
              </>
            )}

            {/* Faculty Fields */}
            {userType === 'faculty' && (
              <>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={clsx(
                        "block w-full pl-10 sm:text-sm rounded-md",
                        errors.department
                          ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      )}
                    >
                      <option value="" disabled>Select a department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Management Sciences">Management Sciences</option>
                      <option value="Sciences & Humanities">Sciences & Humanities</option>
                    </select>
                  </div>
                  {errors.department && (
                    <p className="mt-2 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={clsx(
                        'block w-full pl-10 sm:text-sm rounded-md',
                        errors.phoneNumber
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      )}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
              </>
            )}

            {/* Graduate Check/Register Flow */}
            {userType === 'graduate' ? (
              <>
                {!maskedEmail ? (
                  <button
                    type="button"
                    onClick={handleGraduateCheck}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Checking...' : 'Check Graduate Status'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 text-center">
                      Graduate found with email: {maskedEmail}
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Registering...' : 'Complete Registration'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Sign Up'}
              </button>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/signin')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;