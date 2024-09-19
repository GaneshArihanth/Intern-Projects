import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      // Get the JWT token from localStorage or cookies
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzI2Njk2ODA2fQ.RL5zmPE-hrtyP2JvwU9YrmhQSaYvQ-IAElAdoNGs9Tk';

      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      // Make a GET request to the /users/profile endpoint with the token
      const response = await axios.get('http://localhost:3000/users/profile', {
        headers: {
          authorization: token,
        }
      });

      // Set the user profile data
      setUserProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="user-profile-container">
      {userProfile ? (
        <div>
          <h1>User Profile:</h1>
          <br></br>
          <br></br>
          <p><strong>ID: </strong> {userProfile.id}</p>
          <p><strong>Name: </strong> {userProfile.name}</p>
          <p><strong>Email: </strong> {userProfile.email}</p>
          <p><strong>HashedPassword: </strong> {userProfile.password}</p>
        </div>
      ) : (
        <p>No user profile found</p>
      )}
    </div>
  );
};

export default UserProfile;
