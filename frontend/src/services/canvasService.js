import axios from 'axios';

const API_URL = 'http://localhost:3000/canvases';

export const fetchCanvases = () => axios.get(API_URL);
export const fetchCanvasById = (id) => axios.get(`${API_URL}/${id}`);
export const createCanvas = (canvas) => axios.post(API_URL, canvas);
export const updateCanvas = (id, canvas) => axios.put(`${API_URL}/${id}`, canvas);
export const deleteCanvas = (id) => axios.delete(`${API_URL}/${id}`);
