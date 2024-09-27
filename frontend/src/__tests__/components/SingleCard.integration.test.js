// src/__tests__/components/SingleCard.integration.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SingleCard from '../../components/Card/SingleCard';

// Mock the services if SingleCard interacts with any external services
// jest.mock('../../services/cardService'); // Uncomment if necessary

describe('SingleCard Component Integration Tests', () => {
  beforeAll(() => {
    // Enable modern fake timers
    jest.useFakeTimers('modern');
    // Set system time to October 5, 2023, at 00:00:00 UTC
    jest.setSystemTime(new Date('2023-10-05T00:00:00Z'));
  });

  afterAll(() => {
    // Restore real timers after all tests are done
    jest.useRealTimers();
  });

  const mockCard = {
    id: 201,
    title: 'Test Card',
    content: 'Content of Test Card',
    positionX: 100,
    positionY: 150,
    width: 200,
    height: 150,
    canvasId: 1,
    createdAt: new Date('2023-10-05T00:00:00Z'), // Aligned with mocked date
  };

  const mockUpdateCard = jest.fn();
  const mockDeleteCard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SingleCard component with correct content', () => {
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
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
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
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
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
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
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
      />
    );

    const header = screen.getByTestId('card-header');

    // Initial position
    const initialStyle = screen.getByTestId('single-card').style.transform;
    expect(initialStyle).toBe(`translate(${mockCard.positionX}px, ${mockCard.positionY}px)`); // Ensure this style is set in SingleCard

    // Simulate drag events
    fireEvent.mouseDown(header, { clientX: 100, clientY: 150 });
    fireEvent.mouseMove(window, { clientX: 150, clientY: 200 });
    fireEvent.mouseUp(window);

    // Assert: Check if the transform style has been updated
    await waitFor(() => {
      expect(screen.getByTestId('single-card')).toHaveStyle(`transform: translate(150px, 200px)`);
    });

    // Assert: Check if updateCard was called with the correct arguments
    await waitFor(() => {
      expect(mockUpdateCard).toHaveBeenCalledWith(mockCard.id, {
        positionX: 150,
        positionY: 200,
      });
    });
  });

  test('resizes the card and updates dimensions', async () => {
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
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
        // Ensure to include other properties if necessary
      });
    });
  });
});
