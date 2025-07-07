import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTickets } from '../hooks/useTickets';
import { Colors } from '@/src/common/constants/colors';
import Header from '@/src/common/components/Header';
import { ticketService, Ticket } from '../services/ticketService';

export default function TicketsScreen() {
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const id = tripId ? parseInt(tripId, 10) : null;
    const { tickets: initialTickets, loading, error } = useTickets(id);
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [abordando, setAbordando] = useState<number | null>(null);

    React.useEffect(() => {
        setTickets(initialTickets);
    }, [initialTickets]);

    const handleAbordar = async (ticketId: number) => {
        setAbordando(ticketId);
        try {
            const res = await ticketService.validateTicket(ticketId);
            Alert.alert('Éxito', res.message || 'Ticket abordado exitosamente');
            // Update the ticket in the list
            setTickets((prev) =>
                prev.map((t) =>
                    t.id === ticketId ? { ...t, ...res.ticket } : t
                )
            );
        } catch (e: any) {
            Alert.alert('Error', e.message || 'No se pudo abordar el ticket');
        } finally {
            setAbordando(null);
        }
    };

    // Simulate manual payment boarding for PENDING tickets
    const handleManualBoarding = (ticketId: number) => {
        setAbordando(ticketId);
        setTimeout(() => {
            setTickets((prev) =>
                prev.map((t) =>
                    t.id === ticketId ? { ...t, status: 'BOARDED' } : t
                )
            );
            setAbordando(null);
            Alert.alert('Éxito', 'Abordaje exitoso con pago manual. Guardado para el sistema central');
        }, 1000);
    };

    const getStatusColor = (status: string) => {
        if (["USED", "CANCELLED", "EXPIRED"].includes(status)) return styles.statusRed;
        if (status === "CONFIRMED") return styles.statusGreen;
        return styles.statusOrange;
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'Pendiente de pago';
            case 'PAID':
                return 'Pagado';
            case 'CONFIRMED':
                return 'Confirmado';
            case 'BOARDED':
                return 'Abordado';
            case 'USED':
                return 'Viaje completado';
            case 'CANCELLED':
                return 'Cancelado';
            case 'EXPIRED':
                return 'Expirado';
            default:
                return status;
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Tickets del Viaje" />
            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Cargando tickets...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={tickets}
                    keyExtractor={(item, index) => `${item.id}_${index}`}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={styles.ticketCard}>
                            <View style={styles.ticketHeader}>
                                <Text style={styles.ticketId}>Ticket #{item.id}</Text>
                                <Text style={[styles.status, getStatusColor(item.status)]}>{getStatusText(item.status)}</Text>
                            </View>
                            <Text style={styles.route}>{item.originCity} → {item.destinationCity}</Text>
                            <Text style={styles.price}>
                                Total: ${typeof item.finalTotalPrice === 'number' ? item.finalTotalPrice.toFixed(2) : '0.00'}
                            </Text>
                            <Text style={styles.date}>Compra: {item.purchaseDate ? new Date(item.purchaseDate).toLocaleString() : '-'}</Text>
                            <Text style={styles.buyer}>Comprador: {item.buyer?.firstName || ''} {item.buyer?.lastName || ''}</Text>
                            <Text style={styles.passengerTitle}>Pasajeros:</Text>
                            {item.passengers.map((p, idx) => (
                                <View key={`${p.id}_${idx}`} style={styles.passengerRow}>
                                    <Text style={styles.passengerName}>{p.firstName} {p.lastName}</Text>
                                    <Text style={styles.passengerSeat}>Asiento: {p.seatNumber} ({p.seatType})</Text>
                                    <Text style={styles.passengerType}>{p.passengerType}</Text>
                                    <Text style={styles.passengerPrice}>${typeof p.finalPrice === 'number' ? p.finalPrice.toFixed(2) : '0.00'}</Text>
                                </View>
                            ))}
                            {item.status === 'CONFIRMED' && (
                                <TouchableOpacity
                                    style={styles.abordarButton}
                                    onPress={() => handleAbordar(item.id)}
                                    disabled={abordando === item.id}
                                >
                                    <Text style={styles.abordarButtonText}>{abordando === item.id ? 'Abordando...' : 'ABORDAR'}</Text>
                                </TouchableOpacity>
                            )}
                            {item.status === 'PENDING' && (
                                <TouchableOpacity
                                    style={styles.abordarButton}
                                    onPress={() => handleManualBoarding(item.id)}
                                    disabled={abordando === item.id}
                                >
                                    <Text style={styles.abordarButtonText}>{abordando === item.id ? 'Abordando...' : 'Abordar con paga manual'}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No hay tickets para este viaje.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { fontSize: 16, color: Colors.textSecondary, marginTop: 16 },
    errorText: { fontSize: 16, color: Colors.error, textAlign: 'center', marginTop: 16 },
    listContainer: { padding: 16 },
    ticketCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
    ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    ticketId: { fontWeight: 'bold', fontSize: 16, color: Colors.primary },
    status: { fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
    statusGreen: { color: Colors.success },
    statusRed: { color: Colors.error },
    statusOrange: { color: Colors.warning },
    route: { fontSize: 15, color: Colors.textPrimary, marginBottom: 2 },
    price: { fontSize: 15, color: Colors.textPrimary, marginBottom: 2 },
    date: { fontSize: 13, color: Colors.textSecondary, marginBottom: 2 },
    buyer: { fontSize: 13, color: Colors.textSecondary, marginBottom: 2 },
    passengerTitle: { fontWeight: 'bold', marginTop: 8, marginBottom: 2, color: Colors.primary },
    passengerRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 2 },
    passengerName: { fontSize: 13, color: Colors.textPrimary, flex: 2 },
    passengerSeat: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
    passengerType: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
    passengerPrice: { fontSize: 13, color: Colors.success, flex: 1, textAlign: 'right' },
    abordarButton: { backgroundColor: Colors.success, padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
    abordarButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    emptyText: { textAlign: 'center', color: Colors.textSecondary, marginTop: 32 },
}); 