// components/Card/SingleCard.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SingleCard from './SingleCard';

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

  test('enters edit mode on double-click and updates content on blur', () => {
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

    expect(mockUpdateCard).toHaveBeenCalledWith(mockCard.id, { content: 'Updated content' });
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

  test('drags the card when header is dragged', () => {
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
      />
    );

    const header = screen.getByTestId('card-header');

    // Simulate mouse down on header
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });

    // Simulate mouse move
    fireEvent.mouseMove(window, { clientX: 150, clientY: 150 });

    // Simulate mouse up
    fireEvent.mouseUp(window);

    // Since debouncedUpdateCardRef is debounced, we need to advance timers
    jest.runAllTimers();

    expect(mockUpdateCard).toHaveBeenCalled();
    // You may add additional assertions to check the updated position
  });

  test('resizes the card when resize handle is dragged', () => {
    render(
      <SingleCard
        card={mockCard}
        updateCard={mockUpdateCard}
        deleteCard={mockDeleteCard}
      />
    );

    const resizeHandle = screen.getByTestId('card-resize-handle');

    // Simulate mouse down on resize handle
    fireEvent.mouseDown(resizeHandle, { clientX: 200, clientY: 150 });

    // Simulate mouse move
    fireEvent.mouseMove(window, { clientX: 250, clientY: 200 });

    // Simulate mouse up
    fireEvent.mouseUp(window);

    // Since debouncedUpdateCardRef is debounced, we need to advance timers
    jest.runAllTimers();

    expect(mockUpdateCard).toHaveBeenCalled();
    // You may add additional assertions to check the updated size
  });
});
