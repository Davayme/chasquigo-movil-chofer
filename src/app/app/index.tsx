import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../auth/store/auth-store';

export default function HomeScreen() {
    const { logout, user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Bienvenido, {user?.name}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#1E3A8A',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 