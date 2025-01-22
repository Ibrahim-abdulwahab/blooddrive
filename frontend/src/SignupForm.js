import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./sign.css"

const SignupForm = () => {
  // Define state for the form data and error messages
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    passwordConfirm: '',
    doB: '', // Date of Birth
    gender: '', // Gender (could be dropdown or radio buttons)
    bloodType: '', // Blood type
    checkDiseases:'',
    historyOfDiseases: '', // Medical history
    address: '',
    latitude: null,
    longitude: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Get user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevState) => ({
            ...prevState,
            latitude,
            longitude,
          }));
        },
        (err) => {
          setErrors((prevState) => ({
            ...prevState,
            location: 'Unable to retrieve location',
          }));
        }
      );
    } else {
      setErrors((prevState) => ({
        ...prevState,
        location: 'Geolocation is not supported by this browser.',
      }));
    }
  };

  // Get location on component mount
  useEffect(() => {
    getLocation();
  }, []);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Send data to the backend
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/donors/signup', formData);
      alert(response.data.message); // Success message from backend
      navigate('/');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        alert(err.response.data.message); // Show error message
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p>{errors.lastName}</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p>{errors.phoneNumber}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
          />
          {errors.passwordConfirm && <p>{errors.passwordConfirm}</p>}
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="doB"
            value={formData.doB}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Blood Type</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
          >
            <option value="">Select BloodType</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label>Any history of diseases?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="checkDiseases"
                value="Yes"
                checked={formData.checkDiseases === 'Yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="checkDiseases"
                value="No"
                checked={formData.checkDiseases === 'No'}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>
        <div>
          <label>History of Diseases</label>
          <textarea
            name="historyOfDiseases"
            value={formData.historyOfDiseases}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {errors.location && <p>{errors.location}</p>}
      </form>
    </div>
  );
};

export default SignupForm;
