import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoreScreen from '../features/more/MoreScreen';
import SettingsScreen from '../features/more/SettingsScreen';
import AnalyticsScreen from '../features/more/AnalyticsScreen';
import AboutScreen from '../features/more/AboutScreen';

const Stack = createStackNavigator();

export default function MoreNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MoreList" component={MoreScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
    );
}
