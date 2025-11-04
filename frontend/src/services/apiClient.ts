import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = '/api';

const createApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const apiClient = createApiClient();

