import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OutfitsScreen from '../features/outfits/OutfitsScreen';
import AddOutfitScreen from '../features/outfits/AddOutfitScreen';
import OutfitDetailScreen from '../features/outfits/OutfitDetailScreen';
import OutfitCategoryManagerScreen from '../features/outfits/OutfitCategoryManagerScreen';

const Stack = createStackNavigator();

export default function OutfitsNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OutfitsList" component={OutfitsScreen} />
            <Stack.Screen name="OutfitDetail" component={OutfitDetailScreen} />
            <Stack.Screen name="AddOutfit" component={AddOutfitScreen} />
            <Stack.Screen name="OutfitCategoryManager" component={OutfitCategoryManagerScreen} />
        </Stack.Navigator>
    );
}
