// App.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Import the mocked fetchCanvases function
import { fetchCanvases } from './services/canvasService';

// Mock the API calls
jest.mock('./services/canvasService', () => ({
  fetchCanvases: jest.fn(),
}));

test('renders App component without crashing', async () => {
  // Mock the resolved value for fetchCanvases
  fetchCanvases.mockResolvedValue({
    data: [{ id: 1, name: 'Test Canvas' }],
  });

  render(<App />);

  // Wait for the canvas to load using findByText
  const canvasElement = await screen.findByText('Test Canvas');
  expect(canvasElement).toBeInTheDocument();
});

test('renders Canvas component within App', async () => {
  // Mock the resolved value for fetchCanvases
  fetchCanvases.mockResolvedValue({
    data: [{ id: 1, name: 'Test Canvas' }],
  });

  render(<App />);

  // Wait for the canvas component to be in the document using findByTestId
  const canvasElement = await screen.findByTestId('canvas-component');
  expect(canvasElement).toBeInTheDocument();
});
