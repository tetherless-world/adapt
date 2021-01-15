import React from 'react'
import { render, screen } from '@testing-library/react'
import { App } from './App'

test('renders home page', () => {
  render(<App />)
  const home = screen.getByText(/welcome/i)
  expect(home).toBeInTheDocument()
})
