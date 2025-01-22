import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./update.css";

const Update = () => {

  const [formData, setFormData] = useState({
    email:'',
    newEmail: '',
    newPhoneNumber: '',
    newHistoryOfDiseases: '', // Medical history
    newAddress: '',
    newLocation: false,
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
  const storedEmail = localStorage.getItem('userEmail');
  if (storedEmail) {
    setFormData((prevState) => ({
      ...prevState,
      email: storedEmail,
    }));
  }
}, []);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;  // Destructure to get input properties
  
  // If it's a checkbox, use the 'checked' value; otherwise, use 'value'
  setFormData((prevState) => ({
    ...prevState,
    [name]: type === 'checkbox' ? checked : value,  // For checkboxes, use 'checked'; for others, use 'value'
  }));
};
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    console.log(formData);

    // Send data to the backend
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/donors/update', formData);
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

  // Handle the delete action
  const handleDelete = async (e) => {
     e.preventDefault();

    // Reset errors
    setErrors({});

    console.log(formData);
    // Send data to the backend to delete the donor
    try {
      const response = await axios.post('http://localhost:5000/api/donors/delete', formData);
      alert(response.data.message); // Success message from backend
      navigate('/'); // Redirect to another page (e.g., home)
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message); // Show error message
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };
  
  return (
    <div className="signup-form">
      <h2>To update your information fill at least one</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Email</label>
          <input
            type="email"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleChange}
          />
          {errors.newEmail && <p>{errors.newEmail}</p>}
        </div>
        <div>
          <label>New Phone Number</label>
          <input
            type="text"
            name="newPhoneNumber"
            value={formData.newPhoneNumber}
            onChange={handleChange}
          />
          {errors.newPhoneNumber && <p>{errors.newPhoneNumber}</p>}
        </div>
        <div>
          <label>New History of Diseases</label>
          <textarea
            name="newHistoryOfDiseases"
            value={formData.newHistoryOfDiseases}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>New Address</label>
          <input
            type="text"
            name="newAddress"
            value={formData.newAddress}
            onChange={handleChange}
          />
        </div>
        <div className="checkbox-container">
          <label>Check here to update location coordinates</label>
          <input
            type="checkbox"
            name="newLocation"
            checked={formData.newLocation}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleDelete}
        style={{ backgroundColor: 'red', color: 'white', marginTop: '20px' }}
      >
        Delete My Account
      </button>
    </div>
  );

}

export default Update;