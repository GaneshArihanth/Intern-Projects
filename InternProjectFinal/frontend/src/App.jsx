import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UpdateProfile from './components/UpdateProfile';
import DeleteProfile from './components/DeleteProfile';
import './App.css';

const App = () => {
    return (
        <Router>
            <h1>ClientSide WebPage</h1>
            <nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/update-profile">Update</Link></li>
                    <li><Link to="/delete-profile">Delete</Link></li>
                </ul>
            </nav>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/update-profile" element={<UpdateProfile />} />
                    <Route path="/delete-profile" element={<DeleteProfile />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
