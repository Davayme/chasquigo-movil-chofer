import { useEffect, useState } from 'react';
import { ticketService, Ticket } from '../services/ticketService';

export function useTickets(tripId: number | null) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tripId) return;
        setLoading(true);
        setError(null);
        ticketService.getTicketsByTripId(tripId)
            .then(setTickets)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [tripId]);

    return { tickets, loading, error };
} 