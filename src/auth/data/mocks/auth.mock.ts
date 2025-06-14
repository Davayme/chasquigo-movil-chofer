import { UserRole } from '../enums/user.enum';
import { AuthResponse, User } from '../interfaces/auth.interface';

export const mockUsers: User[] = [
    {
        id: 1,
        name: 'Chofer Demo',
        email: 'chofer@chasquigo.com',
        role: UserRole.DRIVER,
        avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
        id: 2,
        name: 'Admin Demo',
        email: 'admin@chasquigo.com',
        role: UserRole.ADMIN,
        avatar: 'https://i.pravatar.cc/150?img=2'
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