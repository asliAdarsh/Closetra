import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

import ClothesNavigator from './ClothesNavigator';
import LaundryNavigator from './LaundryNavigator';
import TripsNavigator from './TripsNavigator';
import OutfitsNavigator from './OutfitsNavigator';
import MoreNavigator from './MoreNavigator';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const { colors, isDark } = useTheme();

    const navigationTheme = {
        ...(isDark ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            primary: colors.primary,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: keyof typeof Ionicons.glyphMap = 'shirt';

                        if (route.name === 'Clothes') {
                            iconName = focused ? 'shirt' : 'shirt-outline';
                        } else if (route.name === 'Laundry') {
                            iconName = focused ? 'water' : 'water-outline';
                        } else if (route.name === 'Trips') {
                            iconName = focused ? 'airplane' : 'airplane-outline';
                        } else if (route.name === 'Outfits') {
                            iconName = focused ? 'body' : 'body-outline';
                        } else if (route.name === 'More') {
                            iconName = focused ? 'grid' : 'grid-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarStyle: {
                        backgroundColor: colors.surface,
                        borderTopColor: colors.border,
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Clothes" component={ClothesNavigator} />
                <Tab.Screen name="Laundry" component={LaundryNavigator} />
                <Tab.Screen name="Trips" component={TripsNavigator} />
                <Tab.Screen name="Outfits" component={OutfitsNavigator} />
                <Tab.Screen name="More" component={MoreNavigator} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
