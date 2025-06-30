import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/common/constants/colors';
import { Trip } from '../services/tripsService';

interface TripCardProps {
    trip: Trip;
    onPress?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'ACTIVE':
                return Colors.success;
            case 'PENDING':
                return Colors.warning;
            case 'CANCELLED':
                return Colors.error;
            default:
                return Colors.textSecondary;
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toUpperCase()) {
            case 'ACTIVE':
                return 'Activo';
            case 'PENDING':
                return 'Pendiente';
            case 'CANCELLED':
                return 'Cancelado';
            default:
                return status;
        }
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.touchable}>
            <View style={styles.tripCard}>
                <View style={styles.tripHeader}>
                    <View style={styles.routeInfo}>
                        <Text style={styles.routeText}>
                            {trip.frequency.originCity} → {trip.frequency.destinationCity}
                        </Text>
                        <Text style={styles.timeText}>{trip.frequency.departureTime}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(trip.status)}</Text>
                    </View>
                </View>

                <View style={styles.tripDetails}>
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>{formatDate(trip.startDate)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="bus-outline" size={16} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>
                            {trip.bus.licensePlate} - {trip.bus.busType.name}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="business-outline" size={16} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>{trip.cooperativeName}</Text>
                    </View>
                </View>

                <View style={styles.ticketsInfo}>
                    <View style={styles.ticketStat}>
                        <Text style={styles.ticketLabel}>Total</Text>
                        <Text style={styles.ticketValue}>{trip.totalTickets}</Text>
                    </View>
                    <View style={styles.ticketStat}>
                        <Text style={styles.ticketLabel}>Abordados</Text>
                        <Text style={[styles.ticketValue, { color: Colors.success }]}>
                            {trip.boardedTickets}
                        </Text>
                    </View>
                    <View style={styles.ticketStat}>
                        <Text style={styles.ticketLabel}>Pendientes</Text>
                        <Text style={[styles.ticketValue, { color: Colors.warning }]}>
                            {trip.pendingTickets}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        marginBottom: 12,
    },
    tripCard: {
        backgroundColor: Colors.backgroundPrimary,
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    routeInfo: {
        flex: 1,
    },
    routeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    timeText: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: Colors.backgroundPrimary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    tripDetails: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginLeft: 8,
    },
    ticketsInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.gray200,
    },
    ticketStat: {
        alignItems: 'center',
    },
    ticketLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    ticketValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
}); 