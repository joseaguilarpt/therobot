// utils/api.ts

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Replace with your API base URL
  timeout: 5000, // Timeout after 5 seconds
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    // Add any other default headers you need
  },
});

// Axios interceptors for error handling and request/response transformation
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response data
    return response;
  },
  (error: AxiosError) => {
    // Handle error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Request failed with status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request made but no response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Utility functions for HTTP methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get<T>(url, config).then((response) => response.data),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.post<T>(url, data, config).then((response) => response.data),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.put<T>(url, data, config).then((response) => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete<T>(url, config).then((response) => response.data),

  // Example of a PATCH request
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.patch<T>(url, data, config).then((response) => response.data),

  // Example of a custom request with specific headers
  customRequest: <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.request<T>({
      method,
      url,
      data,
      ...config,
    }).then((response) => response.data);
  },

  // Add other HTTP methods as needed

};
