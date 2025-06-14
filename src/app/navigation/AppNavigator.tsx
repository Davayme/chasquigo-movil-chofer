import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '@/src/auth/screens/LoginScreen';
import ScanTicketScreen from '../../modules/tickets/screens/ScanTicketScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    // TODO: Implement actual authentication state management
    const isAuthenticated = false;

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#1a237e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                {!isAuthenticated ? (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <Stack.Screen
                        name="ScanTicket"
                        component={ScanTicketScreen}
                        options={{
                            title: 'Escanear Boleto',
                        }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator; 