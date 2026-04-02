import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TripsScreen from '../features/trips/TripsScreen';
import AddTripScreen from '../features/trips/AddTripScreen';
import TripDetailScreen from '../features/trips/TripDetailScreen';

const Stack = createStackNavigator();

export default function TripsNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TripsList" component={TripsScreen} />
            <Stack.Screen name="AddTrip" component={AddTripScreen} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} />
        </Stack.Navigator>
    );
}
