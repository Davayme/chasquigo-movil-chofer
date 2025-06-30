# Viajes Próximos Feature

## Overview
This feature allows drivers to view their upcoming trips through a dedicated screen accessible via a tab navigation or a button on the main scanning screen.

## Recent Fixes (Latest Update)

### API Connection Issues Resolved
- **Fixed API URL**: Updated from `http://localhost:3000` to `https://chasquigo-backend-7yn2.onrender.com`
- **Added Authentication**: All API calls now include Bearer token authentication
- **Improved Error Handling**: Better JSON parsing and error messages
- **Dynamic Driver ID**: Now uses authenticated user's ID instead of hardcoded value

### Configuration Changes
- Updated `src/common/config/config.ts` to use correct API URL
- Added TRIPS endpoints to API_ENDPOINTS configuration
- Integrated with existing authentication system

## Features

### 1. Trip Display
- Shows all upcoming trips for the driver
- Displays route information (origin → destination)
- Shows departure time and date
- Displays bus information (license plate, bus type)
- Shows cooperative name
- Displays ticket statistics (total, boarded, pending)
- Status indicators with color coding

### 2. Navigation
- **Tab Navigation**: New "Viajes" tab with car icon
- **Button Navigation**: "Mirar viajes próximos" button on the main scanning screen
- Both navigation methods lead to the same trips screen

### 3. User Experience
- Pull-to-refresh functionality
- Loading states with spinners
- Error handling with retry options
- Empty state when no trips are available
- Modern card-based UI design

## Architecture

### File Structure
```
src/modules/home/
├── components/
│   ├── TripCard.tsx          # Individual trip display component
│   └── ApiTest.tsx           # Temporary API debugging component
├── hooks/
│   └── useTrips.ts           # Custom hook for trips data management
├── screens/
│   └── TripsScreen.tsx       # Main trips screen
└── services/
    └── tripsService.ts       # API service for trips data
```

### Components

#### TripCard
- Displays individual trip information
- Handles date formatting
- Status color coding
- Ticket statistics display

#### TripsScreen
- Main screen for displaying trips
- Uses custom hook for data management
- Handles loading, error, and empty states
- Implements pull-to-refresh
- **NEW**: Gets driver ID from authentication context

#### useTrips Hook
- Manages trips data state
- Handles API calls
- Provides refresh functionality
- Error handling
- **NEW**: Validates driver ID before making requests

#### tripsService
- API integration with backend
- TypeScript interfaces for type safety
- Error handling for network requests
- **NEW**: Includes Bearer token authentication
- **NEW**: Better JSON parsing with detailed error logging

## API Integration

### Endpoint
```
GET https://chasquigo-backend-7yn2.onrender.com/driver-trips/driver/{driverId}
```

### Authentication
- **Required**: Bearer token in Authorization header
- **Token Source**: Retrieved from secure storage via tokenService
- **Format**: `Authorization: Bearer {token}`

### Response Format
```typescript
interface Trip {
  id: number;
  cooperativeId: number;
  cooperativeName: string;
  startDate: string;
  status: string;
  frequency: {
    id: number;
    originCity: string;
    destinationCity: string;
    departureTime: string;
    antResolution: string;
  };
  bus: {
    id: number;
    licensePlate: string;
    chassisBrand: string;
    bodyworkBrand: string;
    busType: {
      name: string;
      seatsFloor1: number;
      seatsFloor2: number;
    };
  };
  totalTickets: number;
  boardedTickets: number;
  pendingTickets: number;
}
```

## Usage

### Accessing Trips
1. **Via Tab**: Tap the "Viajes" tab in the bottom navigation
2. **Via Button**: Tap "Mirar viajes próximos" button on the main screen

### Features Available
- View all upcoming trips
- Pull down to refresh the list
- See detailed trip information
- Monitor ticket statistics

## Configuration

### Driver ID
Now dynamically retrieved from authentication context:
```typescript
const { user } = useAuth();
const driverId = user?.id?.toString() || '';
```

### API Base URL
Updated in `src/common/config/config.ts`:
```typescript
export const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://chasquigo-backend-7yn2.onrender.com';
```

### API Endpoints
Added to `API_ENDPOINTS`:
```typescript
TRIPS: {
  DRIVER_TRIPS: '/driver-trips/driver',
},
```

## Error Handling

### JSON Parsing Errors
- Detailed logging of response text when JSON parsing fails
- User-friendly error messages
- Console logging for debugging

### Authentication Errors
- Validates token presence before making requests
- Clear error messages for missing authentication
- Graceful handling of authentication failures

### Network Errors
- Comprehensive error catching
- Toast notifications for user feedback
- Retry functionality

## Debugging

### API Test Component
Temporary component (`ApiTest.tsx`) for debugging API connections:
- Tests the exact URL being called
- Shows response status and headers
- Displays raw response text
- Logs detailed information to console

### Console Logging
Enhanced logging throughout the service:
- URL being called
- Token presence/absence
- Response status and headers
- Raw response text for debugging

## Styling

### Colors
Uses the existing color scheme from `src/common/constants/colors.ts`:
- Primary: `#1d273b`
- Success: `#2ecc71`
- Warning: `#f39c12`
- Error: `#e74c3c`

### Design Patterns
- Card-based layout
- Consistent spacing and typography
- Icon integration with Ionicons
- Shadow effects for depth

## Future Enhancements

1. **Remove Debug Component**: Remove ApiTest component once API is working
2. **Trip Details**: Add detailed view for individual trips
3. **Trip Actions**: Add actions like start trip, end trip
4. **Real-time Updates**: Implement WebSocket for live updates
5. **Offline Support**: Cache trips data for offline viewing
6. **Filtering**: Add filters by date, status, route
7. **Search**: Add search functionality for trips

## Testing

### Manual Testing
1. Navigate to trips screen
2. Verify loading state appears
3. Check if trips are displayed correctly
4. Test pull-to-refresh functionality
5. Test error handling (disconnect network)
6. Verify empty state when no trips

### API Testing
1. Use ApiTest component to verify endpoint accessibility
2. Check authentication token is being sent
3. Verify response format matches expected structure
4. Test with different driver IDs
5. Check error responses

## Dependencies
- `fetch`: HTTP client for API calls (replaced axios)
- `@expo/vector-icons`: Icons (Ionicons)
- `expo-router`: Navigation
- `react-native`: Core React Native components
- `expo-secure-store`: Token storage 