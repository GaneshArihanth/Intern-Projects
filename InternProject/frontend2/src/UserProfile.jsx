import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzI2NzUwMDYxfQ.IR9eq4dblp2qANEphewfcu1UpwaV1natxZizBXYhr8Y';

      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/users/profile', {
        headers: {
          authorization: token,
        }
      });

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
