// src/services/canvasService.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

/**
 * Fetches all canvases from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of canvases.
 */


export const fetchCanvases = async () => {
  try {
    const response = await axios.get(`${apiUrl}/canvases`);

    return response.data;

    // Option 2: If API returns [...]
    // return response.data;
  } catch (error) {
    console.error('Error fetching canvases:', error);
    throw error; // Re-throw the error after logging
  }
};

/**
 * Fetches a single canvas by its ID.
 * @param {number|string} id - The ID of the canvas to fetch.
 * @returns {Promise<Object>} A promise that resolves to the canvas object.
 */


export const fetchCanvasById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/canvases/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching canvas with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new canvas.
 * @param {Object} canvas - The canvas data to create.
 * @returns {Promise<Object>} A promise that resolves to the created canvas object.
 */


export const createCanvas = async (canvas) => {
  try {
    const response = await axios.post(`${apiUrl}/canvases`, canvas);
    return response.data; 
  } catch (error) {
    console.error('Error creating canvas:', error);
    throw error;
  }
};

/**
 * Updates an existing canvas.
 * @param {number|string} id - The ID of the canvas to update.
 * @param {Object} canvas - The updated canvas data.
 * @returns {Promise<Object>} A promise that resolves to the updated canvas object.
 */


export const updateCanvas = async (id, canvas) => {
  try {
    const response = await axios.put(`${apiUrl}/canvases/${id}`, canvas);
    return response.data; 
  } catch (error) {
    console.error(`Error updating canvas with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a canvas by its ID.
 * @param {number|string} id - The ID of the canvas to delete.
 * @returns {Promise<Object>} A promise that resolves to the deletion confirmation.
 */


export const deleteCanvas = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}/canvases/${id}`);
    return response; 
  } catch (error) {
    console.error(`Error deleting canvas with ID ${id}:`, error);
    throw error;
  }
};
