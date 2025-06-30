import Constants from 'expo-constants';

// Get API URL from app.json
export const API_URL = 'http://192.168.100.13:3000';
// export const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://45.14.225.213:3000/api/v1/';

export const STRIPE_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.stripePublishableKey || undefined;

export const STRIPE_SECRET_KEY = Constants.expoConfig?.extra?.stripeSecretKey || undefined;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    VALIDATE_TOKEN: '/auth/validate-token',
  },
  USER: {
    PROFILE: '/users/profile',
    REGISTER: '/users/register',
    COOPERATIVE: '/users/cooperative',
  },
  PAYMENTS: {
    CREATE_PAYMENT_INTENT: '/payments/create-intent',
  },
  QR: {
    GET_QR: '/qr/generate',
  },
  TRIPS: {
    DRIVER_TRIPS: '/driver-trips/driver',
  },
};




