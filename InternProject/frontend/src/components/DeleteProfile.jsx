import React, { useState } from 'react';
import axios from 'axios';

const DeleteProfile = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete('http://localhost:3000/users/delete', {
        data: { email }
      });
      if (response.status === 200) {
        setSuccessMessage('User deleted successfully.');
        setErrorMessage(null);
      } else {
        setErrorMessage('Failed to delete user.');
      }
    } catch (err) {
      setErrorMessage('An error occurred while deleting the user.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="delete-profile-container">
      <h1>Delete Account</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleDelete} className="delete-profile-form">
        <br />
        <label htmlFor="emails">Email:</label>
        <input
          type="email"
          id="delemail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Delete Account</button>
      </form>
    </div>
  );
};

export default DeleteProfile;
