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
  jest.useFakeTimers('modern');
  const mockDate = new Date('2023-10-05T00:00:00Z');
  jest.setSystemTime(mockDate);
});

afterEach(() => {
  mock.reset();
  jest.clearAllMocks();
  jest.useRealTimers(); // Reset timers after each test
});

afterAll(() => {
  mock.restore();
  jest.useRealTimers();
});

// Set timeout for all tests in this file
jest.setTimeout(10000);

describe('SingleCard Component Integration Tests', () => {
  let mockCard;

  beforeEach(() => {
    mockCard = {
      id: 201,
      title: 'Test Card',
      content: 'Content of Test Card',
      positionX: 100,
      positionY: 150,
      width: 200,
      height: 150,
      canvasId: 1,
      createdAt: new Date('2023-10-05T00:00:00Z').toISOString(), // Ensure it's a string
    };
  });

  test('renders SingleCard component with correct content', () => {
    // Arrange: Create mock functions
    const mockUpdateCard = jest.fn();
    const mockDeleteCard = jest.fn();

    // Act: Render the SingleCard component with mock functions
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
      />
    );

    // Assert: Verify the card is rendered with correct content
    const cardElement = screen.getByTestId('single-card');
    expect(cardElement).toBeInTheDocument();

    // Use flexible text matcher for title
    const titleElement = screen.getByText((content) => content.includes('Test Card'));
    expect(titleElement).toBeInTheDocument();

    // Use flexible text matcher for content
    const contentElement = screen.getByText((content) => content.includes('Content of Test Card'));
    expect(contentElement).toBeInTheDocument();
  });

  test('enters edit mode on double-click and updates content on blur', async () => {
    // Arrange: Create mock function
    const mockUpdateCard = jest.fn();

    // Act: Render the SingleCard component with mock functions
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={() => {}}
      />
    );

    // Enter edit mode
    const contentElement = screen.getByTestId('card-content');
    fireEvent.doubleClick(contentElement);

    // Verify textarea is present
    const textarea = screen.getByTestId('card-textarea');
    expect(textarea).toBeInTheDocument();

    // Simulate user typing
    fireEvent.change(textarea, { target: { value: 'Updated Content' } });

    // Simulate blur event to exit edit mode
    fireEvent.blur(textarea);

    // Assert: updateCard should be called with updated content
    await waitFor(() => {
      expect(mockUpdateCard).toHaveBeenCalledWith(mockCard.id, {
        content: 'Updated Content',
      });
    });

    // Assert: The updated content is displayed
    expect(screen.getByText('Updated Content')).toBeInTheDocument();
  });

  test('calls deleteCard when delete button is clicked', async () => {
    // Arrange: Create mock function
    const mockDeleteCard = jest.fn();

    // Act: Render the SingleCard component with mock functions
    render(
      <SingleCard
        card={mockCard}
        updateCard={() => {}}
        deleteCard={mockDeleteCard}
      />
    );

    // Click the delete button
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    // Assert: deleteCard should be called with correct ID
    await waitFor(() => {
      expect(mockDeleteCard).toHaveBeenCalledWith(mockCard.id);
    });
  });

  test('drags the card and updates position', async () => {
    const mockUpdateCard = jest.fn((id, updatedFields) => {
      mockCard = { ...mockCard, ...updatedFields };
      rerender(
        <SingleCard
          card={mockCard}
          updateCard={mockUpdateCard}
          deleteCard={jest.fn()}
        />
      );
    });

    const { rerender } = render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={jest.fn()}
      />
    );

    const header = screen.getByTestId('card-header');
    const cardElement = screen.getByTestId('single-card');

    // Store initial positions
    const initialPositionX = mockCard.positionX;
    const initialPositionY = mockCard.positionY;

    // Simulate drag
    fireEvent.mouseDown(header, { clientX: initialPositionX, clientY: initialPositionY });
    fireEvent.mouseMove(window, { clientX: initialPositionX + 50, clientY: initialPositionY + 50 });
    fireEvent.mouseUp(window);

    // Advance timers
    jest.advanceTimersByTime(500);

    // Wait for updateCard to be called
    await waitFor(() => {
      expect(mockUpdateCard).toHaveBeenCalledWith(
      mockCard.id,
      expect.objectContaining({
        positionX: initialPositionX + 50,
        positionY: initialPositionY + 50,
      })
    );
  });

  // Update mockCard and re-render
  mockCard = {
    ...mockCard,
    positionX: initialPositionX + 50,
    positionY: initialPositionY + 50,
  };

  rerender(
    <SingleCard
      card={mockCard}
      updateCard={mockUpdateCard}
      deleteCard={jest.fn()}
    />
  );

  // Assert updated position
  expect(cardElement).toHaveStyle(`left: ${mockCard.positionX}px`);
  expect(cardElement).toHaveStyle(`top: ${mockCard.positionY}px`);
});

test('resizes the card and updates dimensions correctly', async () => {
  const mockUpdateCard = jest.fn();

  const { rerender } = render(
    <SingleCard
      card={mockCard}
      updateCard={mockUpdateCard}
      deleteCard={jest.fn()}
    />
  );

  const resizeHandle = screen.getByTestId('card-resize-handle');
  const cardElement = screen.getByTestId('single-card');

  // Store initial dimensions
  const initialWidth = mockCard.width;
  const initialHeight = mockCard.height;

  // Simulate resize
  fireEvent.mouseDown(resizeHandle, { clientX: initialWidth, clientY: initialHeight });
  fireEvent.mouseMove(window, { clientX: initialWidth + 50, clientY: initialHeight + 50 });
  fireEvent.mouseUp(window);

  // Advance timers
  jest.advanceTimersByTime(500);

  // Wait for updateCard to be called
  await waitFor(() => {
    expect(mockUpdateCard).toHaveBeenCalledWith(
      mockCard.id,
      expect.objectContaining({
        width: initialWidth + 50,
        height: initialHeight + 50,
      })
    );
  });

  // Update mockCard and re-render
  mockCard = {
    ...mockCard,
    width: initialWidth + 50,
    height: initialHeight + 50,
  };

  rerender(
    <SingleCard
      card={mockCard}
      updateCard={mockUpdateCard}
      deleteCard={jest.fn()}
    />
  );

  // Assert updated dimensions
  expect(cardElement).toHaveStyle(`width: ${mockCard.width}px`);
  expect(cardElement).toHaveStyle(`height: ${mockCard.height}px`);

  jest.useRealTimers();

})

});
