// services/cardService.test.js

import axios from 'axios';
import {
  fetchCards,
  fetchCardById,
  createCard,
  updateCard,
  deleteCard,
} from './cardService';

jest.mock('axios');

describe('cardService', () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetchCards makes a GET request to /cards', async () => {
    const mockData = [{ id: 1, title: 'Card 1' }];
    axios.get.mockResolvedValue({ data: mockData });

    const response = await fetchCards();

    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/cards`);
    expect(response.data).toEqual(mockData);
  });

  test('fetchCardById makes a GET request to /cards/:id', async () => {
    const mockData = { id: 1, title: 'Card 1' };
    axios.get.mockResolvedValue({ data: mockData });

    const response = await fetchCardById(1);

    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/cards/1`);
    expect(response.data).toEqual(mockData);
  });

  test('createCard makes a POST request to /cards', async () => {
    const newCard = { title: 'New Card', content: 'Content' };
    const mockResponse = { id: 2, ...newCard };
    axios.post.mockResolvedValue({ data: mockResponse });

    const response = await createCard(newCard);

    expect(axios.post).toHaveBeenCalledWith(`${apiUrl}/cards`, newCard);
    expect(response.data).toEqual(mockResponse);
  });

  test('updateCard makes a PUT request to /cards/:id', async () => {
    const updatedCard = { title: 'Updated Card', content: 'Updated Content' };
    axios.put.mockResolvedValue({ data: updatedCard });

    const response = await updateCard(1, updatedCard);

    expect(axios.put).toHaveBeenCalledWith(`${apiUrl}/cards/1`, updatedCard);
    expect(response.data).toEqual(updatedCard);
  });

  test('deleteCard makes a DELETE request to /cards/:id', async () => {
    axios.delete.mockResolvedValue({ data: {} });

    const response = await deleteCard(1);

    expect(axios.delete).toHaveBeenCalledWith(`${apiUrl}/cards/1`);
    expect(response.data).toEqual({});
  });

  test('handles errors in fetchCards', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await expect(fetchCards()).rejects.toThrow(errorMessage);
  });

  // Add similar error handling tests for other functions if needed
});
