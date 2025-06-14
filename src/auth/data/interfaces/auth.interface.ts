
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface Cooperative {
    id: number;
    name: string;
    principalColor: string;
}

export interface User {
    id: number;
    name: string;
    rol: 'driver';
    phone: string;
    email: string;
    cooperative: Cooperative;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
} 