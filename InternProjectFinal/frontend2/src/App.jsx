import React from 'react';
import UserProfile from './UserProfile';
import './App.css';

const App = () => {
  return (
    <>
    <br></br>
    <h1>ServerSide WebPage</h1>
    <br></br>
    <div className="app-container">
      <UserProfile />
    </div>
    </>
  );
};

export default App;
