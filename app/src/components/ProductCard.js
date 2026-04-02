import React from 'react';
import { Link } from 'react-router-dom';

import { useLanguage } from '../contexts/LanguageContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { t } = useLanguage();
  const { _id, name, description, price, images } = product;
  const id = _id;
  const image = images && images.length > 0 ? images[0] : '/images/placeholder.jpg';

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === id);
    
    if (existingProductIndex !== -1) {
      // Update quantity if product exists
      cart[existingProductIndex].quantity += 1;
    } else {
      // Add new product to cart
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show feedback
    alert(`${name} added to cart!`);
  };

  return (
    <div className="product-card card">
      <Link to={`/products/${id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={image || 'https://via.placeholder.com/300x300?text=Lodo+Records'} 
            alt={name} 
            className="product-image card-img" 
          />
          <div className="product-overlay">
            <button className="btn btn-primary view-btn">View Details</button>
          </div>
        </div>
        <div className="card-body">
          <h3 className="card-title">{name}</h3>
          <p className="card-text">{description}</p>
          <div className="product-footer">
            {price ? (
              <>
                <span className="card-price">R$ {price.toFixed(2).replace('.', ',')}</span>
                <button 
                  className="btn btn-primary add-to-cart-btn" 
                  onClick={addToCart}
                  aria-label={`Add ${name} to cart`}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {t.addToCart}
                </button>
              </>
            ) : (
              <button 
                className="btn btn-spotify listen-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open('https://open.spotify.com', '_blank');
                }}
                aria-label={`Listen to ${name} on Spotify`}
              >
                <i className="fab fa-spotify"></i>
                Listen
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;