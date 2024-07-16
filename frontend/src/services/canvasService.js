// src/services/canvasService.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchCanvases = () => axios.get(`${apiUrl}/canvases`);
export const fetchCanvasById = (id) => axios.get(`${apiUrl}/canvases/${id}`);
export const createCanvas = (canvas) => axios.post(`${apiUrl}/canvases`, canvas);
export const updateCanvas = (id, canvas) => axios.put(`${apiUrl}/canvases/${id}`, canvas);
export const deleteCanvas = (id) => axios.delete(`${apiUrl}/canvases/${id}`);
