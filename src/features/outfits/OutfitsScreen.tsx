import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, LayoutAnimation, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOutfitsStore } from './store/outfitsStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { EmptyState } from '../../components/EmptyState';
import { OutfitCard } from '../../components/OutfitCard';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';

export default function OutfitsScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { outfits, fetchData, toggleFavorite, getOutfitItems } = useOutfitsStore();
    const { clothes } = useClothesStore();
    const [filter, setFilter] = useState<'All' | 'Favorites'>('All');

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredOutfits = filter === 'Favorites' ? outfits.filter(o => o.isFavorite) : outfits;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Outfits</Text>
            </View>

            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[
                        styles.filterChip,
                        { borderColor: colors.border },
                        filter === 'All' && { backgroundColor: colors.text, borderColor: colors.text }
                    ]}
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setFilter('All');
                    }}
                >
                    <Text style={[styles.filterText, { color: filter === 'All' ? colors.background : colors.text }]}>All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterChip,
                        { borderColor: colors.border },
                        filter === 'Favorites' && { backgroundColor: colors.text, borderColor: colors.text }
                    ]}
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setFilter('Favorites');
                    }}
                >
                    <Text style={[styles.filterText, { color: filter === 'Favorites' ? colors.background : colors.text }]}>Favorites</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredOutfits}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.row}
                ListEmptyComponent={
                    <EmptyState
                        iconName="body-outline"
                        message={filter === 'Favorites' ? "No favorite outfits" : "No outfits saved"}
                        subMessage={filter === 'Favorites' ? "Tap the heart icon to save." : "Tap the + button to create a new outfit combination."}
                    />
                }
                renderItem={({ item }) => {
                    const outfitItems = getOutfitItems(item.id);
                    const outfitClothes = outfitItems
                        .map(i => clothes.find(c => c.id === i.clothId))
                        .filter(Boolean) as any[];

                    return (
                        <View style={styles.cardWrapper}>
                            <OutfitCard
                                outfit={item}
                                items={outfitClothes}
                                onPress={() => navigation.navigate('OutfitDetail', { id: item.id })}
                                onToggleFavorite={(id, isFav) => {
                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                    toggleFavorite(id, isFav);
                                }}
                            />
                        </View>
                    );
                }}
            />

            <FloatingActionButton onPress={() => navigation.navigate('AddOutfit')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: spacing.l,
        paddingTop: spacing.xl,
        paddingBottom: spacing.s,
    },
    title: { ...typography.h1 },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.l,
        paddingBottom: spacing.m,
        gap: spacing.s,
    },
    filterChip: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        borderWidth: 1,
    },
    filterText: {
        ...typography.body,
        fontWeight: 'bold',
    },
    grid: { paddingHorizontal: spacing.l, paddingBottom: 100 },
    row: { gap: spacing.m, marginBottom: spacing.m },
    cardWrapper: { flex: 1, maxWidth: '50%' },
});
