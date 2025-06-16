import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../common/components/Header';
import { Colors } from '../../common/constants/colors';
import { useAuth } from '../../common/context/AuthContext';
import { router } from 'expo-router';
import { authService, Cooperative } from '../../modules/auth/services/authService';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [cooperative, setCooperative] = useState<Cooperative | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateDriverAndLoadData = async () => {
      try {
        if (!user) {
          router.replace('/login');
          return;
        }

        if (user.role !== 'DRIVER') {
          Alert.alert(
            'Acceso Restringido',
            'Esta aplicación es exclusiva para choferes. Su cuenta no tiene los permisos necesarios.',
            [
              {
                text: 'Cerrar Sesión',
                onPress: logout,
                style: 'destructive',
              }
            ],
            { cancelable: false }
          );
          return;
        }

        const cooperativeData = await authService.getCooperativeInfo(user.id);
        setCooperative(cooperativeData);
      } catch (error) {
        console.error('Error loading profile data:', error);
        Alert.alert('Error', 'No se pudo cargar la información del perfil');
      } finally {
        setLoading(false);
      }
    };

    validateDriverAndLoadData();
  }, [user]);

  // Get full name or first initial for avatar
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Usuario';
  const firstInitial = user?.firstName.charAt(0) || 'U';

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar style="light" />
        <Header title="Mi Perfil" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />

      <Header title="Mi Perfil" />

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{firstInitial}</Text>
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{user?.email || 'usuario@ejemplo.com'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Cooperativa</Text>

          <View style={styles.optionItem}>
            <Ionicons name="business-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{cooperative?.name || 'Cargando...'}</Text>
              <Text style={styles.optionDescription}>Cooperativa de Transporte</Text>
            </View>
          </View>

          <View style={styles.optionItem}>
            <Ionicons name="location-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Dirección</Text>
              <Text style={styles.optionDescription}>{cooperative?.address || 'Cargando...'}</Text>
            </View>
          </View>

          <View style={styles.optionItem}>
            <Ionicons name="call-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Teléfono</Text>
              <Text style={styles.optionDescription}>{cooperative?.phone || 'Cargando...'}</Text>
            </View>
          </View>

          <View style={styles.optionItem}>
            <Ionicons name="mail-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Correo</Text>
              <Text style={styles.optionDescription}>{cooperative?.email || 'Cargando...'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Legal</Text>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push('/terms')}
          >
            <Ionicons name="document-text-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Términos y Condiciones</Text>
              <Text style={styles.optionDescription}>Política de privacidad y términos de uso</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
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
    marginBottom: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: Colors.danger,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  versionText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
}); 