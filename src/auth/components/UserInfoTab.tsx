import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { User } from '../data/interfaces/auth.interface';

interface UserInfoTabProps {
    user: User;
}

const UserInfoTab = ({ user }: UserInfoTabProps) => {
    return (
        <View style={styles.infoContainer}>
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: user.avatar }}
                    style={styles.avatar}
                />
                <Text style={styles.userName}>{user.name}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Información Personal</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{user.email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Teléfono:</Text>
                    <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Rol:</Text>
                    <Text style={styles.infoValue}>{user.rol}</Text>
                </View>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Información de la Cooperativa</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre:</Text>
                    <Text style={styles.infoValue}>{user.cooperative.name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>ID:</Text>
                    <Text style={styles.infoValue}>{user.cooperative.id}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#1E3A8A',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    infoSection: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E3A8A',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
        paddingVertical: 4,
    },
    infoLabel: {
        flex: 1,
        fontSize: 16,
        color: '#475569',
        fontWeight: '500',
    },
    infoValue: {
        flex: 2,
        fontSize: 16,
        color: '#1E3A8A',
        fontWeight: '500',
    },
});

export default UserInfoTab; 