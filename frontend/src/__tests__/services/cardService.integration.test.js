// src/__tests__/services/cardService.integration.test.js

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchCards,
  fetchCardById,
  createCard,
  updateCard,
  deleteCard,
} from '../../services/cardService';

describe('Card Service Integration Tests', () => {
  let mock;
  const apiUrl = process.env.REACT_APP_API_URL;

  beforeAll(() => {
    // Initialize the mock adapter before running tests
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    // Reset the mock after each test to avoid interference between tests
    mock.reset();
  });

  afterAll(() => {
    // Restore Axios to its original state after all tests are done
    mock.restore();
  });

  test('should fetch all cards', async () => {
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

    // Mock the GET request to /cards
    mock.onGet(`${apiUrl}/cards`).reply(200, mockCards);

    const response = await fetchCards();
    expect(response.data).toEqual(mockCards);
  });

  test('should fetch a card by ID', async () => {
    const cardId = 101;
    const mockCard = {
      id: cardId,
      title: 'Card 1',
      content: 'Content of Card 1',
      positionX: 100,
      positionY: 150,
      width: 200,
      height: 150,
      canvasId: 1,
      createdAt: '2023-10-03T00:00:00Z',
    };

    // Mock the GET request to /cards/101
    mock.onGet(`${apiUrl}/cards/${cardId}`).reply(200, mockCard);

    const response = await fetchCardById(cardId);
    expect(response.data).toEqual(mockCard);
  });

  test('should create a new card', async () => {
    const newCard = {
      title: 'New Card',
      content: '# New Card\n\nClick to edit',
      positionX: 150,
      positionY: 200,
      width: 200,
      height: 150,
      canvasId: 1,
      createdAt: new Date(),
    };
    const createdCard = { id: 103, ...newCard };

    // Mock the POST request to /cards
    mock.onPost(`${apiUrl}/cards`, newCard).reply(201, createdCard);

    const response = await createCard(newCard);
    expect(response.data).toEqual(createdCard);
  });

  test('should update an existing card', async () => {
    const cardId = 101;
    const updates = { content: 'Updated Content', width: 250, height: 200 };
    const updatedCard = {
      id: cardId,
      title: 'Card 1',
      content: 'Updated Content',
      positionX: 100,
      positionY: 150,
      width: 250,
      height: 200,
      canvasId: 1,
      createdAt: '2023-10-03T00:00:00Z',
    };

    // Mock the PUT request to /cards/101
    mock.onPut(`${apiUrl}/cards/${cardId}`, updates).reply(200, updatedCard);

    const response = await updateCard(cardId, updates);
    expect(response.data).toEqual(updatedCard);
  });

  test('should delete an existing card', async () => {
    const cardId = 101;

    // Mock the DELETE request to /cards/101
    mock.onDelete(`${apiUrl}/cards/${cardId}`).reply(200);

    const response = await deleteCard(cardId);
    expect(response.status).toBe(200);
  });
});
