import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../common/context/AuthContext';


export default function ExtrasLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screenTest" />

    </Stack>
  );
}