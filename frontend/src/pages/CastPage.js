import React from 'react';
import '../styles/CastPage.css';

const CastPage = () => {

  const castMembers = [
    {
      id: 1,
      name: 'Sociopata',
      role: 'Artist',
      bio: 'Underground metal band known for their aggressive sound and raw energy.',
      image: '/images/bands/sociopata-logo.png',
      genre: 'Metal',
      joinedYear: '2016'
    },
    {
      id: 2,
      name: 'Revel',
      role: 'Artist',
      bio: 'Experimental rock band pushing the boundaries of alternative music.',
      image: '/images/bands/revel-logo.png',
      genre: 'Alternative Rock',
      joinedYear: '2018'
    },
    {
      id: 3,
      name: 'Autoboneco',
      role: 'Artist',
      bio: 'Indie rock collective with a unique approach to songwriting and performance.',
      image: '/images/bands/autoboneco-logo.jpg',
      genre: 'Indie Rock',
      joinedYear: '2018'
    }
  ];

  return (
    <div className="cast-page">
      <div className="container">
        <h1 className="page-title">Our Artists</h1>
        <p className="page-description">
          Meet the talented artists who make up the Lodo Records family.
        </p>
        
        <div className="cast-grid">
          {castMembers.map(member => (
            <div key={member.id} className="cast-card">
              <div className="cast-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="cast-info">
                <h3 className="cast-name">{member.name}</h3>
                <p className="cast-role">{member.role}</p>
                <p className="cast-genre">{member.genre}</p>
                <p className="cast-bio">{member.bio}</p>
                <div className="cast-meta">
                  <span className="joined-year">Joined: {member.joinedYear}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CastPage;