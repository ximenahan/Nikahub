// src/services/cardService.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL 

export const fetchCards = () => axios.get(`${apiUrl}/cards`);
export const fetchCardById = (id) => axios.get(`${apiUrl}/cards/${id}`);
export const createCard = (card) => axios.post(`${apiUrl}/cards`, card);
export const updateCard = (id, card) => axios.put(`${apiUrl}/cards/${id}`, card);
export const deleteCard = (id) => axios.delete(`${apiUrl}/cards/${id}`);
