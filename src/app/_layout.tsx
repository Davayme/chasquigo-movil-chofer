
import { Stack } from "expo-router";
import React from "react";
import { Platform, StatusBar } from "react-native";
import { ToastContainer } from "../common/components/Toast";
import { AuthProvider } from "../common/context/AuthContext";
import { useSplashScreen } from "../common/hooks/useSplashScreen";

function RootLayoutContent() {
  useSplashScreen();

  return (
    <>
      <StatusBar
        barStyle={Platform.OS === "android" ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(extras)" />
      </Stack>
      <ToastContainer />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
        <RootLayoutContent />
    </AuthProvider>
  );
}
