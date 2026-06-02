import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, LayoutAnimation, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClothesStore } from './store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { CategoryChip } from '../../components/CategoryChip';
import { ClothCard } from '../../components/ClothCard';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { EmptyState } from '../../components/EmptyState';
import { SelectionBar } from '../../components/SelectionBar';
import { FilterBottomSheet, SortBottomSheet, FilterSection, SortOption as SortOptionType } from '../../components/FilterBottomSheet';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useClothesFilter, SortOption } from '../../hooks/useClothesFilter';

type ClothesStackParamList = {
    ClothesList: undefined;
    AddCloth: undefined;
    CategoryManager: undefined;
    EditCloth: { id: string };
};

type NavigationProp = StackNavigationProp<ClothesStackParamList, 'ClothesList'>;

const SORT_OPTIONS: SortOptionType[] = [
  { label: 'Newest First', value: 'newest', icon: 'time-outline' },
  { label: 'Oldest First', value: 'oldest', icon: 'time-outline' },
  { label: 'Name A-Z', value: 'name-asc', icon: 'text-outline' },
  { label: 'Name Z-A', value: 'name-desc', icon: 'text-outline' },
];

export default function ClothesScreen() {
    const { colors, gridColumns } = useTheme();
    const navigation = useNavigation<NavigationProp>();

    const {
        clothes, categories, searchQuery, seasonFilter, selectedCategoryId,
        fetchData, setSearchQuery, setSelectedCategory, setShowFavoritesOnly, showFavoritesOnly,
        updateCloth, deleteMultiple, moveToCategory,
        colorFilter, setColorFilter, brandFilter, setBrandFilter, selectedCategories, setSelectedCategories,
        setSeasonFilter, clearFilters
    } = useClothesStore();

    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [filterSheetVisible, setFilterSheetVisible] = useState(false);
    const [sortSheetVisible, setSortSheetVisible] = useState(false);
    const [initialFilterSection, setInitialFilterSection] = useState<string | undefined>(undefined);

    // Local filter state (applied when user taps "Apply")
    const [localCategories, setLocalCategories] = useState<string[]>([]);
    const [localColors, setLocalColors] = useState<string[]>([]);
    const [localBrands, setLocalBrands] = useState<string[]>([]);
    const [localSeason, setLocalSeason] = useState<string>('All-Season');

    const openFilter = (section?: string) => {
      setLocalCategories(selectedCategories);
      setLocalColors(colorFilter);
      setLocalBrands(brandFilter);
      setLocalSeason(seasonFilter);
      setInitialFilterSection(section);
      setFilterSheetVisible(true);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
        showFavoritesOnly,
        sortOption,
    });

    // ─── Selection handlers ─────────────────────────────────
    const handleItemPress = (id: string) => {
      if (isSelecting) {
        toggleSelection(id);
      } else {
        navigation.navigate('EditCloth', { id });
      }
    };

    const handleItemLongPress = (id: string) => {
      if (!isSelecting) {
        setIsSelecting(true);
        setSelectedIds(new Set([id]));
      }
    };

    const toggleSelection = (id: string) => {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        if (next.size === 0) setIsSelecting(false);
        return next;
      });
    };

    const handleCancelSelection = () => {
        setIsSelecting(false);
        setSelectedIds(new Set());
    };

    const handleDeleteSelected = () => {
        Alert.alert('Delete Selected', `Delete ${selectedIds.size} item(s)? This cannot be undone.`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => { deleteMultiple(Array.from(selectedIds)); handleCancelSelection(); } },
        ]);
    };

    const handleMoveToCategory = () => setShowCategoryModal(true);

    const handleCategorySelect = (catId: string) => {
        moveToCategory(Array.from(selectedIds), catId);
        setShowCategoryModal(false);
        handleCancelSelection();
    };

    // ─── Filter handlers ────────────────────────────────────
    const handleApplyFilters = () => {
      setSelectedCategories(localCategories);
      setColorFilter(localColors);
      setBrandFilter(localBrands);
      setSeasonFilter(localSeason);
      setFilterSheetVisible(false);
    };

    const handleClearFilters = () => {
      setLocalCategories([]);
      setLocalColors([]);
      setLocalBrands([]);
      setLocalSeason('All-Season');
      setSelectedCategories([]);
      setColorFilter([]);
      setBrandFilter([]);
      setSeasonFilter('All-Season');
      setFilterSheetVisible(false);
    };

    const activeFilterCount = useMemo(() => {
      let count = 0;
      if (selectedCategories.length > 0) count++;
      if (colorFilter.length > 0) count++;
      if (brandFilter.length > 0) count++;
      if (seasonFilter !== 'All-Season') count++;
      return count;
    }, [selectedCategories, colorFilter, brandFilter, seasonFilter]);

    // ─── Filter sections (NO favorites section) ────────────
    const filterSections: FilterSection[] = useMemo(() => [
      {
        key: 'category',
        label: 'Category',
        icon: 'grid-outline',
        values: categories.map(c => c.name),
        selectedValues: localCategories.map(id => categories.find(c => c.id === id)?.name || '').filter(Boolean),
        onChange: (names) => {
          const ids = names.map(n => categories.find(c => c.name === n)?.id).filter(Boolean) as string[];
          setLocalCategories(ids);
        },
      },
      {
        key: 'color',
        label: 'Color',
        icon: 'color-palette-outline',
        values: uniqueColors,
        selectedValues: localColors,
        onChange: setLocalColors,
      },
      {
        key: 'brand',
        label: 'Brand',
        icon: 'pricetag-outline',
        values: uniqueBrands,
        selectedValues: localBrands,
        onChange: setLocalBrands,
      },
      {
        key: 'season',
        label: 'Season',
        icon: 'sunny-outline',
        values: ['All-Season', 'Summer', 'Winter'],
        selectedValues: [localSeason],
        onChange: (vals) => setLocalSeason(vals[0] || 'All-Season'),
        multiSelect: false,
      },
    ], [categories, uniqueColors, uniqueBrands, localCategories, localColors, localBrands, localSeason]);

    // ─── Render ────────────────────────────────────────────
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>My Closet</Text>
                <Ionicons name="settings-outline" size={24} color={colors.text} onPress={() => navigation.navigate('CategoryManager')} />
            </View>

            {/* Search */}
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

            {/* Quick-access buttons: Filter | Sort | Category | Color | Brand */}
            <View style={styles.filterRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRowContent}>
                {/* Filter button first */}
                <TouchableOpacity
                  style={[styles.quickFilterBtn, styles.quickFilterPrimary, { backgroundColor: activeFilterCount > 0 ? colors.primary : colors.surface, borderColor: activeFilterCount > 0 ? colors.primary : colors.border }]}
                  onPress={() => openFilter()}
                  activeOpacity={0.7}
                >
                  <Ionicons name="funnel-outline" size={16} color={activeFilterCount > 0 ? colors.background : colors.textSecondary} />
                  <Text style={[styles.quickFilterText, { color: activeFilterCount > 0 ? colors.background : colors.textSecondary }]}>Filter</Text>
                  {activeFilterCount > 0 && (
                    <View style={[styles.quickFilterBadge, { backgroundColor: colors.background }]}>
                      <Text style={[styles.quickFilterBadgeText, { color: colors.primary }]}>{activeFilterCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Sort button second */}
                <TouchableOpacity
                  style={[styles.quickFilterBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setSortSheetVisible(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="swap-vertical-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.quickFilterText, { color: colors.textSecondary }]}>Sort</Text>
                </TouchableOpacity>

                {/* Quick access: Category */}
                <TouchableOpacity
                  style={[styles.quickFilterBtn, { backgroundColor: selectedCategories.length > 0 ? colors.primary + '15' : colors.surface, borderColor: selectedCategories.length > 0 ? colors.primary : colors.border }]}
                  onPress={() => openFilter('category')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="grid-outline" size={16} color={selectedCategories.length > 0 ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.quickFilterText, { color: selectedCategories.length > 0 ? colors.primary : colors.textSecondary }]}>Category</Text>
                </TouchableOpacity>

                {/* Quick access: Color */}
                <TouchableOpacity
                  style={[styles.quickFilterBtn, { backgroundColor: colorFilter.length > 0 ? colors.primary + '15' : colors.surface, borderColor: colorFilter.length > 0 ? colors.primary : colors.border }]}
                  onPress={() => openFilter('color')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="color-palette-outline" size={16} color={colorFilter.length > 0 ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.quickFilterText, { color: colorFilter.length > 0 ? colors.primary : colors.textSecondary }]}>Color</Text>
                </TouchableOpacity>

                {/* Quick access: Brand */}
                <TouchableOpacity
                  style={[styles.quickFilterBtn, { backgroundColor: brandFilter.length > 0 ? colors.primary + '15' : colors.surface, borderColor: brandFilter.length > 0 ? colors.primary : colors.border }]}
                  onPress={() => openFilter('brand')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pricetag-outline" size={16} color={brandFilter.length > 0 ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.quickFilterText, { color: brandFilter.length > 0 ? colors.primary : colors.textSecondary }]}>Brand</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <View style={styles.pillsRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
                  {selectedCategories.length > 0 && (
                    <View style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                      <Text style={[styles.pillText, { color: colors.primary }]}>Category</Text>
                      <TouchableOpacity onPress={() => setSelectedCategories([])}><Ionicons name="close" size={14} color={colors.primary} /></TouchableOpacity>
                    </View>
                  )}
                  {colorFilter.length > 0 && (
                    <View style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                      <Text style={[styles.pillText, { color: colors.primary }]}>Color: {colorFilter.length}</Text>
                      <TouchableOpacity onPress={() => setColorFilter([])}><Ionicons name="close" size={14} color={colors.primary} /></TouchableOpacity>
                    </View>
                  )}
                  {brandFilter.length > 0 && (
                    <View style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                      <Text style={[styles.pillText, { color: colors.primary }]}>Brand: {brandFilter.length}</Text>
                      <TouchableOpacity onPress={() => setBrandFilter([])}><Ionicons name="close" size={14} color={colors.primary} /></TouchableOpacity>
                    </View>
                  )}
                  {seasonFilter !== 'All-Season' && (
                    <View style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                      <Text style={[styles.pillText, { color: colors.primary }]}>Season: {seasonFilter}</Text>
                      <TouchableOpacity onPress={() => setSeasonFilter('All-Season')}><Ionicons name="close" size={14} color={colors.primary} /></TouchableOpacity>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            {/* Clothes Grid — NO outer TouchableOpacity wrapper, pass handlers to ClothCard directly */}
            <FlatList
                key={`grid-${gridColumns}`}
                data={filteredClothes}
                keyExtractor={item => item.id}
                numColumns={gridColumns}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={gridColumns > 1 ? styles.row : undefined}
                ListEmptyComponent={
                    <EmptyState iconName="shirt-outline" message="No clothes found" subMessage="Tap the + button to add some items." />
                }
                renderItem={({ item }) => {
                  const isSelected = isSelecting && selectedIds.has(item.id);
                  return (
                    <View style={gridColumns > 1 ? { flex: 1, maxWidth: `${100 / gridColumns}%` } : { marginBottom: spacing.m }}>
                      <View style={{ position: 'relative', opacity: isSelecting && !isSelected ? 0.6 : 1 }}>
                        <ClothCard
                          cloth={item}
                          onPress={() => handleItemPress(item.id)}
                          onLongPress={() => handleItemLongPress(item.id)}
                          onToggleFavorite={(id, isFav) => {
                            if (!isSelecting) {
                              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                              updateCloth(id, { isFavorite: isFav ? 1 : 0 });
                            }
                          }}
                        />
                        {isSelected && (
                          <View style={[styles.checkOverlay, { backgroundColor: colors.primary }]}>
                            <Ionicons name="checkmark" size={24} color={colors.background} />
                          </View>
                        )}
                      </View>
                    </View>
                  );
                }}
            />

            <FloatingActionButton onPress={() => navigation.navigate('AddCloth')} />

            {isSelecting && (
                <SelectionBar
                    selectedCount={selectedIds.size}
                    actions={[
                        { label: 'Delete', icon: 'trash', onPress: handleDeleteSelected, destructive: true },
                        { label: 'Move', icon: 'folder', onPress: handleMoveToCategory },
                    ]}
                    onCancel={handleCancelSelection}
                />
            )}

            {/* Filter Bottom Sheet */}
            <FilterBottomSheet
              visible={filterSheetVisible}
              onClose={() => setFilterSheetVisible(false)}
              sections={filterSections}
              onClearAll={handleClearFilters}
              onApply={handleApplyFilters}
              initialSection={initialFilterSection}
            />

            {/* Sort Bottom Sheet */}
            <SortBottomSheet
              visible={sortSheetVisible}
              onClose={() => setSortSheetVisible(false)}
              options={SORT_OPTIONS}
              selectedOption={sortOption}
              onSelect={(val) => setSortOption(val as SortOption)}
            />

            {/* Category Move Modal */}
            <Modal visible={showCategoryModal} transparent animationType="fade" onRequestClose={() => setShowCategoryModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryModal(false)}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Move to Category</Text>
                        <ScrollView style={styles.modalScroll}>
                            {categories.map(category => (
                                <TouchableOpacity key={category.id} style={[styles.modalItem, { borderBottomColor: colors.border }]} onPress={() => handleCategorySelect(category.id)}>
                                    <Text style={[styles.modalItemText, { color: colors.text }]}>{category.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: spacing.l, paddingTop: spacing.xl, paddingBottom: spacing.s,
    },
    title: { ...typography.h1 },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: spacing.l, marginBottom: spacing.s,
    },
    searchIcon: { position: 'absolute', left: spacing.xl + 10, zIndex: 1 },
    searchInput: {
        flex: 1, height: 44, borderWidth: StyleSheet.hairlineWidth, borderRadius: borderRadius.l,
        paddingLeft: 40, paddingRight: spacing.m, marginRight: spacing.m, ...typography.body,
    },
    // ─── Filter row ────────────────────────────────────────
    filterRow: { marginBottom: spacing.s },
    filterRowContent: { paddingHorizontal: spacing.l, gap: spacing.s },
    quickFilterBtn: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.m, paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.l, borderWidth: StyleSheet.hairlineWidth,
      marginRight: spacing.xs, gap: spacing.xxs + 1,
    },
    quickFilterPrimary: {
      // primary styling handled inline
    },
    quickFilterText: { ...typography.caption, fontWeight: '600' },
    quickFilterBadge: {
      minWidth: 16, height: 16, borderRadius: 8,
      justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
    },
    quickFilterBadgeText: { ...typography.small, fontSize: 9, fontWeight: 'bold' },
    // ─── Active filter pills ───────────────────────────────
    pillsRow: { marginBottom: spacing.s },
    pillsContainer: { paddingHorizontal: spacing.l, gap: spacing.xs },
    pill: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.s, paddingVertical: spacing.xxs,
      borderRadius: borderRadius.round, borderWidth: StyleSheet.hairlineWidth,
      gap: spacing.xs, marginRight: spacing.xs, alignSelf: 'flex-start',
    },
    pillText: { ...typography.small, fontWeight: '600' },
    // ─── Grid ─────────────────────────────────────────────
    grid: { paddingHorizontal: spacing.l, paddingBottom: 100 },
    row: { gap: spacing.m, marginBottom: spacing.m },
    checkOverlay: {
        position: 'absolute', top: 8, right: 8,
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center', zIndex: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15, shadowRadius: 3, elevation: 3,
    },
    // ─── Modal ─────────────────────────────────────────────
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', maxHeight: '70%', borderRadius: borderRadius.xl, padding: spacing.l },
    modalTitle: { ...typography.h3, marginBottom: spacing.m, textAlign: 'center' },
    modalScroll: { maxHeight: 300 },
    modalItem: { paddingVertical: spacing.m, borderBottomWidth: StyleSheet.hairlineWidth },
    modalItemText: { ...typography.body },
});
