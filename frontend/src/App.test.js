// App.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component without crashing', () => {
  render(<App />);
});

test('renders Canvas component within App', () => {
  render(<App />);
  // Assuming Canvas component has a test ID for identification
  const canvasElement = screen.getByTestId('canvas-component');
  expect(canvasElement).toBeInTheDocument();
});
