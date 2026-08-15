// Determine API Base URL dynamically from environment variable or window location
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5001/api';
  }
  return 'https://rentease-furniture-and-appliance-rentals.onrender.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

