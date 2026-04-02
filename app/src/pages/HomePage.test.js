import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import HomePage from './HomePage';
import { LanguageProvider } from '../contexts/LanguageContext';

describe('HomePage', () => {
  test('renders hero section with cover image', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <HomePage />
        </LanguageProvider>
      </MemoryRouter>
    );

    const hero = screen.getByRole('img', { name: /hero cover/i });
    expect(hero).toBeInTheDocument();
    expect(hero.getAttribute('src')).toMatch(/images\/covers\/cover6\.png$/);
  });
});
