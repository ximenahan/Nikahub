// Canvas.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Canvas from './Canvas';
import { fetchCanvases } from '../../services/canvasService';
import { fetchCards, createCard } from '../../services/cardService';


// Suppress the warning for react-markdown
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((message) => {
    if (message.includes('ReactMarkdown')) {
      return;
    }
    console.error(message);
  });
});

// Mock the API functions
jest.mock('../../services/canvasService', () => ({
  fetchCanvases: jest.fn(),
}));

jest.mock('../../services/cardService', () => ({
  fetchCards: jest.fn(),
  createCard: jest.fn(),
}));

describe('Canvas Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates a new card on canvas double-click', async () => {
    // Mock the API responses
    fetchCanvases.mockResolvedValue({
      data: [{ id: 1, name: 'Test Canvas' }],
    });

    fetchCards.mockResolvedValue({
      data: [],
    });

    createCard.mockResolvedValue({
      data: {
        id: 2,
        canvasId: 1,
        title: 'New Card',
        content: '# New Card\n\nClick to edit',
        positionX: 0,
        positionY: 0,
        width: 200,
        height: 150,
        createdAt: '2021-01-01T00:00:00.200Z',
      },
    });

    render(<Canvas />);

    // Wait for the canvases to load
    await screen.findByText('Test Canvas');

    // Select the canvas
    fireEvent.click(screen.getByText('Test Canvas'));

    // Wait for the canvas area to be rendered
    const canvasArea = await screen.findByTestId('canvas-area');

    // Simulate double-click
    fireEvent.doubleClick(canvasArea);

    // Wait for the new card to appear using findByText
    const newCardContent = await screen.findByText('Click to edit');
    expect(newCardContent).toBeInTheDocument();
  });
});
