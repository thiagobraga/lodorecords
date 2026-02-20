import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Oops! Page Not Found</h1>
          <p>The page you're looking for seems to have wandered off into the music void. Let's get you back on track!</p>
          <div className="action-buttons">
            <Link to="/" className="btn btn-primary">Back to Home</Link>
            <Link to="/products" className="btn btn-primary">Browse Records</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;