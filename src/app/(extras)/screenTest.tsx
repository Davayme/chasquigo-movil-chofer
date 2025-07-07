import { Camera, CameraType, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/src/common/constants/colors';
import { showToast } from '@/src/common/components/Toast';
import Header from '@/src/common/components/Header';
import { ticketService } from '@/src/modules/home/services/ticketService';

// Interface for QR ticket data
interface QRTicketData {
  ticketId: number;
  qrCode: string;
  passengers: Array<{
    passengerId: string;
    passengerName: string;
    seatNumber: number;
    seatType: string;
  }>;
  route: {
    origin: string;
    destination: string;
    date: string;
    time: string;
    bus: string;
  };
  verification: {
    hash: string;
    exp: string;
  };
}

interface ValidationResponse {
  isValid: boolean;
  message: string;
  ticket?: QRTicketData;
}

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

// Helper to translate ticket status to Spanish
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

function ScreenTest() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [ticketData, setTicketData] = useState<QRTicketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [abordando, setAbordando] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setIsLoading(true);
    setModalVisible(true);
    setTicketData(null);
    setValidationResult(null);

    try {
      // First, try to parse the QR data to display ticket info immediately
      try {
        const parsedData = JSON.parse(data) as QRTicketData;
        if (parsedData.ticketId && parsedData.passengers && parsedData.route) {
          setTicketData(parsedData);
        } else {
          throw new Error('El código QR no tiene un formato de ticket válido.');
        }
      } catch (e) {
        throw new Error('El código QR no es válido o está corrupto.');
      }

      // Then, validate with the backend
      const response: ValidationResponse = await ticketService.validateQR(data);
      setValidationResult(response);

      // The backend might return updated ticket info, let's use it if available
      if (response.isValid && response.ticket) {
        setTicketData(response.ticket);
      }

      showToast({
        type: response.isValid ? 'success' : 'error',
        title: response.isValid ? 'QR Válido' : 'QR Inválido',
        message: response.message,
      });
    } catch (error: any) {
      setValidationResult({ isValid: false, message: error.message || 'Error al validar QR' });
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'QR inválido o error al procesar',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setTicketData(null);
    setModalVisible(false);
    setValidationResult(null);
  };

  const handleAbordar = async () => {
    if (!ticketData) return;
    setAbordando(true);

    try {
      // Use the ticketId from QR data to validate the ticket
      const response = await ticketService.validateTicket(ticketData.ticketId);
      Alert.alert('Éxito', response.message || 'Ticket abordado exitosamente');
      setModalVisible(false);
      setTicketData(null);
      setScanned(false);
      setValidationResult(null);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo abordar el ticket');
    } finally {
      setAbordando(false);
    }
  };

  const handleReactivateCamera = () => {
    setScanned(false);
    setTicketData(null);
    setModalVisible(false);
    setValidationResult(null);
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
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.scanner}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        {/* Overlay for scan area and text */}
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.scanArea}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
          <Text style={styles.scanText}>Coloca el código QR dentro del marco</Text>
        </View>
        {/* Button to reactivate camera */}
        {scanned && (
          <TouchableOpacity style={styles.reactivateButton} onPress={handleReactivateCamera}>
            <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
            <Text style={styles.reactivateButtonText}>Reactivar cámara</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal for ticket info */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleScanAgain}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {isLoading ? (
              <View style={styles.centerContent}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.message}>Validando ticket...</Text>
              </View>
            ) : ticketData && validationResult ? (
              // Display ticket info with validation status
              <>
                <View style={styles.ticketHeader}>
                  <Ionicons
                    name={validationResult.isValid ? 'checkmark-circle' : 'alert-circle'}
                    size={40}
                    color={validationResult.isValid ? Colors.success : Colors.error}
                  />
                  <Text style={styles.ticketTitle}>Ticket #{ticketData.ticketId}</Text>
                  <Text style={styles.ticketSubtitle}>{ticketData.qrCode}</Text>
                  <Text style={[styles.ticketStatus, { color: validationResult.isValid ? Colors.success : Colors.error, marginTop: 4 }]}>
                    {getStatusText(validationResult.message)}
                  </Text>
                </View>

                <View style={styles.ticketInfo}>
                  <Text style={styles.infoLabel}>Ruta: <Text style={styles.infoValue}>{ticketData.route.origin} → {ticketData.route.destination}</Text></Text>
                  <Text style={styles.infoLabel}>Fecha: <Text style={styles.infoValue}>{ticketData.route.date}</Text></Text>
                  <Text style={styles.infoLabel}>Hora: <Text style={styles.infoValue}>{ticketData.route.time}</Text></Text>
                  <Text style={styles.infoLabel}>Bus: <Text style={styles.infoValue}>{ticketData.route.bus}</Text></Text>
                  <Text style={styles.infoLabel}>Pasajeros:</Text>
                  {ticketData.passengers.map((passenger, idx) => (
                    <Text key={`${passenger.passengerId}_${idx}`} style={styles.infoValue}>
                      {passenger.passengerName}, Asiento: {passenger.seatNumber} ({passenger.seatType})
                    </Text>
                  ))}
                </View>

                {validationResult.isValid && (
                  <TouchableOpacity
                    style={styles.abordarButton}
                    onPress={handleAbordar}
                    disabled={abordando}
                  >
                    <Text style={styles.abordarButtonText}>{abordando ? 'Abordando...' : 'ABORDAR'}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
                  <Ionicons name="scan-outline" size={24} color="#fff" />
                  <Text style={styles.scanAgainText}>Escanear de nuevo</Text>
                </TouchableOpacity>
              </>
            ) : validationResult && !validationResult.isValid ? (
              // Fallback for critical errors where we can't even show ticket info
              <>
                <View style={styles.ticketHeader}>
                  <Ionicons name="alert-circle" size={40} color={Colors.error} />
                  <Text style={[styles.ticketTitle, { color: Colors.error }]}>Ticket no válido</Text>
                </View>
                <Text style={[styles.ticketStatus, { color: Colors.error, marginTop: 10 }]}>{getStatusText(validationResult.message)}</Text>
                <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
                  <Ionicons name="scan-outline" size={24} color="#fff" />
                  <Text style={styles.scanAgainText}>Escanear de nuevo</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
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
  reactivateButton: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  reactivateButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  ticketHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 10,
  },
  ticketSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  ticketStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  ticketInfo: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
  },
  infoLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  abordarButton: {
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  abordarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanAgainButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tripsButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
  tripsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
});

export default ScreenTest;

