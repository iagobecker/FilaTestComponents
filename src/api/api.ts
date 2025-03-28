import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5135', 
});

export const fetchFilaData = async () => {
  try {
    const response = await api.get('/api/empresas/filas'); 
    return response.data;  
  } catch (error) {
    console.error("Erro ao buscar dados da fila:", error);
    throw error;
  }
};
