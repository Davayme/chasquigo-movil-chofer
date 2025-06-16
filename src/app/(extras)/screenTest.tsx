import { Camera, CameraType, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Colors } from '@/src/common/constants/colors';
import { showToast } from '@/src/common/components/Toast';
import Header from '@/src/common/components/Header';

interface TicketData {
  ticketId: number;
  passengerId: string;
  passengerName: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  bus: string;
  seat: string;
  hash: string;
  exp: string;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

function ScreenTest() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    setIsLoading(true);

    try {
      const parsedData = JSON.parse(data);

      // Validate if the scanned data has the required ticket structure
      if (
        parsedData.ticketId &&
        parsedData.passengerId &&
        parsedData.passengerName &&
        parsedData.origin &&
        parsedData.destination &&
        parsedData.date &&
        parsedData.time &&
        parsedData.bus &&
        parsedData.seat &&
        parsedData.hash &&
        parsedData.exp
      ) {
        setTicketData(parsedData);
        showToast({
          type: 'success',
          title: 'Ticket válido',
          message: 'El ticket ha sido validado correctamente'
        });
      } else {
        showToast({
          type: 'error',
          title: 'Ticket inválido',
          message: 'Esto no es un ticket'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Esto no es un ticket'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setTicketData(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Header title="Escanear QR" />
        <View style={styles.centerContent}>
          <Text style={styles.message}>Solicitando permiso de cámara...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Header title="Escanear QR" />
        <View style={styles.centerContent}>
          <Text style={styles.message}>Sin acceso a la cámara</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Escanear QR" />

      {!scanned ? (
        <View style={styles.scannerContainer}>
          <CameraView
            style={styles.scanner}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </View>
            </View>
            <Text style={styles.scanText}>Coloca el código QR dentro del marco</Text>
          </CameraView>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          {isLoading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.message}>Validando ticket...</Text>
            </View>
          ) : ticketData ? (
            <View style={styles.ticketContainer}>
              <View style={styles.ticketHeader}>
                <Ionicons name="checkmark-circle" size={40} color={Colors.success} />
                <Text style={styles.ticketTitle}>Ticket Válido</Text>
              </View>

              <View style={styles.ticketInfo}>
                <InfoRow label="Pasajero" value={ticketData.passengerName} />
                <InfoRow label="ID" value={ticketData.passengerId} />
                <InfoRow label="Origen" value={ticketData.origin} />
                <InfoRow label="Destino" value={ticketData.destination} />
                <InfoRow label="Fecha" value={ticketData.date} />
                <InfoRow label="Hora" value={ticketData.time} />
                <InfoRow label="Bus" value={ticketData.bus} />
                <InfoRow label="Asiento" value={ticketData.seat} />
              </View>
            </View>
          ) : null}

          <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
            <Ionicons name="scan-outline" size={24} color="#fff" />
            <Text style={styles.scanAgainText}>Escanear de nuevo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: Colors.primary,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: Colors.primary,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: Colors.primary,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: Colors.primary,
  },
  scanText: {
    position: 'absolute',
    bottom: 100,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  resultContainer: {
    flex: 1,
    padding: 20,
  },
  ticketContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 10,
  },
  ticketInfo: {
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  scanAgainButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ScreenTest;
