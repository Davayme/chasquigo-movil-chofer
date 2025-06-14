import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { api, API_ENDPOINTS } from '../../app/config/api.config';
import { AuthResponse, LoginCredentials } from '../data/interfaces/auth.interface';
import { mockAuthResponses } from '../data/mocks/auth.mock';

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check mock responses
            const mockResponse = mockAuthResponses[credentials.email];
            if (mockResponse && credentials.password === '123456') {
                return mockResponse;
            }

            // If no mock response or invalid credentials, simulate API call
            const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    throw new Error('Credenciales inválidas');
                }
                if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
                    throw new Error('Error de conexión. Por favor, verifique su conexión a internet.');
                }
            }
            throw new Error('Error en el servidor');
        }
    }

    async logout(): Promise<void> {
        try {
            // Clear local storage first
            await AsyncStorage.multiRemove(['@auth_token', '@auth_user']);

            // Then try to call the API, but don't wait for it
            api.post(API_ENDPOINTS.AUTH.LOGOUT).catch(error => {
                console.error('API logout error:', error);
            });
        } catch (error) {
            // Even if everything fails, we still want to clear local storage
            try {
                await AsyncStorage.multiRemove(['@auth_token', '@auth_user']);
            } catch (storageError) {
                console.error('Error clearing storage:', storageError);
            }
            console.error('Error during logout:', error);
        }
    }

    async refreshToken(): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.code === 'ECONNABORTED') {
                throw new Error('Error de conexión al refrescar el token');
            }
            throw new Error('Error al refrescar el token');
        }
    }
}

export const authService = new AuthService(); 