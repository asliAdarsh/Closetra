import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTripsStore } from './store/tripsStore';
import { useLaundryStore } from '../laundry/store/laundryStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ClothCard } from '../../components/ClothCard';
import { CategoryChip } from '../../components/CategoryChip';
import { useClothesFilter, SortOption } from '../../hooks/useClothesFilter';

export default function AddTripScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { addTrip } = useTripsStore();
    const { clothesInLaundry } = useLaundryStore();
    const { clothes, categories } = useClothesStore();

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClothIds, setSelectedClothIds] = useState<string[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    
    // Filter state
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [colorFilter, setColorFilter] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const [seasonFilter, setSeasonFilter] = useState<string>('All-Season');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [showFilters, setShowFilters] = useState(false);

    // Get unique values for filters
    const uniqueColors = useMemo(() => {
        const colors = new Set(clothes.map(c => c.color));
        return Array.from(colors).sort();
    }, [clothes]);

    const uniqueBrands = useMemo(() => {
        const brands = new Set(clothes.map(c => c.brand).filter(Boolean));
        return Array.from(brands).sort();
    }, [clothes]);

    const availableClothes = useClothesFilter({
        clothes: clothes.filter(c => !clothesInLaundry.includes(c.id)),
        searchQuery,
        selectedCategories,
        colorFilter,
        brandFilter,
        seasonFilter,
        sortOption,
    });

    const toggleSelection = (id: string) => {
        setSelectedClothIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        if (!name.trim() || !location.trim()) {
            Alert.alert("Missing Info", "Please provide a name and location.");
            return;
        }
        if (selectedClothIds.length === 0) {
            Alert.alert("No Items", "Please pack at least one cloth.");
            return;
        }
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        addTrip(name, location, date, time, day, notes, selectedClothIds);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="close" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>Plan Trip</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={[styles.saveBtn, { color: colors.primary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Trip Name</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Summer Vacation"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Location</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="e.g. Hawaii"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <Text style={[styles.input, { color: date ? colors.text : colors.textSecondary }]}>
                            {date || "YYYY-MM-DD"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showPicker && (
                    <DateTimePicker
                        value={new Date(date || Date.now())}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowPicker(false);
                            if (selectedDate) {
                                setDate(selectedDate.toISOString().split('T')[0]);
                            }
                        }}
                    />
                )}

                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Notes (Optional)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="e.g. Don't forget chargers"
                        placeholderTextColor={colors.textSecondary}
                        multiline
                    />
                </View>

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
                    <Text style={[styles.countText, { color: colors.primary }]}>{selectedClothIds.length} selected</Text>
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
                    {availableClothes.map((item) => {
                        const isSelected = selectedClothIds.includes(item.id);
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.gridItem,
                                    isSelected && { borderColor: colors.primary, borderWidth: 3 }
                                ]}
                                onPress={() => toggleSelection(item.id)}
                                activeOpacity={0.8}
                            >
                                <ClothCard
                                    cloth={item}
                                    onPress={() => toggleSelection(item.id)}
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
