import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './request.css';


const RequestBlood = () => {
  const [formData, setFormData] = useState({
    patientFirstName: '',
    patientLastName: '',
    patientAge: '',
    patientGender: '',
    patientBloodType: '',
    hospital: '', // Added hospital field here
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // HospitalSelect Component
  function HospitalSelect() {
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
      const fetchHospitals = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/requests/hospitals');
          console.log(response.data);
          setHospitals(response.data); // Set the hospital names in the state
        } catch (err) {
          console.error('Error fetching hospitals:', err);
        }
      };

      fetchHospitals();
    }, []);

    return (
        <div>
        <label htmlFor="hospitalSelect">Select Hospital:</label>
        <select
            id="hospitalSelect"
            name="hospital"
            onChange={handleChange}
            value={formData.hospital}
        >
            <option value="">Select a Hospital</option> {/* Default Option */}
            {hospitals.length > 0 ? (
            hospitals.map((hospital, index) => (
                <option key={index} value={hospital.name}>
                {hospital.name}
                </option>
            ))
            ) : (
            <option>Loading...</option>
            )}
        </select>
        </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Send data to the backend
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/requests/create', formData);
      alert(response.data.message); // Success message from backend
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
      <h2>Request Blood</h2>
      <h3> Fill in this form to send a request call</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Patient's First Name</label>
          <input
            type="text"
            name="patientFirstName"
            value={formData.patientFirstName}
            onChange={handleChange}
          />
          
        </div>
        <div>
          <label>Patient's Last Name</label>
          <input
            type="text"
            name="patientLastName"
            value={formData.patientLastName}
            onChange={handleChange}
          />
        </div>
        <div>
            <label>Patient's Age:</label>
            <input type="number" name="patientAge" min="1" max="120" step="1" value={formData.patientAge} onChange={handleChange}/>
        </div>
        <div>
          <label>Patient's Gender</label>
          <select
            name="patientGender"
            value={formData.patientGender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Patient's Blood Type</label>
          <select
            name="patientBloodType"
            value={formData.patientBloodType}
            onChange={handleChange}
          >
            <option value="">Select Blood Type</option>
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

        <HospitalSelect /> {/* Render the HospitalSelect component */}

        <button type="submit" disabled={loading}>
          {loading ? 'Sending Request...' : 'Send request'}
        </button>
      </form>
    </div>
  );
};

export default RequestBlood;
