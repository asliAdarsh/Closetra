import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLaundryStore } from './store/laundryStore';
import { useTheme } from '../../theme/ThemeContext';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { EmptyState } from '../../components/EmptyState';
import { SelectionBar } from '../../components/SelectionBar';
import { FilterBottomSheet, SortBottomSheet, FilterSection, SortOption as SortOptionType } from '../../components/FilterBottomSheet';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function LaundryScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { history, fetchData, deleteMultiple, markMultipleReturned, statusFilter, setStatusFilter, clearFilters } = useLaundryStore();

    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [filterSheetVisible, setFilterSheetVisible] = useState(false);
    const [sortSheetVisible, setSortSheetVisible] = useState(false);
    const [sortOption, setSortOption] = useState<string>('newest');
    const [localStatus, setLocalStatus] = useState('All');

    const sortOptions: SortOptionType[] = [
      { label: 'Newest First', value: 'newest', icon: 'time-outline' },
      { label: 'Oldest First', value: 'oldest', icon: 'time-outline' },
      { label: 'Date A-Z', value: 'date-asc', icon: 'calendar-outline' },
      { label: 'Date Z-A', value: 'date-desc', icon: 'calendar-outline' },
    ];

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredHistory = useMemo(() => {
        let filtered = statusFilter === 'All' ? history : history.filter(item => item.status === statusFilter);
        switch (sortOption) {
          case 'oldest': filtered = [...filtered].reverse(); break;
          case 'date-asc': filtered = [...filtered].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)); break;
          case 'date-desc': filtered = [...filtered].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time)); break;
          default: break; // newest is default order from DB
        }
        return filtered;
    }, [history, statusFilter, sortOption]);

    const activeFilterCount = statusFilter !== 'All' ? 1 : 0;

    // ─── Selection handlers ─────────────────────────────────
    const handleItemPress = (id: string) => {
      if (isSelecting) {
        toggleSelection(id);
      } else {
        navigation.navigate('LaundryDetail', { id });
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
      Alert.alert('Delete Selected', `Delete ${selectedIds.size} item(s)?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { deleteMultiple(Array.from(selectedIds)); handleCancelSelection(); } },
      ]);
    };

    const handleMarkReturned = () => {
      markMultipleReturned(Array.from(selectedIds));
      handleCancelSelection();
    };

    // ─── Filter handlers ────────────────────────────────────
    const openFilter = () => {
      setLocalStatus(statusFilter);
      setFilterSheetVisible(true);
    };

    const handleApplyFilters = () => {
      setStatusFilter(localStatus);
      setFilterSheetVisible(false);
    };

    const handleClearFilters = () => {
      setLocalStatus('All');
      setStatusFilter('All');
      setFilterSheetVisible(false);
    };

    const filterSections: FilterSection[] = useMemo(() => [
      {
        key: 'status',
        label: 'Status',
        icon: 'water-outline',
        values: ['All', 'Given', 'Returned'],
        selectedValues: [localStatus],
        onChange: (vals) => setLocalStatus(vals[0] || 'All'),
        multiSelect: false,
      },
    ], [localStatus]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Laundry</Text>
            </View>

            {/* Quick filter + sort row */}
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

            {/* Active filter pill */}
            {statusFilter !== 'All' && (
              <View style={styles.pillsRow}>
                <View style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                  <Text style={[styles.pillText, { color: colors.primary }]}>Status: {statusFilter}</Text>
                  <TouchableOpacity onPress={() => setStatusFilter('All')}><Ionicons name="close" size={14} color={colors.primary} /></TouchableOpacity>
                </View>
              </View>
            )}

            <FlatList
                data={filteredHistory}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <EmptyState iconName="water-outline" message="No laundry history" subMessage="Tap the + button to add clothes to laundry." />
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
                          <View style={styles.cardTextContainer}>
                            <Text style={[styles.dateText, { color: colors.text }]}>{item.date} • {item.day}</Text>
                            {!!item.note && <Text style={[styles.noteText, { color: colors.textSecondary }]} numberOfLines={1}>{item.note}</Text>}
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Returned' ? colors.success : colors.warning }]}>
                            <Text style={[styles.statusText, { color: colors.background }]}>{item.status}</Text>
                          </View>
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

            <FloatingActionButton onPress={() => navigation.navigate('AddLaundry')} />

            {isSelecting && (
                <SelectionBar
                    selectedCount={selectedIds.size}
                    actions={[
                        { label: 'Delete', icon: 'trash', onPress: handleDeleteSelected, destructive: true },
                        { label: 'Returned', icon: 'return-up-back', onPress: handleMarkReturned },
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
        paddingHorizontal: spacing.l,
        paddingTop: spacing.xl,
        paddingBottom: spacing.m,
    },
    title: { ...typography.h1 },
    // ─── Filter ─────────────────────────────────────────────
    filterRow: {
      paddingHorizontal: spacing.l,
      marginBottom: spacing.s,
      flexDirection: 'row',
      gap: spacing.s,
    },
    filterBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.l,
      borderWidth: StyleSheet.hairlineWidth,
      gap: spacing.xxs + 1,
    },
    filterBtnText: { ...typography.caption, fontWeight: '600' },
    badge: {
      minWidth: 16, height: 16, borderRadius: 8,
      justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
    },
    badgeText: { ...typography.small, fontSize: 9, fontWeight: 'bold' },
    pillsRow: { paddingHorizontal: spacing.l, marginBottom: spacing.s },
    pill: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.s, paddingVertical: spacing.xxs,
      borderRadius: borderRadius.round, borderWidth: StyleSheet.hairlineWidth,
      gap: spacing.xs, alignSelf: 'flex-start',
    },
    pillText: { ...typography.small, fontWeight: '600' },
    // ─── List ───────────────────────────────────────────────
    list: { paddingHorizontal: spacing.l, paddingBottom: 100 },
    card: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: spacing.m, borderWidth: StyleSheet.hairlineWidth,
        borderRadius: borderRadius.xl, marginBottom: spacing.m,
    },
    cardTextContainer: { flex: 1, flexShrink: 1, marginRight: spacing.m },
    dateText: { ...typography.body, fontWeight: 'bold', marginBottom: 4 },
    noteText: { ...typography.caption },
    statusBadge: { paddingHorizontal: spacing.s, paddingVertical: 4, borderRadius: borderRadius.s },
    statusText: { ...typography.caption, fontWeight: 'bold' },
    checkOverlay: {
        position: 'absolute', top: 8, right: 8,
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center', zIndex: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15, shadowRadius: 3, elevation: 3,
    },
});
