import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5135/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona o token JWT às requisições
export function setAuthorizationHeader(token: string) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Remove o token JWT
export function removeAuthorizationHeader() {
  delete axiosInstance.defaults.headers.common['Authorization'];
}

// Atualiza o token inicial se existir nos cookies
export function initializeToken(token?: string) {
  if (token) {
    setAuthorizationHeader(token);
  }
}

export const Api = {
  get: (url: string, params?: any) => axiosInstance.get(url, { params }),
  post: (url: string, data?: any) => axiosInstance.post(url, data),
  put: (url: string, data?: any) => axiosInstance.put(url, data),
  delete: (url: string) => axiosInstance.delete(url),
  refreshToken: () => axiosInstance.post('/auth/refresh-token'),
  setAuthorizationHeader, 
  removeAuthorizationHeader, 
};