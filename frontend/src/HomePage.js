import React from 'react';
import { Link } from 'react-router-dom';  // To create links between pages
import './home.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="header">
        <h1>BloodDrive</h1>
        <h2>"Our mission is to help people help even more people. Let our site connect you with people in need or find the help you are searching for"</h2>
      </div>
      
      <div className="content">
        <div className="request-section">
          <p>Click this Button to find a blood donor</p>
          <Link to="/request">
            <button className="large-button">Request Blood</button>
          </Link>
        </div>
        
        <div className="signup-section">
          <p>Sign up to become a blood donor. By signing up, you agree to receive emails from our app</p>
          <p>For this app to work, we will need to know your location and you need to sign up at a permanent residence</p>
          <Link to="/signup">
            <button className='homeButton'>Sign Up</button>
          </Link>
        </div>
        
        <div className="login-section">
          <p>Update your information by logging in</p>
          <Link to="/login">
            <button className='homeButton'>Login</button>
          </Link>
        </div>
      </div>
      
      <div className="footer"></div>
    </div>
  );
};

export default HomePage;