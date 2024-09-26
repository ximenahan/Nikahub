// canvasService.integration.test.js

import {
    fetchCanvases,
    createCanvas,
    updateCanvas,
    deleteCanvas,
  } from '../../services/canvasService';

  describe('Canvas Service Integration Tests', () => {
    let createdCanvasId;
  
    test('should fetch all canvases', async () => {
      const response = await fetchCanvases();
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  
    test('should create a new canvas', async () => {
      const newCanvas = { name: 'Integration Test Canvas' };
      const response = await createCanvas(newCanvas);
      expect(response.status).toBe(201);
      expect(response.data.name).toBe(newCanvas.name);
  
      // Store the ID for cleanup
      createdCanvasId = response.data.id;
    });
  
    test('should update the created canvas', async () => {
      const updatedCanvas = { name: 'Updated Integration Test Canvas' };
      const response = await updateCanvas(createdCanvasId, updatedCanvas);
      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updatedCanvas.name);
    });
  
    test('should delete the created canvas', async () => {
      const response = await deleteCanvas(createdCanvasId);
      expect(response.status).toBe(200);
  
      // Verify deletion
      const canvases = await fetchCanvases();
      const canvasExists = canvases.data.some(
        (canvas) => canvas.id === createdCanvasId
      );
      expect(canvasExists).toBe(false);
    });
  });
  