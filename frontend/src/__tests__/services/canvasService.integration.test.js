// src/__tests__/services/canvasService.integration.test.js

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchCanvases,
  fetchCanvasById,
  createCanvas,
  updateCanvas,
  deleteCanvas,
} from '../../services/canvasService';

describe('Canvas Service Integration Tests', () => {
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

  test('should fetch all canvases', async () => {
    const mockCanvases = [
      { id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' },
      { id: 2, name: 'Canvas 2', createdAt: '2023-10-02T00:00:00Z' },
    ];

    // Mock the GET request to /canvases
    mock.onGet(`${apiUrl}/canvases`).reply(200, mockCanvases);

    const response = await fetchCanvases();
    expect(response.data).toEqual(mockCanvases);
  });

  test('should fetch a canvas by ID', async () => {
    const canvasId = 1;
    const mockCanvas = { id: canvasId, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' };

    // Mock the GET request to /canvases/1
    mock.onGet(`${apiUrl}/canvases/${canvasId}`).reply(200, mockCanvas);

    const response = await fetchCanvasById(canvasId);
    expect(response.data).toEqual(mockCanvas);
  });

  test('should create a new canvas', async () => {
    const newCanvas = { name: 'New Canvas', createdAt: '2023-10-03T00:00:00Z' };
    const createdCanvas = { id: 3, ...newCanvas };

    // Mock the POST request to /canvases
    mock.onPost(`${apiUrl}/canvases`, newCanvas).reply(201, createdCanvas);

    const response = await createCanvas(newCanvas);
    expect(response.data).toEqual(createdCanvas);
  });

  test('should update an existing canvas', async () => {
    const canvasId = 1;
    const updates = { name: 'Updated Canvas' };
    const updatedCanvas = { id: canvasId, name: 'Updated Canvas', createdAt: '2023-10-01T00:00:00Z' };

    // Mock the PUT request to /canvases/1
    mock.onPut(`${apiUrl}/canvases/${canvasId}`, updates).reply(200, updatedCanvas);

    const response = await updateCanvas(canvasId, updates);
    expect(response.data).toEqual(updatedCanvas);
  });

  test('should delete an existing canvas', async () => {
    const canvasId = 1;

    // Mock the DELETE request to /canvases/1
    mock.onDelete(`${apiUrl}/canvases/${canvasId}`).reply(200);

    const response = await deleteCanvas(canvasId);
    expect(response.status).toBe(200);
  });
});
