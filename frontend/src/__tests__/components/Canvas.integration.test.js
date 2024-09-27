// src/__tests__/components/Canvas.integration.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Canvas from '../../components/Canvas/Canvas';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

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
    mock.onGet('/api/canvases').reply(200, { data: mockCanvases });

    // Act: Render the Canvas component
    render(<Canvas />);

    // Assert: Wait for fetchCanvases to be called and canvases to be displayed
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      mockCanvases.forEach(canvas => {
        expect(screen.getByTestId(`canvas-item-${canvas.id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`canvas-item-${canvas.id}`)).toHaveTextContent(canvas.name);
      });
    });

    // Assert: The first canvas is selected by default
    const firstCanvas = screen.getByTestId('canvas-item-1');
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


    // Mock the initial fetch for canvases
    mock.onGet('/api/canvases').reply(200, { data: mockCanvases });

    // Mock the initial fetch for cards (Canvas 1)
    mock.onGet('/api/cards', { params: { canvasId: 1 } }).reply(200, { data: mockCardsCanvas1 });

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
      expect(screen.queryByText('Card 2')).toBeNull();
    });
  });
});