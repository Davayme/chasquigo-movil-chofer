import { API_URL } from '@/src/common/config/config';
import { tokenService } from '@/src/common/services/tokenService';

export interface Passenger {
    id: number;
    firstName: string;
    lastName: string;
    seatNumber: number;
    seatType: string;
    passengerType: string;
    finalPrice: number;
}

export interface Buyer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface Ticket {
    id: number;
    status: string;
    qrCode: string | null;
    purchaseDate: string;
    boardingTime: string | null;
    scanCount: number;
    lastScanTime: string | null;
    passengerCount: number;
    finalTotalPrice: number;
    originCity: string;
    destinationCity: string;
    passengers: Passenger[];
    buyer: Buyer;
}

export const ticketService = {
    async getTicketsByTripId(tripId: number): Promise<Ticket[]> {
        const token = await tokenService.getToken();
        if (!token) throw new Error('No hay token de autenticación');
        const url = `${API_URL}/driver-trips/trip/${tripId}/tickets`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error('Respuesta inválida del servidor');
        }
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener los tickets');
        }
        if (!Array.isArray(data)) {
            throw new Error('La respuesta no es una lista de tickets');
        }
        return data;
    },
    async validateTicket(ticketId: number): Promise<any> {
        const token = await tokenService.getToken();
        if (!token) throw new Error('No hay token de autenticación');
        const url = `${API_URL}/driver-trips/ticket/${ticketId}/validate`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ ticketId, status: 'BOARDED' }),
        });
        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error('Respuesta inválida del servidor');
        }
        if (!response.ok) {
            throw new Error(data.message || 'Error al validar el ticket');
        }
        return data;
    },
    validateQR: async (qrData: string) => {
        const response = await fetch(`${API_URL}/tickets-history/validate-qr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ qrData }),
        });
        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error('Respuesta inválida del servidor');
        }
        if (!response.ok) {
            throw new Error(data.message || 'Error al validar el QR');
        }
        return data;
    },
}; 