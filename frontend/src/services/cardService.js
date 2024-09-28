// src/services/cardService.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

// Fetch cards for a specific canvas
export const fetchCards = async (canvasId) => {
  try {
    const response = await axios.get(`${apiUrl}/cards`, { params: { canvasId } });
    return response.data; // Return the data directly, not the response object
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw error; // Rethrow the error to handle it in the calling component
  }
};

export const fetchCardById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/cards/${id}`);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching card by ID:", error);
    throw error;
  }
};

export const createCard = async (card) => {
  try {
    const response = await axios.post(`${apiUrl}/cards`, card);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error creating card:", error);
    throw error;
  }
};

export const updateCard = async (id, card) => {
  try {
    const response = await axios.put(`${apiUrl}/cards/${id}`, card);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error updating card:", error);
    throw error;
  }
};

export const deleteCard = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}/cards/${id}`);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};
