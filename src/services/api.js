import axios from 'axios';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || ' https://virtserver.swaggerhub.com/ayoub-6bf/cedoc-api-documentation/1.0.0',
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de login si non autorisé
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;