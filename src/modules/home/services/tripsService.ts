import { API_ENDPOINTS, API_URL } from '@/src/common/config/config';
import { tokenService } from '@/src/common/services/tokenService';

export interface TripFrequency {
    id: number;
    originCity: string;
    destinationCity: string;
    departureTime: string;
    antResolution: string;
}

export interface BusType {
    name: string;
    seatsFloor1: number;
    seatsFloor2: number;
}

export interface Bus {
    id: number;
    licensePlate: string;
    chassisBrand: string;
    bodyworkBrand: string;
    busType: BusType;
}

export interface Trip {
    id: number;
    cooperativeId: number;
    cooperativeName: string;
    startDate: string;
    status: string;
    frequency: TripFrequency;
    bus: Bus;
    totalTickets: number;
    boardedTickets: number;
    pendingTickets: number;
}

export const tripsService = {
    async getDriverTrips(driverId: string): Promise<Trip[]> {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const url = `${API_URL}${API_ENDPOINTS.TRIPS.DRIVER_TRIPS}/${driverId}`;

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
                console.error('Response text:', responseText);
                throw new Error('Invalid server response format');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener los viajes');
            }

            // Validate that data is an array
            if (!Array.isArray(data)) {
                throw new Error('Invalid response structure: expected array of trips');
            }

            return data;
        } catch (error) {
            console.error('Error fetching driver trips:', error);
            throw error;
        }
    }
}; 