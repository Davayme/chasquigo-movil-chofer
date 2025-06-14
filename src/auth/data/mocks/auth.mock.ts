import { AuthResponse, User } from '../interfaces/auth.interface';

export const mockUsers: User[] = [
    {
        id: 1,
        name: 'Chofer Demo',
        email: 'chofer@chasquigo.com',
        rol: 'driver',
        phone: '0999999999',
        avatar: 'https://i.pravatar.cc/150?img=1',
        cooperative: {
            id: 1,
            name: 'Cooperativa SUmei',
            principalColor: '#1E3A8A'
        }
    },
    {
        id: 2,
        name: 'Admin Demo',
        email: 'admin@chasquigo.com',
        rol: 'driver',
        phone: '0999999998',
        avatar: 'https://i.pravatar.cc/150?img=2',
        cooperative: {
            id: 1,
            name: 'Cooperativa Demo',
            principalColor: '#1E3A8A'
        }
    }
];

export const mockAuthResponses: Record<string, AuthResponse> = {
    'chofer@chasquigo.com': {
        token: 'mock-jwt-token-chofer-123456789',
        user: mockUsers[0]
    },
    'admin@chasquigo.com': {
        token: 'mock-jwt-token-admin-123456789',
        user: mockUsers[1]
    }
}; 