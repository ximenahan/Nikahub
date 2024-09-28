// src/__tests__/components/Canvas.integration.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Canvas from '../../components/Canvas/Canvas';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock react-markdown directly in the test file
jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);


// At the top of your test file
jest.setTimeout(10000); // 10 seconds

// Initialize axios-mock-adapter before each test
let mock;

beforeEach(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
  jest.useRealTimers();
});

describe('Canvas Component Integration Tests', () => {
  test('double-clicking on canvas creates a new card', async () => {
    // Arrange: Mock canvases and cards
    const mockCanvases = [{ id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' }];
    const mockCards = [];

    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, mockCanvases);
    // Use RegExp to match any GET request to /cards regardless of query params
    mock.onGet(new RegExp(`${process.env.REACT_APP_API_URL}/cards.*`)).reply(200, mockCards);

    // Mock createCard response
    const mockDate = new Date('2023-10-05T00:00:00Z');
    jest.useFakeTimers().setSystemTime(mockDate);
    const newCard = {
      title: 'New Card',
      content: '# New Card\n\nClick to edit',
      positionX: 150,
      positionY: 200,
      width: 200,
      height: 150,
      canvasId: 1,
      createdAt: mockDate.toISOString(),
    };
    const createdCard = { id: 103, ...newCard };

    // Mock the POST request to /cards
    mock.onPost(`${process.env.REACT_APP_API_URL}/cards`).reply((config) => {
      const requestData = JSON.parse(config.data);

      // Log requestData to confirm the new card is being created properly
      console.log('Request Data:', requestData);

      // Respond with the created card
      return [201, createdCard];
    });

    // Act: Render the Canvas component
    render(<Canvas />);

    // Wait for canvases and cards to load
    await waitFor(() => {
      expect(screen.getByTestId('canvas-item-1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Canvas 1')).toHaveClass('bg-blue-200');
    });

    // Double-click on the canvas area to create a new card
    const canvasArea = screen.getByTestId('canvas-area');
    fireEvent.doubleClick(canvasArea, { clientX: 150, clientY: 200 });

    // Assert: createCard should be called with correct parameters
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });
    expect(mock.history.post[0].url).toBe(`${process.env.REACT_APP_API_URL}/cards`);
    const requestData = JSON.parse(mock.history.post[0].data);

    // Log to verify the new card data
    console.log('New Card Data:', requestData);

    expect(requestData).toMatchObject({
      title: 'New Card',
      content: '# New Card\n\nClick to edit',
      positionX: 150,
      positionY: 200,
      width: 200,
      height: 150,
      canvasId: 1,
      createdAt: mockDate.toISOString(),
    });

    // Assert: The new card is added to the display
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000); // Advance timers by 1 second to simulate async operations

    // Using the flexible text matcher to find 'New Card' in the DOM
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('New Card'))).toBeInTheDocument();
    });

    // Log the updated cards array
    const cardElements = screen.queryAllByTestId('single-card');
    console.log('Cards Array:', cardElements);

    jest.useRealTimers();
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
    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, mockCanvases);
    mock.onGet(`${process.env.REACT_APP_API_URL}/cards`, { params: { canvasId: 1 } }).reply(200, mockCards);

    // Mock deleteCard response
    mock.onDelete(`${process.env.REACT_APP_API_URL}/cards/${mockCards[0].id}`).reply(200);

    // Act: Render the Canvas component
    render(<Canvas />);

    // Wait for canvases and cards to load
    await waitFor(() => {
      expect(screen.getByTestId('canvas-item-1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Card to Delete')).toBeInTheDocument();
    });

    // Find the delete button for the card
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    // Assert: deleteCard should be called with correct ID
    await waitFor(() => {
      expect(mock.history.delete.length).toBe(1);
    });
    await waitFor(() => {
      expect(mock.history.delete[0].url).toBe(`${process.env.REACT_APP_API_URL}/cards/${mockCards[0].id}`);
    });

    // Assert: The card is removed from the display
    await waitFor(() => {
      expect(screen.queryByText('Card to Delete')).not.toBeInTheDocument();
    });
  });

  test('toggles the sidebar open and close', async () => {
    // Arrange: Mock canvases
    const mockCanvases = [{ id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' }];
    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, mockCanvases);
    mock.onGet(`${process.env.REACT_APP_API_URL}/cards`, { params: { canvasId: 1 } }).reply(200, []);

    // Act: Render the Canvas component
    render(<Canvas />);

    // Wait for canvases to load
    await waitFor(() => {
      expect(screen.getByTestId('canvas-item-1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    // Sidebar should be visible initially
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();

    // Find the toggle button and click to close sidebar
    const toggleButton = screen.getByTestId('sidebar-toggle-button');
    fireEvent.click(toggleButton);

    // Assert: Sidebar is hidden
    await waitFor(() => {
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    // Click toggle button again to open sidebar
    fireEvent.click(toggleButton);

    // Assert: Sidebar is visible again
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  test('drags the canvas area and updates the offset', async () => {
    // Arrange: Mock canvases and cards
    const mockCanvases = [{ id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' }];
    const mockCards = [];
    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, mockCanvases);
    mock.onGet(`${process.env.REACT_APP_API_URL}/cards`, { params: { canvasId: 1 } }).reply(200, mockCards);

    // Act: Render the Canvas component
    render(<Canvas />);

    // Wait for canvases and cards to load
    await waitFor(() => {
      expect(screen.getByTestId('canvas-item-1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('cards-container')).toBeInTheDocument();
    });

    // Find the cards container (which has the transform applied)
    const cardsContainer = screen.getByTestId('cards-container');

    // Initial transform
    expect(cardsContainer).toHaveStyle('transform: translate(0px, 0px)');

    // Simulate dragging the canvas area
    fireEvent.mouseDown(cardsContainer, { button: 1, clientX: 100, clientY: 100 }); // Middle mouse button
    fireEvent.mouseMove(window, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(window);

    // Assert: Canvas offset is updated
    await waitFor(() => {
      expect(cardsContainer).toHaveStyle('transform: translate(50px, 50px)');
    });
  });
});
