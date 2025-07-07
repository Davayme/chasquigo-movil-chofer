import { useState, useEffect } from 'react';
import { tripsService, Trip } from '../services/tripsService';
import { showToast } from '@/src/common/components/Toast';

export const useTrips = (driverId: string) => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrips = async () => {
        if (!driverId) {
            setError('ID del conductor no disponible');
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            setError(null);
            const tripsData = await tripsService.getDriverTrips(driverId);
            setTrips(tripsData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar los viajes';
            setError(errorMessage);
            showToast({
                type: 'error',
                title: 'Error',
                message: errorMessage,
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const refreshTrips = () => {
        setRefreshing(true);
        fetchTrips();
    };

    useEffect(() => {
        fetchTrips();
    }, [driverId]);

    return {
        trips,
        loading,
        refreshing,
        error,
        refreshTrips,
    };
}; 