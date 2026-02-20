import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../styles/HomePage.css';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/products?featured=true`);
        const data = await response.json();

        if (data.success) {
          setFeaturedProducts(data.products || []);
        } else {
          throw new Error(data.error || 'Failed to fetch featured products');
        }

        setIsLoading(false);
      } catch (err) {
        setError('Failed to load featured products. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-page">
      {/* HERO (rollback: big album cover hero) */}
      <section className="hero">
        <div className="hero-bg">
          <img className="hero-cover" src={`${process.env.PUBLIC_URL}/images/covers/cover6.png`} alt="Hero cover" />
        </div>
        <div className="hero-content">
          <div className="hero-logo">
            <img
              src={`${process.env.PUBLIC_URL}/images/lodo-records-logo-black-transparent.png`}
              alt="Lodo Records"
            />
          </div>
          <p>{t.independentLabel}</p>
        </div>
      </section>

      {/* Staff Section */}
      <section className="staff-section" id="staff">
        <div className="container">
          <h2 className="section-title">{t.staff}</h2>

          <div className="staff-grid">
            {[
              { src: '/images/bands/artigodz9-dark.png', alt: 'Artigo DZ9?' },
              { src: '/images/bands/autoboneco-dark.png', alt: 'Autoboneco' },
              { src: '/images/bands/revel-dark.png', alt: 'Revel' },
              { src: '/images/bands/sociopata-dark.png', alt: 'Sociopata' }
            ].map((b) => (
              <div className="staff-item" key={b.alt}>
                <img src={b.src} alt={b.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="featured-section">
        <div className="container">
          <h2 className="section-title">{t.featuredProducts}</h2>

          {isLoading ? (
            <div className="loading">{t.loading}</div>
          ) : error ? (
            <div className="error">
              {t.error}: {error}
            </div>
          ) : (
            <div className="featured-products grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          <div className="view-all">
            <Link to="/products" className="btn btn-primary">
              {t.viewAllProducts}
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="section-title">{t.stayUpdated}</h2>
            <p>{t.newsletterText}</p>
            <form className="newsletter-form">
              <input type="email" placeholder={t.emailPlaceholder} required />
              <button type="submit" className="btn btn-primary">
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
