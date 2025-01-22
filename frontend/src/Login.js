import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // Define state for the form data and error messages
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


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
      const response = await axios.post('http://localhost:5000/api/donors/login', formData);
      alert(response.data.message); // Success message from backend
      localStorage.setItem('userEmail', formData.email);
      navigate('/update');
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
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  );
};

export default Login;
