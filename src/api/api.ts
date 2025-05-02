import axios from 'axios';
import { parseCookies, setCookie } from 'nookies';

// Instância para requisições autenticadas
const axiosInstance = axios.create({
  baseURL: 'http://10.0.0.191:5135/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instância para requisições públicas (sem token)
const axiosPublicInstance = axios.create({
  baseURL: 'http://10.0.0.191:5135/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para lidar com erros 401 e tentar refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('Erro 401 detectado, tentando refresh token...');
        const { 'auth.refreshToken': refreshToken } = parseCookies();
        if (!refreshToken) {
          throw new Error('Nenhum refresh token disponível');
        }

        const response = await axiosPublicInstance.post('/autenticacao/refresh-token', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setCookie(undefined, 'auth.token', accessToken, {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
        setCookie(undefined, 'auth.refreshToken', newRefreshToken, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        });

        setAuthorizationHeader(accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Erro ao tentar refresh token:', refreshError);
        // Redireciona para o login se o refresh falhar
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    console.error('Erro na resposta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Interceptor para logar requisições autenticadas
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Requisição enviada:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Adiciona o token JWT às requisições autenticadas
export function setAuthorizationHeader(token: string) {
  console.log('Configurando cabeçalho de autorização com token:', token);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Remove o token JWT
export function removeAuthorizationHeader() {
  console.log('Removendo cabeçalho de autorização');
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
  patch: (url: string, data?: any) => axiosInstance.patch(url, data),
  delete: (url: string) => axiosInstance.delete(url),
  refreshToken: () => axiosInstance.post('/autenticacao/refresh-token'),
  setAuthorizationHeader,
  removeAuthorizationHeader,
};

export const PublicApi = {
  get: (url: string, params?: any) => axiosPublicInstance.get(url, { params }),
  post: (url: string, data?: any) => axiosPublicInstance.post(url, data),
};