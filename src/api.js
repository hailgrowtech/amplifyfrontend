// api.js
import axios from 'axios';
import { AuthContext } from './authContext';

const api = axios.create();

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // If `config.url` is a relative path, prepend the base URL with the correct port
    if (config.url.startsWith('/')) {
      config.url = getFullUrl(config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = require('./authContext').AuthContext._currentValue;
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      logout(); // log out the user
    }
    return Promise.reject(error);
  }
);

export function getFullUrl(relativeUrl) {
  // Define your base URLs with ports
  const baseUrls = {
    default: 'https://copartners.in',
    5130: 'https://copartners.in:5130',
    5132: 'https://copartners.in:5132',
    5134: 'https://copartners.in:5134',
    5135: 'https://copartners.in:5135',
    5137: 'https://copartners.in:5137',
    5009: 'https://copartners.in:5009',
    5131: 'https://copartners.in:5131'
    // Add more ports if necessary
  };

  // Map relative paths to specific ports and API prefix usage
  const portMap = {
    '/Authentication/authenticate': { baseUrl: baseUrls[5130], useApi: false },
    '/Experts': { baseUrl: baseUrls[5132], useApi: true },
    '/CallPost': { baseUrl: baseUrls[5132], useApi: true },
    '/Feed': { baseUrl: baseUrls[5132], useApi: true },
    '/CallNotification/SendMessagePremium': { baseUrl: baseUrls[5132], useApi: true },
    '/RADashboard': { baseUrl: baseUrls[5132], useApi: true },
    '/TelegramMessage': { baseUrl: baseUrls[5134], useApi: true },
    '/AWSStorage': { baseUrl: baseUrls[5134], useApi: true },
    '/WithDrawal': { baseUrl: baseUrls[5135], useApi: true },
    '/Wallet': { baseUrl: baseUrls[5135], useApi: true },
    '/ChatConfiguration': { baseUrl: baseUrls[5137], useApi: true },
    '/Story': { baseUrl: baseUrls[5137], useApi: true },
    '/Subscription': { baseUrl: baseUrls[5009], useApi: true },
    '/CallNotification/SendMessageFree': { baseUrl: baseUrls[5132], useApi: true },
    '/StandardQuestions': { baseUrl: baseUrls[5132], useApi: true },
    '/User': { baseUrl: baseUrls[5131], useApi: true },
    // Add more mappings as needed
  };

  // Iterate through portMap to find a matching path
  for (const path in portMap) {
    if (relativeUrl.startsWith(path)) {
      const { baseUrl, useApi } = portMap[path];
      // Determine the correct path prefix
      const apiPrefix = useApi ? '/api' : '';
      return `${baseUrl}${apiPrefix}${relativeUrl}`;
    }
  }

  // Default base URL if no match is found
  return `${baseUrls.default}/api${relativeUrl}`;
}

export default api;
