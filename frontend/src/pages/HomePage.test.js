import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from './HomePage'

describe('HomePage', () => {
  test('renders hero section with cover image', () => {
    render(<HomePage />)
    const hero = screen.getByRole('img', { name: /hero cover/i })
    expect(hero).toBeInTheDocument()
    expect(hero.getAttribute('src')).toMatch(/images\/covers\/cover6\.png$/)
  })
})