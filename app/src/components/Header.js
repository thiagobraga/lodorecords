import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/DarkTheme.css';
import '../styles/Header.css';

import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const { t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    };

    // Initial count
    updateCartCount();

    // Listen for storage events (when cart is updated)
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates within the same window
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <img
              src={`${process.env.PUBLIC_URL}/images/lodo-records-logo-black-transparent.png`}
              alt="Lodo Records"
              className="logo-img"
            />
          </Link>
        </div>

        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="header-actions">
          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                  {t.home}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className={location.pathname.includes('/products') ? 'active' : ''}>
                  {t.shop}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/bands" className={location.pathname === '/bands' ? 'active' : ''}>
                  Bands
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                  Admin
                </Link>
              </li>

            </ul>
          </nav>
          
          <div className="header-right">
            <LanguageSwitcher />
            
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            
            <Link to="/cart" className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
