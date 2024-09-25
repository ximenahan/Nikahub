// components/Canvas/Canvas.test.js

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Canvas from './Canvas';
import * as cardService from '../../services/cardService';
import * as canvasService from '../../services/canvasService';

// Mock the services
jest.mock('../../services/cardService');
jest.mock('../../services/canvasService');

// Mock the Date object
jest.useFakeTimers('modern').setSystemTime(new Date('2021-01-01').getTime()); // Add this line


describe('Canvas Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('renders Canvas component without crashing', () => {
    render(<Canvas />);
    const canvasElement = screen.getByTestId('canvas-component');
    expect(canvasElement).toBeInTheDocument();
  });

  test('loads and displays canvases', async () => {
    // Mock the response from fetchCanvases
    const mockCanvases = [
      { id: 1, name: 'Test Canvas 1' },
      { id: 2, name: 'Test Canvas 2' },
    ];
    canvasService.fetchCanvases.mockResolvedValue({ data: mockCanvases });

    // Mock the response from fetchCards
    const mockCards = [
      {
        id: 1,
        canvasId: 1,
        title: 'Test Card',
        content: 'This is a test card',
        positionX: 100,
        positionY: 100,
        width: 200,
        height: 150,
      },
    ];
    cardService.fetchCards.mockResolvedValue({ data: mockCards });

    render(<Canvas />);

    // Wait for canvases to load
    await waitFor(() => {
      expect(canvasService.fetchCanvases).toHaveBeenCalled();
    });

    // Check if canvases are rendered
    expect(screen.getByText('Test Canvas 1')).toBeInTheDocument();

    // Wait for cards to load
    await waitFor(() => {
      expect(cardService.fetchCards).toHaveBeenCalled();
    });

    // Check if cards are rendered
    const cardContent = screen.getByText('This is a test card');
    expect(cardContent).toBeInTheDocument();
  });

  test('creates a new card on canvas double-click', async () => {
    // Mock the responses
    canvasService.fetchCanvases.mockResolvedValue({
      data: [{ id: 1, name: 'Test Canvas' }],
    });
    cardService.fetchCards.mockResolvedValue({ data: [] });

    const mockNewCard = {
      id: 2,
      canvasId: 1,
      title: 'New Card',
      content: '# New Card\n\nClick to edit',
      positionX: 50,
      positionY: 50,
      width: 200,
      height: 150,
      createdAt: new Date(),
    };
    cardService.createCard.mockResolvedValue({ data: mockNewCard });

    render(<Canvas />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(canvasService.fetchCanvases).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(cardService.fetchCards).toHaveBeenCalled();
    });

    // Simulate double-click on the canvas area
    const canvasArea = screen.getByTestId('canvas-area'); // Updated line
    fireEvent.doubleClick(canvasArea);

    // Wait for the createCard API call to be made
    await waitFor(() => {
      expect(cardService.createCard).toHaveBeenCalled();
    });

    // Check if the new card is rendered
    const newCardContent = screen.getByText('Click to edit');
    expect(newCardContent).toBeInTheDocument();
  });
});
