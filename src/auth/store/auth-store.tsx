import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse, LoginCredentials } from '../data/interfaces/auth.interface';
import { authService } from '../services/auth-service';

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthResponse['user'] | null;
    token: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
            const storedUser = await AsyncStorage.getItem(USER_KEY);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading auth data:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            const response = await authService.login(credentials);

            await AsyncStorage.setItem(TOKEN_KEY, response.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));

            setToken(response.token);
            setUser(response.user);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        isAuthenticated: !!token,
        user,
        token,
        login,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 