import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ClothesScreen from '../features/clothes/ClothesScreen';
import AddClothScreen from '../features/clothes/AddClothScreen';
import CategoryManagerScreen from '../features/clothes/CategoryManagerScreen';

const Stack = createStackNavigator();

export default function ClothesNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ClothesList" component={ClothesScreen} />
            <Stack.Screen name="AddCloth" component={AddClothScreen} />
            <Stack.Screen name="EditCloth" component={AddClothScreen} />
            <Stack.Screen name="CategoryManager" component={CategoryManagerScreen} />
        </Stack.Navigator>
    );
}
