// src/__tests__/components/SingleCard.integration.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SingleCard from '../../components/Card/SingleCard';
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

describe('SingleCard Component Integration Tests', () => {
  const mockCard = {
    id: 201,
    title: 'Test Card',
    content: 'Content of Test Card',
    positionX: 100,
    positionY: 150,
    width: 200,
    height: 150,
    canvasId: 1,
    createdAt: '2023-10-07T00:00:00Z',
  };

  test('renders SingleCard component with correct content', () => {
    render(
      <SingleCard
        card={mockCard}
        updateCard={() => {}}
        deleteCard={() => {}}
      />
    );

    const cardElement = screen.getByTestId('single-card');
    expect(cardElement).toBeInTheDocument();

    const titleElement = screen.getByText('Test Card');
    expect(titleElement).toBeInTheDocument();

    const contentElement = screen.getByText('Content of Test Card');
    expect(contentElement).toBeInTheDocument();
  });

  test('enters edit mode on double-click and updates content on blur', async () => {
    const mockUpdateCard = jest.fn();

    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={() => {}}
      />
    );

    const contentElement = screen.getByTestId('card-content');
    fireEvent.doubleClick(contentElement);

    const textarea = screen.getByTestId('card-textarea');
    expect(textarea).toBeInTheDocument();

    // Simulate user typing
    fireEvent.change(textarea, { target: { value: 'Updated Content' } });

    // Simulate blur event to exit edit mode
    fireEvent.blur(textarea);

    // Assert: updateCard should be called with updated content
    await waitFor(() => {
      expect(mockUpdateCard).toHaveBeenCalledWith(mockCard.id, { content: 'Updated Content' });
    });

    // Assert: The updated content is displayed
    expect(screen.getByText('Updated Content')).toBeInTheDocument();
  });

  test('calls deleteCard when delete button is clicked', async () => {
    const mockDeleteCard = jest.fn();

    render(
      <SingleCard
        card={mockCard}
        updateCard={() => {}}
        deleteCard={mockDeleteCard}
      />
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    // Assert: deleteCard should be called with correct ID
    await waitFor(() => {
      expect(mockDeleteCard).toHaveBeenCalledWith(mockCard.id);
    });
  });

  test('drags the card and updates position', async () => {
    const mockUpdateCard = jest.fn();

    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={() => {}}
      />
    );

    const header = screen.getByTestId('card-header');

    // Initial position
    const cardElement = screen.getByTestId('single-card');
    expect(cardElement).toHaveStyle(`transform: translate(${mockCard.positionX}px, ${mockCard.positionY}px)`);

    // Simulate drag events
    fireEvent.mouseDown(header, { clientX: 100, clientY: 150 });
    fireEvent.mouseMove(window, { clientX: 150, clientY: 200 });
    fireEvent.mouseUp(window);

    // Assert: Check if the transform style has been updated
    await waitFor(() => {
      expect(cardElement).toHaveStyle('transform: translate(150px, 200px)');
    });
    expect(mockUpdateCard).toHaveBeenCalledWith(mockCard.id, {
      positionX: 150,
      positionY: 200,
    });
  });

  test('resizes the card and updates dimensions', async () => {
    const mockUpdateCard = jest.fn();

    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={() => {}}
      />
    );

    const resizeHandle = screen.getByTestId('card-resize-handle');

    // Simulate resize events
    fireEvent.mouseDown(resizeHandle, { clientX: 200, clientY: 150 });
    fireEvent.mouseMove(window, { clientX: 250, clientY: 200 });
    fireEvent.mouseUp(window);

    // Assert: updateCard should be called with updated width and height
    await waitFor(() => {
      expect(mockUpdateCard).toHaveBeenCalledWith(mockCard.id, {
        width: 250,
        height: 200,
      });
    });
  });
});
