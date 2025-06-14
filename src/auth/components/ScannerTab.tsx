import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ScannerTab = () => {
    return (
        <View style={styles.scannerContainer}>
            <View style={styles.cameraContainer}>
                <View style={styles.scannerFrame}>
                    <View style={styles.scannerCorner} />
                    <View style={[styles.scannerCorner, styles.topRight]} />
                    <View style={[styles.scannerCorner, styles.bottomLeft]} />
                    <View style={[styles.scannerCorner, styles.bottomRight]} />
                </View>
            </View>
            <Text style={styles.scannerText}>Apunta la cámara al código QR del pasajero</Text>
            <TouchableOpacity
                style={styles.scanButton}
                onPress={() => Alert.alert('Próximamente', 'La funcionalidad de escaneo de códigos QR estará disponible próximamente.')}
            >
                <Text style={styles.scanButtonText}>
                    Iniciar Escaneo
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    scannerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    cameraContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
        marginBottom: 20,
        overflow: 'hidden',
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    scannerFrame: {
        position: 'absolute',
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
        borderWidth: 2,
        borderColor: '#1E3A8A',
        borderRadius: 20,
    },
    scannerCorner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: '#1E3A8A',
        borderTopWidth: 4,
        borderLeftWidth: 4,
        top: -2,
        left: -2,
    },
    topRight: {
        right: -2,
        left: undefined,
        borderLeftWidth: 0,
        borderRightWidth: 4,
    },
    bottomLeft: {
        top: undefined,
        bottom: -2,
        borderTopWidth: 0,
        borderBottomWidth: 4,
    },
    bottomRight: {
        top: undefined,
        right: -2,
        left: undefined,
        bottom: -2,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 4,
        borderBottomWidth: 4,
    },
    scannerText: {
        marginTop: 20,
        fontSize: 16,
        color: '#475569',
        textAlign: 'center',
        fontWeight: '500',
    },
    scanButton: {
        backgroundColor: '#1E3A8A',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ScannerTab; 