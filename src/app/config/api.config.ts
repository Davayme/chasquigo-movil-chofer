import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('@auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await AsyncStorage.multiRemove(['@auth_token', '@auth_user']);
            } catch (storageError) {
                console.error('Error clearing storage:', storageError);
            }
        }
        return Promise.reject(error);
    }
);

const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    USER: {
        PROFILE: '/user/profile',
        UPDATE: '/user/update',
    },
} as const;

// Export everything as a default object
const apiConfig = {
    api,
    API_ENDPOINTS,
};

export { api, API_ENDPOINTS };
export default apiConfig; 