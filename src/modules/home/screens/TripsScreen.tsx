import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/common/constants/colors';
import { Trip } from '../services/tripsService';
import { useTrips } from '../hooks/useTrips';
import { TripCard } from '../components/TripCard';
import { useAuth } from '@/src/common/context/AuthContext';
import Header from '@/src/common/components/Header';
import { router } from 'expo-router';

export default function TripsScreen() {
    const { user } = useAuth();
    const driverId = user?.id?.toString() || '';

    const { trips, loading, refreshing, error, refreshTrips } = useTrips(driverId);

    if (!driverId) {
        return (
            <View style={styles.container}>
                <Header title="Viajes Próximos" />
                <View style={styles.centerContent}>
                    <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
                    <Text style={styles.errorText}>No se pudo obtener la información del conductor</Text>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <Header title="Viajes Próximos" />
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Cargando viajes...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Header title="Viajes Próximos" />
                <View style={styles.centerContent}>
                    <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
                    <Text style={styles.errorText}>Error al cargar viajes</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={refreshTrips}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Viajes Próximos" />

            {trips.length === 0 ? (
                <View style={styles.centerContent}>
                    <Ionicons name="car-outline" size={64} color={Colors.textSecondary} />
                    <Text style={styles.emptyText}>No hay viajes programados</Text>
                    <Text style={styles.emptySubtext}>
                        Los viajes próximos aparecerán aquí
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={trips}
                    keyExtractor={(item, index) => `${item.id}_${index}`}
                    renderItem={({ item }) => (
                        <TripCard
                            trip={item}
                            onPress={() => router.push({ pathname: '/tickets/[tripId]', params: { tripId: item.id.toString() } })}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshTrips} />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundSecondary,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
    listContainer: {
        padding: 16,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.error,
        marginTop: 16,
        textAlign: 'center',
    },
    retryButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        marginTop: 16,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.backgroundPrimary,
    },
}); 