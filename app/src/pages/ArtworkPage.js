import React from 'react';
import '../styles/ArtworkPage.css';

const ArtworkPage = () => {

  const artworks = [
    {
      id: 1,
      title: 'Sociopata - Corrosão Album Art',
      artist: 'Sociopata',
      year: '2016',
      image: '/images/merch/sociopata-corrosao.jpg',
      description: 'Album artwork for Sociopata\'s debut album "Corrosão"'
    },
    {
      id: 2,
      title: 'Autoboneco - Turnihil! Album Art',
      artist: 'Autoboneco',
      year: '2018',
      image: '/images/merch/autoboneco-turnihil.jpg',
      description: 'Album artwork for Autoboneco\'s "Turnihil!" release'
    },
    {
      id: 3,
      title: 'Revel - Estrada Perdida Album Art',
      artist: 'Revel',
      year: '2018',
      image: '/images/merch/revel-estrada-perdida.jpg',
      description: 'Album artwork for Revel\'s "Estrada Perdida"'
    },
    {
      id: 4,
      title: 'Revel - Petróleo Single Art',
      artist: 'Revel',
      year: '2018',
      image: '/images/merch/revel-petroleo.jpg',
      description: 'Single artwork for Revel\'s "Petróleo"'
    }
  ];

  return (
    <div className="artwork-page">
      <div className="container">
        <h1 className="page-title">Artwork Gallery</h1>
        <p className="page-description">
          Explore the visual identity and artistic designs created for our artists and releases.
        </p>
        
        <div className="artwork-grid">
          {artworks.map(artwork => (
            <div key={artwork.id} className="artwork-card">
              <div className="artwork-image">
                <img src={artwork.image} alt={artwork.title} />
              </div>
              <div className="artwork-info">
                <h3 className="artwork-title">{artwork.title}</h3>
                <p className="artwork-artist">{artwork.artist} ({artwork.year})</p>
                <p className="artwork-description">{artwork.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtworkPage;