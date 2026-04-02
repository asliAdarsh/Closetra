import React, { useEffect, useMemo } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOutfitsStore } from './store/outfitsStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { EmptyState } from '../../components/EmptyState';
import { OutfitCard } from '../../components/OutfitCard';
import { CategoryChip } from '../../components/CategoryChip';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';

export default function OutfitsScreen() {
    const { colors, gridColumns } = useTheme();
    const navigation = useNavigation<any>();
    const {
        outfits, outfitCategories, selectedOutfitCategoryId, searchQuery, showFavoritesOnly,
        fetchData, toggleFavorite, getOutfitItems, setSelectedOutfitCategory, setSearchQuery, setShowFavoritesOnly
    } = useOutfitsStore();
    const { clothes } = useClothesStore();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredOutfits = useMemo(() => {
        return outfits.filter(o => {
            if (selectedOutfitCategoryId && o.categoryId !== selectedOutfitCategoryId) {
                return false;
            }
            if (showFavoritesOnly && !o.isFavorite) {
                return false;
            }
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!o.name.toLowerCase().includes(query) &&
                    !(o.notes || '').toLowerCase().includes(query)) {
                    return false;
                }
            }
            return true;
        });
    }, [outfits, selectedOutfitCategoryId, showFavoritesOnly, searchQuery]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Outfits</Text>
                <Ionicons
                    name="settings-outline"
                    size={24}
                    color={colors.text}
                    onPress={() => navigation.navigate('OutfitCategoryManager')}
                />
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                    placeholder="Search name, notes..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Ionicons
                    name={showFavoritesOnly ? "heart" : "heart-outline"}
                    size={28}
                    color={showFavoritesOnly ? colors.error : colors.textSecondary}
                    onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
                />
            </View>

            {/* Category Filter */}
            {outfitCategories.length > 0 && (
                <View>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryList}
                        data={[{ id: null, name: 'All' }, ...outfitCategories]}
                        keyExtractor={item => item.id || 'all'}
                        renderItem={({ item }) => (
                            <CategoryChip
                                label={item.name}
                                icon={(item as any).icon}
                                isSelected={selectedOutfitCategoryId === item.id}
                                onPress={() => setSelectedOutfitCategory(item.id)}
                            />
                        )}
                    />
                </View>
            )}

            <FlatList
                data={filteredOutfits}
                key={`grid-${gridColumns}`}
                keyExtractor={item => item.id}
                numColumns={gridColumns}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={gridColumns > 1 ? styles.row : undefined}
                ListEmptyComponent={
                    <EmptyState
                        iconName="body-outline"
                        message="No outfits found"
                        subMessage="Try adjusting your filters or create a new outfit."
                    />
                }
                renderItem={({ item }) => {
                    const outfitItems = getOutfitItems(item.id);
                    const outfitClothes = outfitItems
                        .map(i => clothes.find(c => c.id === i.clothId))
                        .filter(Boolean) as any[];

                    return (
                        <View style={gridColumns > 1 ? { flex: 1, maxWidth: `${100 / gridColumns}%` } : { marginBottom: spacing.m }}>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        paddingTop: spacing.xl,
        paddingBottom: spacing.s,
    },
    title: { ...typography.h1 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        marginBottom: spacing.m,
    },
    searchIcon: {
        position: 'absolute',
        left: spacing.xl + 10,
        zIndex: 1,
    },
    searchInput: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderRadius: 24,
        paddingLeft: 40,
        paddingRight: spacing.m,
        marginRight: spacing.m,
    },
    categoryList: {
        paddingHorizontal: spacing.l,
        marginBottom: spacing.s,
    },
    grid: { paddingHorizontal: spacing.l, paddingBottom: 100 },
    row: { gap: spacing.m, marginBottom: spacing.m },
});
