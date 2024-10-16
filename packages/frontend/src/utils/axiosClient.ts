import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000', // API URL'nizi buraya ekleyin
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie'leri otomatik olarak göndermek için
});

// Interceptor for handling 401 errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 hatası alındığında hata fırlatılıyor
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
