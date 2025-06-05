import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ScanTicketScreen = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        Alert.alert(
            'Boleto Escaneado',
            `Tipo: ${type}\nDatos: ${data}`,
            [
                {
                    text: 'Escanear de nuevo',
                    onPress: () => setScanned(false),
                },
            ]
        );
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text>Solicitando permiso de cámara...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text>Sin acceso a la cámara</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanArea} />
                </View>
                <View style={styles.buttonContainer}>
                    {scanned && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setScanned(false)}
                        >
                            <Text style={styles.buttonText}>Escanear de nuevo</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Camera>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: 'transparent',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ScanTicketScreen; 