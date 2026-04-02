import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LaundryScreen from '../features/laundry/LaundryScreen';
import AddLaundryScreen from '../features/laundry/AddLaundryScreen';
import LaundryDetailScreen from '../features/laundry/LaundryDetailScreen';

const Stack = createStackNavigator();

export default function LaundryNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LaundryList" component={LaundryScreen} />
            <Stack.Screen name="AddLaundry" component={AddLaundryScreen} />
            <Stack.Screen name="LaundryDetail" component={LaundryDetailScreen} />
        </Stack.Navigator>
    );
}
