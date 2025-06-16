import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../common/components/Header';
import { Colors } from '../../common/constants/colors';

export default function TermsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <StatusBar style="light" />

            <Header title="Términos y Condiciones" />

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
                    <Text style={styles.text}>
                        Al acceder y utilizar la aplicación Chasquigo, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder a la aplicación.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Uso del Servicio</Text>
                    <Text style={styles.text}>
                        La aplicación Chasquigo está diseñada para facilitar el servicio de transporte. Los conductores deben mantener un comportamiento profesional y respetuoso en todo momento.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Responsabilidades del Conductor</Text>
                    <Text style={styles.text}>
                        • Mantener una conducta profesional y respetuosa{'\n'}
                        • Cumplir con todas las leyes de tránsito{'\n'}
                        • Mantener el vehículo en óptimas condiciones{'\n'}
                        • Respetar la privacidad de los pasajeros{'\n'}
                        • Mantener actualizada la documentación requerida
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Privacidad</Text>
                    <Text style={styles.text}>
                        Nos comprometemos a proteger su privacidad. Toda la información personal recopilada será utilizada únicamente para los fines establecidos en nuestra política de privacidad.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Modificaciones</Text>
                    <Text style={styles.text}>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la aplicación.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Contacto</Text>
                    <Text style={styles.text}>
                        Para cualquier consulta sobre estos términos y condiciones, puede contactarnos a través de:
                        {'\n\n'}
                        Email: legal@chasquigo.com{'\n'}
                        Teléfono: +51 987 654 321
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Última actualización: Marzo 2024</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
}); 