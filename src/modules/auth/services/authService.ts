import { API_ENDPOINTS, API_URL } from "@/src/common/config/config";
import { tokenService } from "@/src/common/services/tokenService";

// Interfaces
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Cooperative {
  id: number;
  name: string;
  address: string;
  logo: string;
  phone: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Servicio para manejar la autenticación con el backend
 */
export const authService = {
  /**
   * Realiza la petición de login al backend
   * @param credentials Credenciales del usuario (email y password)
   * @returns Respuesta con token y datos del usuario
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const url = `${API_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
      console.log('Login URL:', url);
      console.log('Credentials:', { email: credentials.email, password: '***' });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Get the response text first
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      // Check for service suspension or server errors
      if (response.status === 503) {
        if (responseText.includes('Service Suspended') || responseText.includes('suspended')) {
          throw new Error('El servicio del backend está suspendido. Por favor, contacta al administrador.');
        }
        throw new Error('El servidor no está disponible temporalmente. Intenta más tarde.');
      }

      if (response.status >= 500) {
        throw new Error('Error interno del servidor. Intenta más tarde.');
      }

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        console.error('Response text:', responseText);

        // Check if it's an HTML error page
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html>')) {
          throw new Error('El servidor está devolviendo una página de error. Verifica que el backend esté funcionando.');
        }

        throw new Error('El servidor devolvió una respuesta inválida. Verifica la conexión.');
      }

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 401) {
          throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
        }
        if (response.status === 404) {
          throw new Error('El endpoint de login no fue encontrado. Verifica la configuración del backend.');
        }
        if (response.status === 422) {
          throw new Error('Datos de entrada inválidos. Verifica el formato de tu email.');
        }

        throw new Error(data.message || `Error del servidor (${response.status}): ${response.statusText}`);
      }

      // Validate the response structure
      if (!data.access_token || !data.user) {
        console.error('Invalid response structure:', data);
        throw new Error('El servidor devolvió una respuesta incompleta. Falta el token o información del usuario.');
      }

      console.log('Login successful, user:', data.user.firstName);

      // Guardar el token
      await tokenService.saveToken(data.access_token);

      return data;
    } catch (error) {
      console.error('Error en servicio de login:', error);
      throw error;
    }
  },

  /**
   * Valida un token JWT (para verificar si sigue siendo válido)
   * NOTA: Actualmente retorna true siempre ya que el endpoint no está implementado
   * @param token Token JWT a validar
   * @returns true si el token es válido, false en caso contrario
   */
  validateToken: async (token: string): Promise<boolean> => {
    // Temporalmente retornamos true siempre ya que el endpoint no está implementado
    return true;

    /* IMPLEMENTACIÓN FUTURA
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.VALIDATE_TOKEN}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Si la respuesta es exitosa, el token es válido
      if (response.ok) {
        return true;
      }
      
      // Si el status es 401 o 403, el token definitivamente no es válido
      if (response.status === 401 || response.status === 403) {
        return false;
      }
      
      // Para otros errores HTTP (como 500, 503, etc.), asumimos que es un problema
      // del servidor y consideramos el token como válido para no cerrar la sesión
      // del usuario por problemas del servidor
      console.warn('Error al validar token. Código:', response.status);
      return true;
      
    } catch (error) {
      // En caso de error de red (servidor caído, sin conexión, etc.)
      // también asumimos que el token es válido para no cerrar la sesión
      console.error('Error al validar token:', error);
      return true;
    }
    */
  },

  /**
   * Obtiene la información de la cooperativa del usuario
   * @param userId ID del usuario
   * @returns Información de la cooperativa
   */
  getCooperativeInfo: async (userId: number): Promise<Cooperative> => {
    try {
      const token = await tokenService.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const url = `${API_URL}${API_ENDPOINTS.USER.COOPERATIVE}/${userId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Get the response text first
      const responseText = await response.text();

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid server response format');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener información de la cooperativa');
      }

      return data;
    } catch (error) {
      console.error('Error al obtener información de la cooperativa:', error);
      throw error;
    }
  }
}; 