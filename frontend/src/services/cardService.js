import axios from 'axios';

const API_URL = 'http://localhost:3000/cards';

export const fetchCards = () => axios.get(API_URL);
export const fetchCardById = (id) => axios.get(`${API_URL}/${id}`);
export const createCard = (card) => axios.post(API_URL, card);
export const updateCard = (id, card) => axios.put(`${API_URL}/${id}`, card);
export const deleteCard = (id) => axios.delete(`${API_URL}/${id}`);
