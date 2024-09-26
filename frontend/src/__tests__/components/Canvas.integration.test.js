// src/__tests__/components/Canvas.integration.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Canvas from '../../components/Canvas/Canvas';
import { fetchCanvases } from '../../services/canvasService';
import { fetchCards, createCard, deleteCard } from '../../services/cardService';

// Mock the services
jest.mock('../../services/canvasService');
jest.mock('../../services/cardService');

describe('Canvas Component Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders Canvas component and loads canvases', async () => {
    // Arrange: Mock the fetchCanvases response
    const mockCanvases = [
      { id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' },
      { id: 2, name: 'Canvas 2', createdAt: '2023-10-02T00:00:00Z' },
    ];
    fetchCanvases.mockResolvedValueOnce({ data: mockCanvases });

    // Act: Render the Canvas component
    render(<Canvas />);

    // Assert: Wait for canvases to be loaded and displayed
    expect(fetchCanvases).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      mockCanvases.forEach(canvas => {
        expect(screen.getByText(canvas.name)).toBeInTheDocument();
      });
    });

    // Assert: The first canvas is selected by default
    expect(screen.getByText('Canvas 1')).toHaveClass('bg-blue-200');
  });

  test('selecting a canvas loads associated cards', async () => {
    // Arrange: Mock canvases and cards
    const mockCanvases = [
      { id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' },
      { id: 2, name: 'Canvas 2', createdAt: '2023-10-02T00:00:00Z' },
    ];
    const mockCards = [
      {
        id: 101,
        title: 'Card 1',
        content: 'Content of Card 1',
        positionX: 100,
        positionY: 150,
        width: 200,
        height: 150,
        canvasId: 1,
        createdAt: '2023-10-03T00:00:00Z',
      },
      {
        id: 102,
        title: 'Card 2',
        content: 'Content of Card 2',
        positionX: 300,
        positionY: 350,
        width: 200,
        height: 150,
        canvasId: 2,
        createdAt: '2023-10-04T00:00:00Z',
      },
    ];
    fetchCanvases.mockResolvedValueOnce({ data: mockCanvases });
    fetchCards.mockResolvedValueOnce({ data: mockCards });

    // Act: Render the Canvas component
    render(<Canvas />);

    // Wait for canvases to load
    await waitFor(() => {
      expect(fetchCanvases).toHaveBeenCalledTimes(1);
    });

    // Select the second canvas
    const secondCanvas = screen.getByText('Canvas 2');
    fireEvent.click(secondCanvas);

    // Assert: fetchCards should be called again
    expect(fetchCards).toHaveBeenCalledTimes(2); // Initial fetch + after selecting canvas

    // Assert: Only cards associated with Canvas 2 are displayed
    await waitFor(() => {
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });
    expect(screen.queryByText('Card 1')).not.toBeInTheDocument();
  });

  test('double-clicking on canvas creates a new card', async () => {
    // Arrange: Mock canvases and cards
    const mockCanvases = [{ id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' }];
    const mockCards = [];
    fetchCanvases.mockResolvedValueOnce({ data: mockCanvases });
    fetchCards.mockResolvedValueOnce({ data: mockCards });

    // Mock createCard response
    const newCard = {
      id: 103,
      title: 'New Card',
      content: '# New Card\n\nClick to edit',
      positionX: 150,
      positionY: 200,
      width: 200,
      height: 150,
      canvasId: 1,
      createdAt: '2023-10-05T00:00:00Z',
    };
    createCard.mockResolvedValueOnce({ data: newCard });

    // Act: Render the Canvas component
    render(<Canvas />);

    // Wait for canvases and cards to load
    await waitFor(() => expect(fetchCanvases).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fetchCards).toHaveBeenCalledTimes(1));

    // Double-click on the canvas area to create a new card
    const canvasArea = screen.getByTestId('canvas-area');
    fireEvent.doubleClick(canvasArea, { clientX: 150, clientY: 200 });

    // Assert: createCard should be called with correct parameters
    expect(createCard).toHaveBeenCalledWith({
      title: 'New Card',
      content: '# New Card\n\nClick to edit',
      positionX: expect.any(Number),
      positionY: expect.any(Number),
      width: 200,
      height: 150,
      canvasId: 1,
      createdAt: expect.any(Date),
    });

    // Assert: The new card is added to the display
    await waitFor(() => {
      expect(screen.getByText('New Card')).toBeInTheDocument();
    });
  });

  test('deleting a card removes it from the display', async () => {
    // Arrange: Mock canvases and cards
    const mockCanvases = [{ id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' }];
    const mockCards = [
      {
        id: 104,
        title: 'Card to Delete',
        content: 'Content of Card to Delete',
        positionX: 200,
        positionY: 250,
        width: 200,
        height: 150,
        canvasId: 1,
        createdAt: '2023-10-06T00:00:00Z',
      },
    ];
    fetchCanvases.mockResolvedValueOnce({ data: mockCanvases });
    fetchCards.mockResolvedValueOnce({ data: mockCards });

    // Mock deleteCard response
    deleteCard.mockResolvedValueOnce({});

    // Act: Render the Canvas component
    render(<Canvas />);

    // Wait for canvases and cards to load
    await waitFor(() => expect(fetchCanvases).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fetchCards).toHaveBeenCalledTimes(1));

    // Verify the card is displayed
    expect(screen.getByText('Card to Delete')).toBeInTheDocument();

    // Find the delete button for the card (assuming each SingleCard has a delete button with data-testid="delete-button")
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    // Assert: deleteCard should be called with correct ID
    expect(deleteCard).toHaveBeenCalledWith(104);

    // Assert: The card is removed from the display
    await waitFor(() => {
      expect(screen.queryByText('Card to Delete')).not.toBeInTheDocument();
    });
  });

  test('toggles the sidebar open and close', async () => {
    // Arrange: Mock canvases
    const mockCanvases = [{ id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' }];
    fetchCanvases.mockResolvedValueOnce({ data: mockCanvases });
    fetchCards.mockResolvedValueOnce({ data: [] });

    // Act: Render the Canvas component
    render(<Canvas />);

    // Wait for canvases to load
    await waitFor(() => {
      expect(fetchCanvases).toHaveBeenCalledTimes(1);
    });

    // Sidebar should be visible initially
    const sidebar = screen.getByText('Canvases');
    expect(sidebar).toBeInTheDocument();

    // Find the toggle button (assuming it has a data-testid or is uniquely identifiable)
    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    fireEvent.click(toggleButton);

    // Sidebar should be hidden
    await waitFor(() => {
      expect(screen.queryByText('Canvases')).not.toBeInTheDocument();
    });

    // Click again to open the sidebar
    fireEvent.click(toggleButton);

    // Sidebar should be visible again
    await waitFor(() => {
      expect(screen.getByText('Canvases')).toBeInTheDocument();
    });
  });

  test('drags the canvas area and updates the offset', async () => {
    // Arrange: Mock canvases and cards
    const mockCanvases = [{ id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' }];
    const mockCards = [];
    fetchCanvases.mockResolvedValueOnce({ data: mockCanvases });
    fetchCards.mockResolvedValueOnce({ data: mockCards });

    // Act: Render the Canvas component
    render(<Canvas />);

    // Wait for canvases and cards to load
    await waitFor(() => {
      expect(fetchCanvases).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(fetchCards).toHaveBeenCalledTimes(1);
    });

    // Find the canvas area
    const canvasArea = screen.getByTestId('canvas-area');

    // Simulate mouse events for dragging
    fireEvent.mouseDown(canvasArea, { button: 1, clientX: 100, clientY: 100 }); // Middle mouse button
    fireEvent.mouseMove(window, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(window);
    // Assert: Check if the transform style has been updated
    expect(screen.getByRole('div')).toHaveStyle(`transform: translate(50px, 50px)`);
  });
});
