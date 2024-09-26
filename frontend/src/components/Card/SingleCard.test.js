// SingleCard.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SingleCard from './SingleCard';

// Suppress the warning for react-markdown
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((message) => {
    if (message.includes('ReactMarkdown')) {
      return;
    }
    console.error(message);
  });
});

afterAll(() => {
  console.error.mockRestore();
});

jest.useFakeTimers();

describe('SingleCard Component', () => {
  const mockCard = {
    id: 1,
    content: 'This is a test card',
    positionX: 100,
    positionY: 100,
    width: 200,
    height: 150,
  };

  const mockUpdateCard = jest.fn();
  const mockDeleteCard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SingleCard component', () => {
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
      />
    );

    const cardElement = screen.getByTestId('single-card');
    expect(cardElement).toBeInTheDocument();

    const contentElement = screen.getByText('This is a test card');
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

    fireEvent.change(textarea, { target: { value: 'Updated content' } });
    fireEvent.blur(textarea);

    // Since updateCard might be called asynchronously, wait for it
    await waitFor(() => {
      expect(mockUpdateCard).toHaveBeenCalledWith(mockCard.id, { content: 'Updated content' });
    });
  });

  test('calls deleteCard when delete button is clicked', () => {
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
      />
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockDeleteCard).toHaveBeenCalledWith(mockCard.id);
  });

  test('drags the card when header is dragged', async () => {
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
      />
    );

    const header = screen.getByTestId('card-header');

    // Simulate drag events
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(window, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(window);

    // Since debouncedUpdateCardRef is debounced, advance timers
    jest.runAllTimers();

    // Wait for the mock function to be called
    await waitFor(() => {
      expect(mockUpdateCard).toHaveBeenCalled();
    });
  });

  test('resizes the card when resize handle is dragged', async () => {
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

    // Since debouncedUpdateCardRef is debounced, advance timers
    jest.runAllTimers();

    // Wait for the mock function to be called
    await waitFor(() => {
      expect(mockUpdateCard).toHaveBeenCalled();
    });
  });
});
