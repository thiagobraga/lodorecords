import React, { useState, useRef, useEffect } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLanguage) => {
    if (newLanguage !== language) {
      toggleLanguage();
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button 
        className="language-toggle" 
        onClick={toggleDropdown}
        aria-label="Toggle language menu"
      >
        <span className={`flag flag-${language}`}>
          {language === 'en' ? '🇺🇸' : '🇧🇷'}
        </span>
        <span className="language-code">{language.toUpperCase()}</span>
        <i className={`fas fa-chevron-down ${isOpen ? 'rotated' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          <button 
            className={`language-option ${language === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            <span className="flag">🇺🇸</span>
            <span className="language-name">English</span>
          </button>
          <button 
            className={`language-option ${language === 'pt' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('pt')}
          >
            <span className="flag">🇧🇷</span>
            <span className="language-name">Português</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;