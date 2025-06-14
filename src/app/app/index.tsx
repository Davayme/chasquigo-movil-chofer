import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HomeScreen from '../../auth/screens/HomeScreen';
import { useAuth } from '../../auth/store/auth-store';

export default function AppScreen() {
    const { logout } = useAuth();

    return (
        <View style={styles.container}>
            <HomeScreen />
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoutButton: {
        backgroundColor: '#1E3A8A',
        padding: 15,
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 