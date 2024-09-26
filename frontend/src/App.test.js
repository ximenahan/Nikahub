// App.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { fetchCanvases } from './services/canvasService';
import { fetchCards } from './services/cardService';

// Mock the API functions
jest.mock('./services/canvasService', () => ({
  fetchCanvases: jest.fn(),
}));

jest.mock('./services/cardService', () => ({
  fetchCards: jest.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders App component without crashing', async () => {
    // Mock the resolved value for fetchCanvases
    fetchCanvases.mockResolvedValue({
      data: [{ id: 1, name: 'Test Canvas' }],
    });

    // Mock the resolved value for fetchCards
    fetchCards.mockResolvedValue({
      data: [
        { id: 1, canvasId: 1, content: 'Test Card Content' },
        // ... other mock card data if needed
      ],
    });

    render(<App />);

    // Wait for the canvas to load using findByText
    const canvasElement = await screen.findByText('Test Canvas');
    expect(canvasElement).toBeInTheDocument();

    // Optionally, check if cards are rendered correctly
    // const cardContent = await screen.findByText('Test Card Content');
    // expect(cardContent).toBeInTheDocument();
  });

  test('renders Canvas component within App', async () => {
    // Mock the resolved value for fetchCanvases
    fetchCanvases.mockResolvedValue({
      data: [{ id: 1, name: 'Test Canvas' }],
    });

    // Mock the resolved value for fetchCards
    fetchCards.mockResolvedValue({
      data: [
        { id: 1, canvasId: 1, content: 'Test Card Content' },
        // ... other mock card data if needed
      ],
    });

    render(<App />);

    // Wait for the canvas component to be in the document using findByTestId
    const canvasElement = await screen.findByTestId('canvas-component');
    expect(canvasElement).toBeInTheDocument();

    // Optionally, check if cards are rendered correctly
    // const cardContent = await screen.findByText('Test Card Content');
    // expect(cardContent).toBeInTheDocument();
  });
});
