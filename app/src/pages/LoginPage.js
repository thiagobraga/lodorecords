import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleFakeLogin = () => {
    navigate('/admin');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <h1>Admin Access</h1>
          <p>Development mode - authentication disabled for testing.</p>
          
          <div className="login-options">
            <button className="btn btn-google" onClick={handleFakeLogin}>
              Access Admin Panel
            </button>
          </div>
          
          <div className="login-footer">
            <p>This is a development environment with simplified access.</p>
            <button className="btn btn-primary" onClick={handleBackToHome}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;