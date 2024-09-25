// services/canvasService.test.js

import axios from 'axios';
import {
  fetchCanvases,
  fetchCanvasById,
  createCanvas,
  updateCanvas,
  deleteCanvas,
} from './canvasService';

jest.mock('axios');

describe('canvasService', () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetchCanvases makes a GET request to /canvases', async () => {
    const mockData = [{ id: 1, name: 'Canvas 1' }];
    axios.get.mockResolvedValue({ data: mockData });

    const response = await fetchCanvases();

    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/canvases`);
    expect(response.data).toEqual(mockData);
  });

  test('fetchCanvasById makes a GET request to /canvases/:id', async () => {
    const mockData = { id: 1, name: 'Canvas 1' };
    axios.get.mockResolvedValue({ data: mockData });

    const response = await fetchCanvasById(1);

    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/canvases/1`);
    expect(response.data).toEqual(mockData);
  });

  test('createCanvas makes a POST request to /canvases', async () => {
    const newCanvas = { name: 'New Canvas' };
    const mockResponse = { id: 2, ...newCanvas };
    axios.post.mockResolvedValue({ data: mockResponse });

    const response = await createCanvas(newCanvas);

    expect(axios.post).toHaveBeenCalledWith(`${apiUrl}/canvases`, newCanvas);
    expect(response.data).toEqual(mockResponse);
  });

  test('updateCanvas makes a PUT request to /canvases/:id', async () => {
    const updatedCanvas = { name: 'Updated Canvas' };
    axios.put.mockResolvedValue({ data: updatedCanvas });

    const response = await updateCanvas(1, updatedCanvas);

    expect(axios.put).toHaveBeenCalledWith(`${apiUrl}/canvases/1`, updatedCanvas);
    expect(response.data).toEqual(updatedCanvas);
  });

  test('deleteCanvas makes a DELETE request to /canvases/:id', async () => {
    axios.delete.mockResolvedValue({ data: {} });

    const response = await deleteCanvas(1);

    expect(axios.delete).toHaveBeenCalledWith(`${apiUrl}/canvases/1`);
    expect(response.data).toEqual({});
  });

  test('handles errors in fetchCanvases', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await expect(fetchCanvases()).rejects.toThrow(errorMessage);
  });

  // Add similar error handling tests for other functions if needed
});
