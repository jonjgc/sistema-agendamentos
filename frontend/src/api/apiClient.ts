import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5067/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Agendamentos:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});