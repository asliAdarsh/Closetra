import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTripsStore } from './store/tripsStore';
import { useTheme } from '../../theme/ThemeContext';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { EmptyState } from '../../components/EmptyState';
import { SelectionBar } from '../../components/SelectionBar';
import { FilterBottomSheet, SortBottomSheet, FilterSection, SortOption as SortOptionType } from '../../components/FilterBottomSheet';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TripsScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { history, fetchData, deleteMultiple } = useTripsStore();

    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [filterSheetVisible, setFilterSheetVisible] = useState(false);
    const [sortSheetVisible, setSortSheetVisible] = useState(false);
    const [sortOption, setSortOption] = useState<string>('newest');
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState<string>('all');

    const sortOptions: SortOptionType[] = [
      { label: 'Newest First', value: 'newest', icon: 'time-outline' },
      { label: 'Oldest First', value: 'oldest', icon: 'time-outline' },
      { label: 'Name A-Z', value: 'name-asc', icon: 'text-outline' },
      { label: 'Name Z-A', value: 'name-desc', icon: 'text-outline' },
    ];

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredHistory = useMemo(() => {
        let filtered = [...history];

        // Search filter
        if (searchText) {
            const q = searchText.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(q) ||
                item.location.toLowerCase().includes(q)
            );
        }

        // Date range filter
        const today = new Date();
        if (dateRange === 'upcoming') {
            filtered = filtered.filter(item => new Date(item.date) >= today);
        } else if (dateRange === 'past') {
            filtered = filtered.filter(item => new Date(item.date) < today);
        }

        // Sort
        switch (sortOption) {
            case 'oldest':
                filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default: // newest
                filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
        }

        return filtered;
    }, [history, searchText, dateRange, sortOption]);

    const activeFilterCount = (searchText ? 1 : 0) + (dateRange !== 'all' ? 1 : 0);

    // ─── Selection ──────────────────────────────────────────
    const handleItemPress = (id: string) => {
      if (isSelecting) { toggleSelection(id); }
      else { navigation.navigate('TripDetail', { id }); }
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
      Alert.alert('Delete Selected', `Delete ${selectedIds.size} trip(s)?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { deleteMultiple(Array.from(selectedIds)); handleCancelSelection(); } },
      ]);
    };

    // ─── Filter ─────────────────────────────────────────────
    const openFilter = () => {
      setFilterSheetVisible(true);
    };

    const handleApplyFilters = () => {
      setFilterSheetVisible(false);
    };

    const handleClearFilters = () => {
      setSearchText('');
      setDateRange('all');
    };

    const filterSections: FilterSection[] = useMemo(() => [
      {
        key: 'date',
        label: 'Date',
        icon: 'calendar-outline',
        values: ['All Trips', 'Upcoming', 'Past'],
        selectedValues: [dateRange === 'all' ? 'All Trips' : dateRange === 'upcoming' ? 'Upcoming' : 'Past'],
        onChange: (vals) => {
          const v = vals[0];
          setDateRange(v === 'All Trips' ? 'all' : v === 'Upcoming' ? 'upcoming' : 'past');
        },
        multiSelect: false,
      },
    ], [dateRange]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>My Trips</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                    placeholder="Search by name or location..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Filter + Sort row */}
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterBtn, { backgroundColor: activeFilterCount > 0 ? colors.primary : colors.surface, borderColor: activeFilterCount > 0 ? colors.primary : colors.border }]}
                onPress={openFilter}
                activeOpacity={0.7}
              >
                <Ionicons name="funnel-outline" size={16} color={activeFilterCount > 0 ? colors.background : colors.textSecondary} />
                <Text style={[styles.filterBtnText, { color: activeFilterCount > 0 ? colors.background : colors.textSecondary }]}>Filter</Text>
                {activeFilterCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.background }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>{activeFilterCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setSortSheetVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="swap-vertical-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.filterBtnText, { color: colors.textSecondary }]}>Sort</Text>
              </TouchableOpacity>
            </View>

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <View style={styles.pillsRow}>
                {searchText ? (
                  <View style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                    <Text style={[styles.pillText, { color: colors.primary }]}>Search: {searchText}</Text>
                    <TouchableOpacity onPress={() => setSearchText('')}><Ionicons name="close" size={14} color={colors.primary} /></TouchableOpacity>
                  </View>
                ) : null}
                {dateRange !== 'all' ? (
                  <View style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                    <Text style={[styles.pillText, { color: colors.primary }]}>{dateRange === 'upcoming' ? 'Upcoming' : 'Past'}</Text>
                    <TouchableOpacity onPress={() => setDateRange('all')}><Ionicons name="close" size={14} color={colors.primary} /></TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}

            <FlatList
                data={filteredHistory}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <EmptyState iconName="airplane-outline" message="No trips found" subMessage="Tap the + button to create a trip." />
                }
                renderItem={({ item }) => {
                  const isSelected = isSelecting && selectedIds.has(item.id);
                  return (
                    <TouchableOpacity
                      onPress={() => handleItemPress(item.id)}
                      onLongPress={() => handleItemLongPress(item.id)}
                      delayLongPress={400}
                      activeOpacity={0.7}
                    >
                      <View style={{ position: 'relative', opacity: isSelecting && !isSelected ? 0.6 : 1 }}>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                          <Text style={[styles.nameText, { color: colors.text }]}>{item.name}</Text>
                          <Text style={[styles.locText, { color: colors.textSecondary }]}>{item.location}</Text>
                          <Text style={[styles.dateText, { color: colors.textSecondary }]}>{item.date}</Text>
                        </View>
                        {isSelected && (
                          <View style={[styles.checkOverlay, { backgroundColor: colors.primary }]}>
                            <Ionicons name="checkmark" size={22} color={colors.background} />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
            />

            <FloatingActionButton onPress={() => navigation.navigate('AddTrip')} />

            {isSelecting && (
                <SelectionBar
                    selectedCount={selectedIds.size}
                    actions={[{ label: 'Delete', icon: 'trash', onPress: handleDeleteSelected, destructive: true }]}
                    onCancel={handleCancelSelection}
                />
            )}

            <FilterBottomSheet
              visible={filterSheetVisible}
              onClose={() => setFilterSheetVisible(false)}
              sections={filterSections}
              onClearAll={handleClearFilters}
              onApply={handleApplyFilters}
            />

            <SortBottomSheet
              visible={sortSheetVisible}
              onClose={() => setSortSheetVisible(false)}
              options={sortOptions}
              selectedOption={sortOption}
              onSelect={(val) => { setSortOption(val); setSortSheetVisible(false); }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: spacing.l, paddingTop: spacing.xl, paddingBottom: spacing.m,
    },
    title: { ...typography.h1 },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: spacing.l, marginBottom: spacing.s,
    },
    searchIcon: { position: 'absolute', left: spacing.xl + 10, zIndex: 1 },
    searchInput: {
        flex: 1, height: 44, borderWidth: StyleSheet.hairlineWidth, borderRadius: borderRadius.l,
        paddingLeft: 40, paddingRight: spacing.m, ...typography.body,
    },
    filterRow: {
      paddingHorizontal: spacing.l, marginBottom: spacing.s,
      flexDirection: 'row', gap: spacing.s,
    },
    filterBtn: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.m, paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.l, borderWidth: StyleSheet.hairlineWidth,
      gap: spacing.xxs + 1,
    },
    filterBtnText: { ...typography.caption, fontWeight: '600' },
    badge: { minWidth: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    badgeText: { ...typography.small, fontSize: 9, fontWeight: 'bold' },
    pillsRow: { paddingHorizontal: spacing.l, marginBottom: spacing.s, flexDirection: 'row', gap: spacing.s },
    pill: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.s, paddingVertical: spacing.xxs,
      borderRadius: borderRadius.round, borderWidth: StyleSheet.hairlineWidth,
      gap: spacing.xs, alignSelf: 'flex-start',
    },
    pillText: { ...typography.small, fontWeight: '600' },
    list: { paddingHorizontal: spacing.l, paddingBottom: 100 },
    card: {
        padding: spacing.m, borderWidth: StyleSheet.hairlineWidth,
        borderRadius: borderRadius.m, marginBottom: spacing.m,
    },
    nameText: { ...typography.h3, marginBottom: 4 },
    locText: { ...typography.body, marginBottom: 4 },
    dateText: { ...typography.caption },
    checkOverlay: {
        position: 'absolute', top: 8, right: 8,
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center', zIndex: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15, shadowRadius: 3, elevation: 3,
    },
});
