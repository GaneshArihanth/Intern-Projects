import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Optional custom styles

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form data to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI2Njk2OTA3fQ.9o4kaEf9aIDp6zydeoaIYc_7df7MNWok_N6zRjMaaEQ'; // Assuming the JWT token is stored in localStorage
      const response = await axios.put('http://localhost:3000/users/update', formData, {
        headers: {
          Authorization: token,
        }
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  return (
    <div className="update-profile-container">
      <h1>Update Profile</h1>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleSubmit} className="update-profile-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
