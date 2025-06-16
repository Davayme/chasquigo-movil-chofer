import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

export const tokenService = {
    /**
     * Guarda el token en el almacenamiento local
     * @param token Token JWT a guardar
     */
    saveToken: async (token: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving token:', error);
            throw error;
        }
    },

    /**
     * Obtiene el token del almacenamiento local
     * @returns Token JWT guardado o null si no existe
     */
    getToken: async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    /**
     * Elimina el token del almacenamiento local
     */
    removeToken: async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing token:', error);
            throw error;
        }
    }
}; 