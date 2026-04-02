import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};
  
  // If no order data is present, redirect to home
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);
  
  // Generate a random delivery date (5-7 days from now)
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + Math.floor(Math.random() * 3) + 5); // 5-7 days
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  if (!orderId) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <div className="confirmation-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Order Confirmed!</h1>
            <p className="confirmation-message">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>
          
          <div className="order-details">
            <div className="order-detail-row">
              <div className="order-detail-item">
                <h3>Order Number</h3>
                <p>{orderId}</p>
              </div>
              
              <div className="order-detail-item">
                <h3>Order Date</h3>
                <p>{new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</p>
              </div>
              
              <div className="order-detail-item">
                <h3>Order Total</h3>
                <p>${total ? total.toFixed(2) : '0.00'}</p>
              </div>
              
              <div className="order-detail-item">
                <h3>Estimated Delivery</h3>
                <p>{getEstimatedDeliveryDate()}</p>
              </div>
            </div>
          </div>
          
          <div className="order-status">
            <h2>What's Next?</h2>
            <div className="status-timeline">
              <div className="status-step completed">
                <div className="status-icon">
                  <i className="fas fa-check"></i>
                </div>
                <div className="status-content">
                  <h3>Order Placed</h3>
                  <p>Your order has been received</p>
                </div>
              </div>
              
              <div className="status-step active">
                <div className="status-icon">
                  <i className="fas fa-box"></i>
                </div>
                <div className="status-content">
                  <h3>Processing</h3>
                  <p>We're preparing your items</p>
                </div>
              </div>
              
              <div className="status-step">
                <div className="status-icon">
                  <i className="fas fa-shipping-fast"></i>
                </div>
                <div className="status-content">
                  <h3>Shipped</h3>
                  <p>Your order is on the way</p>
                </div>
              </div>
              
              <div className="status-step">
                <div className="status-icon">
                  <i className="fas fa-home"></i>
                </div>
                <div className="status-content">
                  <h3>Delivered</h3>
                  <p>Enjoy your purchase!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="confirmation-message">
            <p>
              We've sent a confirmation email to your registered email address with all the details of your order.
              If you have any questions or need assistance, please contact our customer support team.
            </p>
          </div>
          
          <div className="confirmation-actions">
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link to="/" className="btn btn-outline">
              Return to Home
            </Link>
          </div>
        </div>
        
        <div className="additional-info">
          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3>Shipping Information</h3>
            <p>
              Your order will be processed within 1-2 business days. Once shipped, you'll receive
              a tracking number via email to monitor your delivery.
            </p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-undo"></i>
            </div>
            <h3>Returns & Exchanges</h3>
            <p>
              Not satisfied? No problem! You have 30 days to return or exchange your items.
              Visit our returns page for more information.
            </p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h3>Need Help?</h3>
            <p>
              Our customer support team is available Monday-Friday, 9am-5pm EST.
              Contact us at support@lodorecords.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;