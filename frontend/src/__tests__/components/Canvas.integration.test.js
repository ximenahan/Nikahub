// src/__tests__/components/Canvas.integration.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Canvas from '../../components/Canvas/Canvas';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock react-markdown directly in the test file
jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

// Initialize axios-mock-adapter
let mock;

beforeAll(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

describe('Canvas Component Integration Tests', () => {

  test('renders Canvas component and loads canvases', async () => {
    // Arrange: Mock the fetchCanvases response
    const mockCanvases = [
      { id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' },
      { id: 2, name: 'Canvas 2', createdAt: '2023-10-02T00:00:00Z' },
    ];
    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, { data: mockCanvases });

    // Act: Render the Canvas component
    render(<Canvas />);

    // Assert: Wait for canvases to be loaded and displayed
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1); // Ensure the GET request was made once
      mockCanvases.forEach(canvas => {
        const canvasItem = screen.getByTestId(`canvas-item-${canvas.id}`);
        expect(canvasItem).toBeInTheDocument();
        expect(canvasItem).toHaveTextContent(canvas.name);
      });
    });

    // Assert: The first canvas is selected by default
    const firstCanvas = screen.getByTestId(`canvas-item-${mockCanvases[0].id}`);
    expect(firstCanvas).toHaveClass('bg-blue-200');
  });

  test('selecting a canvas loads associated cards', async () => {
    // Arrange: Mock canvases and cards
    const mockCanvases = [
      { id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' },
      { id: 2, name: 'Canvas 2', createdAt: '2023-10-02T00:00:00Z' },
    ];
    const mockCardsCanvas1 = [
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
    ];
    const mockCardsCanvas2 = [
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

    // Mock the initial fetch for canvases
    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, { data: mockCanvases });

    // Mock the initial fetch for cards (Canvas 1)
    mock.onGet(`${process.env.REACT_APP_API_URL}/cards`, { params: { canvasId: 1 } }).reply(200, { data: mockCardsCanvas1 });

    // Act: Render the Canvas component
    render(<Canvas />);

    // Assert: Wait for canvases and initial cards to load
    await waitFor(() => {
      expect(screen.getByTestId('canvas-item-1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('canvas-item-2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('canvas-item-1')).toHaveClass('bg-blue-200');
    });

    await waitFor(() => {
      expect(screen.getByText('Card 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('Card 2')).not.toBeInTheDocument();
    });

    // Mock fetchCards to return cards for Canvas 2 when it's selected
    mock.onGet(`${process.env.REACT_APP_API_URL}/cards`, { params: { canvasId: 2 } }).reply(200, { data: mockCardsCanvas2 });

    // Select the second canvas
    const secondCanvas = screen.getByTestId('canvas-item-2');
    fireEvent.click(secondCanvas);

    // Assert: fetchCards should be called again
    await waitFor(() => {
      expect(mock.history.get.length).toBe(2); // Initial fetch + after selecting canvas
    });

    // Assert: Only cards associated with Canvas 2 are displayed
    await waitFor(() => {
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText('Card 1')).not.toBeInTheDocument();
    });
  });

  test('double-clicking on canvas creates a new card', async () => {
    // Arrange: Mock canvases and cards
    const mockCanvases = [{ id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' }];
    const mockCards = [];
    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, { data: mockCanvases });
    mock.onGet(`${process.env.REACT_APP_API_URL}/cards`, { params: { canvasId: 1 } }).reply(200, { data: mockCards });

    // Mock createCard response
    const mockDate = new Date('2023-10-05T00:00:00Z');
    jest.useFakeTimers('modern').setSystemTime(mockDate);
    const newCard = {
      title: 'New Card',
      content: '# New Card\n\nClick to edit',
      positionX: 150,
      positionY: 200,
      width: 200,
      height: 150,
      canvasId: 1,
      createdAt: mockDate.toISOString(), // Ensure it's a string
    };
    const createdCard = { id: 103, ...newCard };
    
    // Mock the POST request to /cards
    mock.onPost(`${process.env.REACT_APP_API_URL}/cards`).reply((config) => {
      const requestData = JSON.parse(config.data);
      
      // Validate the request data
      expect(requestData).toMatchObject({
        title: 'New Card',
        content: '# New Card\n\nClick to edit',
        positionX: 150,
        positionY: 200,
        width: 200,
        height: 150,
        canvasId: 1,
        createdAt: expect.any(String),
      });
      
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
    });
    // Assert: The new card is added to the display
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000); // Advance timers by 1 second to simulate async operations
    expect(screen.getByText('New Card')).toBeInTheDocument();
    jest.useRealTimers();

    // Restore real timers
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
    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, { data: mockCanvases });
    mock.onGet(`${process.env.REACT_APP_API_URL}/cards`, { params: { canvasId: 1 } }).reply(200, { data: mockCards });

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
    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, { data: mockCanvases });
    mock.onGet(`${process.env.REACT_APP_API_URL}/cards`, { params: { canvasId: 1 } }).reply(200, { data: [] });

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
    mock.onGet(`${process.env.REACT_APP_API_URL}/canvases`).reply(200, { data: mockCanvases });
    mock.onGet(`${process.env.REACT_APP_API_URL}/cards`, { params: { canvasId: 1 } }).reply(200, { data: mockCards });

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
