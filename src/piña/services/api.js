import axios from'axios';


import { getRawToken } from '../../utils/authHelper';

const api = axios.create({
  baseURL: 'http://localhost:28',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = getRawToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


