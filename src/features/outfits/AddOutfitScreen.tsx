import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOutfitsStore } from './store/outfitsStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ClothCard } from '../../components/ClothCard';
import { CategoryChip } from '../../components/CategoryChip';
import { useClothesFilter, SortOption } from '../../hooks/useClothesFilter';

export default function AddOutfitScreen({ route }: any) {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { outfits, addOutfit, updateOutfit, deleteOutfit, getOutfitItems, outfitCategories } = useOutfitsStore();
    const { clothes, categories } = useClothesStore();

    const editId = route.params?.id;
    const existingOutfit = editId ? outfits.find(o => o.id === editId) : null;

    const [name, setName] = useState(existingOutfit?.name || '');
    const [notes, setNotes] = useState(existingOutfit?.notes || '');
    const [categoryId, setCategoryId] = useState(existingOutfit?.categoryId || '');
    const [selectedClothIds, setSelectedClothIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    
    // Filter state
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [colorFilter, setColorFilter] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const [seasonFilter, setSeasonFilter] = useState<string>('All-Season');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (editId) {
            const items = getOutfitItems(editId);
            setSelectedClothIds(new Set(items.map(i => i.clothId)));
        }
    }, [editId, getOutfitItems]);

    // Get unique values for filters
    const uniqueColors = useMemo(() => {
        const colors = new Set(clothes.map(c => c.color));
        return Array.from(colors).sort();
    }, [clothes]);

    const uniqueBrands = useMemo(() => {
        const brands = new Set(clothes.map(c => c.brand).filter(Boolean));
        return Array.from(brands).sort();
    }, [clothes]);

    const filteredClothes = useClothesFilter({
        clothes,
        searchQuery,
        selectedCategories,
        colorFilter,
        brandFilter,
        seasonFilter,
        sortOption,
    });

    const toggleCloth = (id: string) => {
        setSelectedClothIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        if (selectedClothIds.size === 0) {
            Alert.alert('No Items', 'Please select at least one item of clothing.');
            return;
        }

        const finalName = name.trim() || 'My Outfit';
        const finalNotes = notes.trim();

        if (existingOutfit) {
            updateOutfit(existingOutfit.id, finalName, finalNotes, Array.from(selectedClothIds), categoryId);
            navigation.goBack();
        } else {
            addOutfit(finalName, finalNotes, Array.from(selectedClothIds), categoryId);
            navigation.goBack();
        }
    };

    const handleDelete = () => {
        if (existingOutfit) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert(
                'Delete Outfit',
                'Are you sure you want to permanently delete this outfit?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            deleteOutfit(existingOutfit.id);
                            navigation.popToTop();
                        },
                    },
                ]
            );
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="close" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>{existingOutfit ? 'Edit Outfit' : 'Create Outfit'}</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={[styles.saveBtn, { color: colors.primary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Outfit Name</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="e.g. Summer Casual"
                        placeholderTextColor={colors.textSecondary}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Notes (Optional)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="e.g. Great for beach days"
                        placeholderTextColor={colors.textSecondary}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />
                </View>

                {/* Category Selector */}
                {outfitCategories.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: spacing.s }]}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.l }}>
                            <CategoryChip
                                label="None"
                                isSelected={!categoryId}
                                onPress={() => setCategoryId('')}
                            />
                            {outfitCategories.map(cat => (
                                <CategoryChip
                                    key={cat.id}
                                    label={cat.name}
                                    icon={cat.icon}
                                    isSelected={categoryId === cat.id}
                                    onPress={() => setCategoryId(cat.id)}
                                />
                            ))}
                        </ScrollView>
                    </>
                )}

                {/* Filter Toggle */}
                <TouchableOpacity
                    style={[styles.filterToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Ionicons name="filter" size={20} color={colors.textSecondary} />
                    <Text style={[styles.filterToggleText, { color: colors.text }]}>Filters & Sort</Text>
                    <Ionicons
                        name={showFilters ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>

                {/* Filter Panel */}
                {showFilters && (
                    <View style={[styles.filterPanel, { backgroundColor: colors.surface }]}>
                        {/* Category Filter */}
                        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Categories</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                            {categories.map(cat => (
                                <CategoryChip
                                    key={cat.id}
                                    label={cat.name}
                                    isSelected={selectedCategories.includes(cat.id)}
                                    onPress={() => {
                                        if (selectedCategories.includes(cat.id)) {
                                            setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                                        } else {
                                            setSelectedCategories([...selectedCategories, cat.id]);
                                        }
                                    }}
                                />
                            ))}
                        </ScrollView>

                        {/* Color Filter */}
                        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Colors</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                            {uniqueColors.map(color => (
                                <CategoryChip
                                    key={color}
                                    label={color}
                                    isSelected={colorFilter.includes(color)}
                                    onPress={() => {
                                        if (colorFilter.includes(color)) {
                                            setColorFilter(colorFilter.filter(c => c !== color));
                                        } else {
                                            setColorFilter([...colorFilter, color]);
                                        }
                                    }}
                                />
                            ))}
                        </ScrollView>

                        {/* Brand Filter */}
                        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Brands</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                            {uniqueBrands.map(brand => (
                                <CategoryChip
                                    key={brand}
                                    label={brand}
                                    isSelected={brandFilter.includes(brand)}
                                    onPress={() => {
                                        if (brandFilter.includes(brand)) {
                                            setBrandFilter(brandFilter.filter(b => b !== brand));
                                        } else {
                                            setBrandFilter([...brandFilter, brand]);
                                        }
                                    }}
                                />
                            ))}
                        </ScrollView>

                        {/* Season Filter */}
                        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Season</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                            {['All-Season', 'Summer', 'Winter'].map(season => (
                                <CategoryChip
                                    key={season}
                                    label={season}
                                    isSelected={seasonFilter === season}
                                    onPress={() => setSeasonFilter(season)}
                                />
                            ))}
                        </ScrollView>

                        {/* Sort Options */}
                        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Sort</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                            {[
                                { label: 'Name A-Z', value: 'name-asc' as SortOption },
                                { label: 'Name Z-A', value: 'name-desc' as SortOption },
                                { label: 'Newest', value: 'newest' as SortOption },
                                { label: 'Oldest', value: 'oldest' as SortOption },
                            ].map(option => (
                                <CategoryChip
                                    key={option.value}
                                    label={option.label}
                                    isSelected={sortOption === option.value}
                                    onPress={() => setSortOption(option.value)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Clothes</Text>
                    <Text style={[styles.countText, { color: colors.primary }]}>{selectedClothIds.size} selected</Text>
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
                </View>

                <View style={styles.grid}>
                    {filteredClothes.map((cloth) => {
                        const isSelected = selectedClothIds.has(cloth.id);
                        return (
                            <TouchableOpacity
                                key={cloth.id}
                                style={[
                                    styles.gridItem,
                                    isSelected && { borderColor: colors.primary, borderWidth: 3 }
                                ]}
                                onPress={() => toggleCloth(cloth.id)}
                                activeOpacity={0.8}
                            >
                                <ClothCard
                                    cloth={cloth}
                                    onPress={() => toggleCloth(cloth.id)}
                                    onToggleFavorite={() => { }}
                                    hideFavorite={true}
                                />
                                {isSelected && (
                                    <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                                        <Ionicons name="checkmark" size={16} color={colors.background} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {existingOutfit && (
                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                        <Text style={[styles.deleteText, { color: colors.error }]}>Delete Outfit</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.l,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: { ...typography.h2 },
    saveBtn: { ...typography.button, fontWeight: '600' },
    contentContainer: {
        padding: spacing.l,
        paddingBottom: 100,
    },
    inputContainer: {
        padding: spacing.m,
        borderRadius: borderRadius.m,
        borderWidth: StyleSheet.hairlineWidth,
        marginBottom: spacing.l,
    },
    label: {
        ...typography.caption,
        marginBottom: spacing.xs,
    },
    input: {
        ...typography.body,
        padding: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: spacing.m,
        marginTop: spacing.s,
    },
    sectionTitle: { ...typography.h2 },
    countText: { ...typography.chip },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    searchInput: {
        flex: 1,
        height: 44,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: borderRadius.m,
        paddingLeft: 40,
        paddingRight: spacing.m,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.m,
    },
    gridItem: {
        width: '47%',
        marginBottom: spacing.m,
        borderRadius: borderRadius.m,
        overflow: 'hidden',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
        padding: spacing.m,
    },
    deleteText: {
        ...typography.button,
        marginLeft: spacing.s,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: borderRadius.l,
        borderWidth: 1,
        marginBottom: spacing.m,
        gap: spacing.xs,
    },
    filterToggleText: {
        ...typography.body,
        fontWeight: '600',
    },
    filterPanel: {
        padding: spacing.m,
        borderRadius: borderRadius.l,
        marginBottom: spacing.m,
    },
    filterLabel: {
        ...typography.caption,
        fontWeight: '600',
        marginTop: spacing.m,
        marginBottom: spacing.s,
    },
    filterRow: {
        marginBottom: spacing.s,
    },
});
