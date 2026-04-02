import React, { useEffect, useMemo } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClothesStore } from './store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { CategoryChip } from '../../components/CategoryChip';
import { ClothCard } from '../../components/ClothCard';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { EmptyState } from '../../components/EmptyState';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type ClothesStackParamList = {
    ClothesList: undefined;
    AddCloth: undefined;
    CategoryManager: undefined;
    EditCloth: { id: string };
};

type NavigationProp = StackNavigationProp<ClothesStackParamList, 'ClothesList'>;

export default function ClothesScreen() {
    const { colors, gridColumns } = useTheme();
    const navigation = useNavigation<NavigationProp>();

    const {
        clothes, categories, searchQuery, seasonFilter, selectedCategoryId,
        fetchData, setSearchQuery, setSelectedCategory, setShowFavoritesOnly, showFavoritesOnly,
        updateCloth
    } = useClothesStore();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredClothes = useMemo(() => {
        return clothes.filter(c => {
            if (selectedCategoryId && c.categoryId !== selectedCategoryId) return false;
            if (showFavoritesOnly && !c.isFavorite) return false;
            if (seasonFilter !== 'All-Season' && c.season !== seasonFilter && c.season !== 'All-Season') return false;

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!c.name.toLowerCase().includes(query) &&
                    !c.color.toLowerCase().includes(query) &&
                    !c.brand.toLowerCase().includes(query) &&
                    !(c.notes || '').toLowerCase().includes(query)) {
                    return false;
                }
            }
            return true;
        });
    }, [clothes, selectedCategoryId, showFavoritesOnly, seasonFilter, searchQuery]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>My Closet</Text>
                <Ionicons
                    name="settings-outline"
                    size={24}
                    color={colors.text}
                    onPress={() => navigation.navigate('CategoryManager')}
                />
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                    placeholder="Search color, brand, notes..."
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

            <View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={c => c.id}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item }) => (
                        <CategoryChip
                            label={item.name}
                            isSelected={selectedCategoryId === item.id}
                            onPress={() => setSelectedCategory(selectedCategoryId === item.id ? null : item.id)}
                        />
                    )}
                />
            </View>

            <FlatList
                key={`grid-${gridColumns}`}
                data={filteredClothes}
                keyExtractor={item => item.id}
                numColumns={gridColumns}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={gridColumns > 1 ? styles.row : undefined}
                ListEmptyComponent={
                    <EmptyState
                        iconName="shirt-outline"
                        message="No clothes found"
                        subMessage="Tap the + button to add some items."
                    />
                }
                renderItem={({ item }) => (
                    <View style={gridColumns > 1 ? { flex: 1, maxWidth: `${100 / gridColumns}%` } : { marginBottom: spacing.m }}>
                        <ClothCard
                            cloth={item}
                            onPress={() => navigation.navigate('EditCloth', { id: item.id })}
                            onToggleFavorite={(id, isFav) => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                updateCloth(id, { isFavorite: isFav ? 1 : 0 });
                            }}
                        />
                    </View>
                )}
            />

            <FloatingActionButton onPress={() => navigation.navigate('AddCloth')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        paddingTop: spacing.xl,
        paddingBottom: spacing.s,
    },
    title: {
        ...typography.h1,
    },
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
    grid: {
        paddingHorizontal: spacing.l,
        paddingBottom: 100,
    },
    row: {
        gap: spacing.m,
        marginBottom: spacing.m,
    },
    cardWrapper: {
        flex: 1,
        maxWidth: '50%',
    }
});
