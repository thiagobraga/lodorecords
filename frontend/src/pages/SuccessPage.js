import React from 'react';
import '../styles/OrderConfirmationPage.css';

function SuccessPage() {
  return (
    <div className="order-confirmation">
      <div className="container">
        <div className="confirmation-content">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#10B981"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>Payment Successful!</h1>
          <p>Thank you for your purchase. Your order has been confirmed and will be processed shortly.</p>
          <div className="order-details">
            <h3>What's Next?</h3>
            <ul>
              <li>You will receive an email confirmation shortly</li>
              <li>Your order will be processed within 1-2 business days</li>
              <li>You'll receive tracking information once your order ships</li>
            </ul>
          </div>
          <div className="action-buttons">
            <a href="/" className="btn btn-primary">Continue Shopping</a>
            <a href="/orders" className="btn btn-secondary">View Orders</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;