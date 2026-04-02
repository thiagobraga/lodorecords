import React from 'react';
import { Link } from 'react-router-dom';

import { useLanguage } from '../contexts/LanguageContext';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img
              src={`${process.env.PUBLIC_URL}/images/lodo-records-logo-black-transparent.png`}
              alt="Lodo Records"
              className="footer-logo"
            />
            <p className="footer-description">{t.footerTagline}</p>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">{t.footerShopTitle}</h3>
            <ul className="footer-links">
              <li>
                <Link to="/products">{t.footerAllProducts}</Link>
              </li>
              <li>
                <Link to="/products?category=music">{t.footerMusic}</Link>
              </li>
              <li>
                <Link to="/products?category=merch">{t.footerMerchandise}</Link>
              </li>
              <li>
                <Link to="/products?category=apparel">{t.footerApparel}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">{t.footerInfoTitle}</h3>
            <ul className="footer-links">
              <li>
                <Link to="/about">{t.footerAbout}</Link>
              </li>
              <li>
                <Link to="/contact">{t.footerContact}</Link>
              </li>
              <li>
                <Link to="/shipping">{t.footerShipping}</Link>
              </li>
              <li>
                <Link to="/privacy">{t.footerPrivacy}</Link>
              </li>
              <li>
                <Link to="/terms">{t.footerTerms}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">{t.footerNewsletterTitle}</h3>
            <p className="footer-description">{t.footerNewsletterDescription}</p>
            <form className="newsletter-form">
              <input type="email" placeholder={t.emailPlaceholder} required />
              <button type="submit" className="btn btn-primary">
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} Lodo Records. {t.footerRights}
          </p>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-amex"></i>
            <i className="fab fa-cc-paypal"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
