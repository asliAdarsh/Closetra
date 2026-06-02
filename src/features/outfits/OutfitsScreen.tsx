import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, LayoutAnimation, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOutfitsStore } from './store/outfitsStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { EmptyState } from '../../components/EmptyState';
import { OutfitCard } from '../../components/OutfitCard';
import { SelectionBar } from '../../components/SelectionBar';
import { FilterBottomSheet, SortBottomSheet, FilterSection, SortOption as SortOptionType } from '../../components/FilterBottomSheet';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';

const SORT_OPTIONS: SortOptionType[] = [
  { label: 'Newest First', value: 'newest', icon: 'time-outline' },
  { label: 'Oldest First', value: 'oldest', icon: 'time-outline' },
  { label: 'Name A-Z', value: 'name-asc', icon: 'text-outline' },
  { label: 'Name Z-A', value: 'name-desc', icon: 'text-outline' },
];

export default function OutfitsScreen() {
    const { colors, gridColumns } = useTheme();
    const navigation = useNavigation<any>();
    const {
        outfits, outfitCategories, searchQuery, showFavoritesOnly,
        fetchData, toggleFavorite, getOutfitItems, setSearchQuery, setShowFavoritesOnly,
        deleteMultiple, moveToCategory, selectedCategories, setSelectedCategories, clearFilters
    } = useOutfitsStore();
    const { clothes } = useClothesStore();

    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [filterSheetVisible, setFilterSheetVisible] = useState(false);
    const [sortSheetVisible, setSortSheetVisible] = useState(false);
    const [sortOption, setSortOption] = useState<string>('newest');
    const [initialFilterSection, setInitialFilterSection] = useState<string | undefined>(undefined);

    // Local filter state
    const [localCategories, setLocalCategories] = useState<string[]>([]);
    const [localFavorites, setLocalFavorites] = useState(false);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredOutfits = useMemo(() => {
        let filtered = outfits.filter(o => {
            if (selectedCategories.length > 0 && !selectedCategories.includes(o.categoryId)) return false;
            if (showFavoritesOnly && !o.isFavorite) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!o.name.toLowerCase().includes(q) && !(o.notes || '').toLowerCase().includes(q)) return false;
            }
            return true;
        });
        switch (sortOption) {
          case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
          case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
          case 'oldest': filtered.sort((a, b) => a.id.localeCompare(b.id)); break;
          default: filtered.sort((a, b) => b.id.localeCompare(a.id)); break;
        }
        return filtered;
    }, [outfits, selectedCategories, showFavoritesOnly, searchQuery, sortOption]);

    const activeFilterCount = useMemo(() => {
      let c = 0;
      if (selectedCategories.length > 0) c++;
      if (showFavoritesOnly) c++;
      return c;
    }, [selectedCategories, showFavoritesOnly]);

    // ─── Selection ──────────────────────────────────────────
    const handleItemPress = (id: string) => {
      if (isSelecting) { toggleSelection(id); }
      else { navigation.navigate('OutfitDetail', { id }); }
    };

    const handleItemLongPress = (id: string) => {
      if (!isSelecting) { setIsSelecting(true); setSelectedIds(new Set([id])); }
    };

    const toggleSelection = (id: string) => {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        if (next.size === 0) setIsSelecting(false);
        return next;
      });
    };

    const handleCancelSelection = () => { setIsSelecting(false); setSelectedIds(new Set()); };

    const handleDeleteSelected = () => {
      Alert.alert('Delete Selected', `Delete ${selectedIds.size} outfit(s)?`, [
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

    // ─── Filter ─────────────────────────────────────────────
    const openFilter = (section?: string) => {
      setLocalCategories(selectedCategories);
      setInitialFilterSection(section);
      setFilterSheetVisible(true);
    };

    const handleApplyFilters = () => {
      setSelectedCategories(localCategories);
      setFilterSheetVisible(false);
    };

    const handleClearFilters = () => {
      setLocalCategories([]);
      setSelectedCategories([]);
      setFilterSheetVisible(false);
    };

    const filterSections: FilterSection[] = useMemo(() => [
      {
        key: 'category',
        label: 'Category',
        icon: 'grid-outline',
        values: outfitCategories.map(c => c.name),
        selectedValues: localCategories.map(id => outfitCategories.find(c => c.id === id)?.name || '').filter(Boolean),
        onChange: (names) => {
          const ids = names.map(n => outfitCategories.find(c => c.name === n)?.id).filter(Boolean) as string[];
          setLocalCategories(ids);
        },
      },
    ], [outfitCategories, localCategories]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Outfits</Text>
                <Ionicons name="settings-outline" size={24} color={colors.text} onPress={() => navigation.navigate('OutfitCategoryManager')} />
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

            {/* Quick filter + sort row: Filter | Sort | Category */}
            <View style={styles.filterRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRowContent}>
                <TouchableOpacity
                  style={[styles.quickFilterBtn, { backgroundColor: activeFilterCount > 0 ? colors.primary : colors.surface, borderColor: activeFilterCount > 0 ? colors.primary : colors.border }]}
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

                <TouchableOpacity
                  style={[styles.quickFilterBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setSortSheetVisible(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="swap-vertical-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.quickFilterText, { color: colors.textSecondary }]}>Sort</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickFilterBtn, { backgroundColor: selectedCategories.length > 0 ? colors.primary + '15' : colors.surface, borderColor: selectedCategories.length > 0 ? colors.primary : colors.border }]}
                  onPress={() => openFilter('category')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="grid-outline" size={16} color={selectedCategories.length > 0 ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.quickFilterText, { color: selectedCategories.length > 0 ? colors.primary : colors.textSecondary }]}>Category</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <View style={styles.pillsRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
                  {selectedCategories.length > 0 && (
                    <View style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                      <Text style={[styles.pillText, { color: colors.primary }]}>Category: {selectedCategories.length}</Text>
                      <TouchableOpacity onPress={() => setSelectedCategories([])}><Ionicons name="close" size={14} color={colors.primary} /></TouchableOpacity>
                    </View>
                  )}
                  {showFavoritesOnly && (
                    <View style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                      <Text style={[styles.pillText, { color: colors.primary }]}>Favorites</Text>
                      <TouchableOpacity onPress={() => setShowFavoritesOnly(false)}><Ionicons name="close" size={14} color={colors.primary} /></TouchableOpacity>
                    </View>
                  )}
                </ScrollView>
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
                    <EmptyState iconName="body-outline" message="No outfits found" subMessage="Try adjusting your filters or create a new outfit." />
                }
                renderItem={({ item }) => {
                    const outfitItems = getOutfitItems(item.id);
                    const outfitClothes = outfitItems.map(i => clothes.find(c => c.id === i.clothId)).filter(Boolean) as any[];
                    const isSelected = isSelecting && selectedIds.has(item.id);
                    return (
                      <View style={gridColumns > 1 ? { flex: 1, maxWidth: `${100 / gridColumns}%` } : { marginBottom: spacing.m }}>
                        <View style={{ position: 'relative', opacity: isSelecting && !isSelected ? 0.6 : 1 }}>
                          <OutfitCard
                            outfit={item}
                            items={outfitClothes}
                            onPress={() => handleItemPress(item.id)}
                            onLongPress={() => handleItemLongPress(item.id)}
                            onToggleFavorite={(id, isFav) => {
                              if (!isSelecting) {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                toggleFavorite(id, isFav);
                              }
                            }}
                          />
                          {isSelected && (
                            <View style={[styles.checkOverlay, { backgroundColor: colors.primary }]}>
                              <Ionicons name="checkmark" size={22} color={colors.background} />
                            </View>
                          )}
                        </View>
                      </View>
                    );
                }}
            />

            <FloatingActionButton onPress={() => navigation.navigate('AddOutfit')} />

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

            <FilterBottomSheet
              visible={filterSheetVisible}
              onClose={() => setFilterSheetVisible(false)}
              sections={filterSections}
              onClearAll={handleClearFilters}
              onApply={handleApplyFilters}
              initialSection={initialFilterSection}
            />

            <SortBottomSheet
              visible={sortSheetVisible}
              onClose={() => setSortSheetVisible(false)}
              options={SORT_OPTIONS}
              selectedOption={sortOption}
              onSelect={setSortOption}
            />

            <Modal visible={showCategoryModal} transparent animationType="fade" onRequestClose={() => setShowCategoryModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryModal(false)}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Move to Category</Text>
                        <ScrollView style={styles.modalScroll}>
                            {outfitCategories.map(cat => (
                                <TouchableOpacity key={cat.id} style={[styles.modalItem, { borderBottomColor: colors.border }]} onPress={() => handleCategorySelect(cat.id)}>
                                    <Text style={[styles.modalItemText, { color: colors.text }]}>{cat.name}</Text>
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
    // ─── Filter ─────────────────────────────────────────────
    filterRow: { marginBottom: spacing.s },
    filterRowContent: { paddingHorizontal: spacing.l, gap: spacing.s },
    quickFilterBtn: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.m, paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.l, borderWidth: StyleSheet.hairlineWidth,
      marginRight: spacing.xs, gap: spacing.xxs + 1,
    },
    quickFilterText: { ...typography.caption, fontWeight: '600' },
    quickFilterBadge: {
      minWidth: 16, height: 16, borderRadius: 8,
      justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
    },
    quickFilterBadgeText: { ...typography.small, fontSize: 9, fontWeight: 'bold' },
    pillsRow: { marginBottom: spacing.s },
    pillsContainer: { paddingHorizontal: spacing.l, gap: spacing.xs },
    pill: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.s, paddingVertical: spacing.xxs,
      borderRadius: borderRadius.round, borderWidth: StyleSheet.hairlineWidth,
      gap: spacing.xs, marginRight: spacing.xs,
    },
    pillText: { ...typography.small, fontWeight: '600' },
    // ─── Grid ───────────────────────────────────────────────
    grid: { paddingHorizontal: spacing.l, paddingBottom: 100 },
    row: { gap: spacing.m, marginBottom: spacing.m },
    checkOverlay: {
        position: 'absolute', top: 8, right: 8,
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center', zIndex: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15, shadowRadius: 3, elevation: 3,
    },
    // ─── Modal ──────────────────────────────────────────────
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', maxHeight: '70%', borderRadius: borderRadius.xl, padding: spacing.l },
    modalTitle: { ...typography.h3, marginBottom: spacing.m, textAlign: 'center' },
    modalScroll: { maxHeight: 300 },
    modalItem: { paddingVertical: spacing.m, borderBottomWidth: StyleSheet.hairlineWidth },
    modalItemText: { ...typography.body },
});
