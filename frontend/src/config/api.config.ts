import axios, { AxiosError, AxiosResponse } from 'axios';

// Base API URL - Spring Boot default port 8080
export const API_BASE_URL = 'http://localhost:8080/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    // Token varsa header'a ekle
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug için
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Başarılı response
    console.log('✅ API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    // Hata durumu
    console.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // 401 Unauthorized - Token geçersiz veya yok
    if (error.response?.status === 401) {
      // Kullanıcıyı çıkış yap
      localStorage.clear();
      window.location.href = '/login';
    }

    // 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied');
    }

    return Promise.reject(error);
  }
);

export default api;