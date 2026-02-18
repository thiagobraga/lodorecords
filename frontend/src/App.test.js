import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

test('app renders and main content exists', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
  const main = screen.getByRole('main')
  expect(main).toBeInTheDocument()
})