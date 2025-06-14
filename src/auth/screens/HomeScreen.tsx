import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScannerTab from '../components/ScannerTab';
import UserInfoTab from '../components/UserInfoTab';
import { useAuth } from '../store/auth-store';

const HomeScreen = () => {
    const [activeTab, setActiveTab] = useState<'info' | 'scanner'>('info');
    const { user } = useAuth();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row m-5 rounded-xl bg-blue-100 p-1 shadow-md">
                <TouchableOpacity
                    className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'info' ? 'bg-darkblue' : ''}`}
                    onPress={() => setActiveTab('info')}
                >
                    <Text className={`text-base font-semibold ${activeTab === 'info' ? 'text-white' : 'text-blue-900'}`}>
                        Información
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'scanner' ? 'bg-darkblue' : ''}`}
                    onPress={() => setActiveTab('scanner')}
                >
                    <Text className={`text-base font-semibold ${activeTab === 'scanner' ? 'text-white' : 'text-blue-900'}`}>
                        Escanear QR
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1">
                {activeTab === 'info' ? <UserInfoTab user={user!} /> : <ScannerTab />}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen; 