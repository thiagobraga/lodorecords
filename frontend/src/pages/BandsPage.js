import React, { useState, useEffect } from 'react';
import '../styles/BandsPage.css';

const BandsPage = () => {
  const [bands, setBands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBands = async () => {
      try {
        const response = await fetch('/api/bands');
        if (!response.ok) {
          throw new Error('Failed to fetch bands');
        }
        const data = await response.json();
        const bandsData = data.bands || data;
        // Sort bands alphabetically by name
        const sortedBands = bandsData.sort((a, b) => a.name.localeCompare(b.name));
        setBands(sortedBands);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBands();
  }, []);

  return (
    <div className="bands-page">
      <div className="container">
        <h1 className="page-title">Bands</h1>
        <p className="page-description">
          Meet the talented artists who make up the Lodo Records family.
        </p>
        
        {isLoading ? (
          <div className="loading">Loading bands...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <div className="bands-grid">
            {bands.map(band => (
              <div key={band._id} className="band-card">
                <div className="band-image">
                  <img src={band.logo} alt={band.name} />
                </div>
                <div className="band-info">
                  <h3 className="band-name">{band.name}</h3>
                  <p className="band-genre">{band.genre}</p>
                  <p className="band-bio">{band.description}</p>
                  <div className="band-meta">
                    <span className="joined-year">Formed: {band.formedYear}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BandsPage;