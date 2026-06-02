import React, { useState, useMemo } from 'react';
import {
  View, Text, Modal, TouchableOpacity, TextInput, ScrollView,
  StyleSheet, Dimensions, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

export interface FilterSection {
  key: string;
  label: string;
  icon: string;
  values: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  /** If false, selecting a new value replaces the old one (single-select). Default true. */
  multiSelect?: boolean;
}

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  sections: FilterSection[];
  onClearAll: () => void;
  onApply: () => void;
  /** Initial section to open (optional) */
  initialSection?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible, onClose, sections, onClearAll, onApply, initialSection,
}) => {
  const { colors, isDark } = useTheme();
  const [activeSection, setActiveSection] = useState(initialSection || (sections.length > 0 ? sections[0].key : ''));
  const [searchText, setSearchText] = useState('');

  // Reset to initial section when opening
  React.useEffect(() => {
    if (visible && initialSection) {
      setActiveSection(initialSection);
      setSearchText('');
    } else if (visible && sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].key);
      setSearchText('');
    }
  }, [visible, initialSection]);

  const currentSection = sections.find(s => s.key === activeSection);

  const filteredValues = useMemo(() => {
    if (!currentSection || !searchText) return currentSection?.values || [];
    const q = searchText.toLowerCase();
    return currentSection.values.filter(v => v.toLowerCase().includes(q));
  }, [currentSection, searchText]);

  const totalActive = sections.reduce((sum, s) => sum + s.selectedValues.length, 0);

  const handleToggleValue = (value: string) => {
    if (!currentSection) return;
    const selected = currentSection.selectedValues;
    const isMulti = currentSection.multiSelect !== false;
    if (selected.includes(value)) {
      // Deselect
      currentSection.onChange(selected.filter(v => v !== value));
    } else if (isMulti) {
      // Multi-select: append
      currentSection.onChange([...selected, value]);
    } else {
      // Single-select: replace
      currentSection.onChange([value]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          {/* Handle bar */}
          <View style={styles.handleBar}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Header with close button */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color={colors.textTertiary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Search filters..."
              placeholderTextColor={colors.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearSearch}>
                <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Main content: left sidebar + right panel */}
          <View style={styles.mainContent}>
            {/* Left sidebar — filter types */}
            <View style={[styles.sidebar, { backgroundColor: colors.surfaceAlt, borderRightColor: colors.border }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {sections.map(section => {
                  const isActive = activeSection === section.key;
                  const count = section.selectedValues.length;
                  return (
                    <TouchableOpacity
                      key={section.key}
                      style={[
                        styles.sidebarItem,
                        isActive && { backgroundColor: colors.surface },
                      ]}
                      onPress={() => { setActiveSection(section.key); setSearchText(''); }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={section.icon as any}
                        size={18}
                        color={isActive ? colors.primary : colors.textSecondary}
                        style={styles.sidebarIcon}
                      />
                      <Text style={[
                        styles.sidebarLabel,
                        { color: isActive ? colors.primary : colors.text }
                      ]}>{section.label}</Text>
                      {count > 0 && (
                        <View style={[styles.sidebarBadge, { backgroundColor: colors.primary }]}>
                          <Text style={[styles.sidebarBadgeText, { color: colors.background }]}>{count}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Right panel — values for selected filter type */}
            <View style={styles.valuesPanel}>
              {currentSection && filteredValues.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.valuesContainer}>
                  {filteredValues.map(value => {
                    const isSelected = currentSection.selectedValues.includes(value);
                    return (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.valueItem,
                          { borderBottomColor: colors.borderLight },
                          isSelected && { backgroundColor: colors.primary + '15' },
                        ]}
                        onPress={() => handleToggleValue(value)}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.checkbox,
                          {
                            borderColor: isSelected ? colors.primary : colors.border,
                            backgroundColor: isSelected ? colors.primary : 'transparent',
                          }
                        ]}>
                          {isSelected && <Ionicons name="checkmark" size={14} color={colors.background} />}
                        </View>
                        <Text style={[
                          styles.valueText,
                          { color: isSelected ? colors.primary : colors.text }
                        ]}>{value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : currentSection && filteredValues.length === 0 ? (
                <View style={styles.emptyValues}>
                  <Ionicons name="search-outline" size={32} color={colors.textTertiary} />
                  <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No matching options</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Bottom bar: Clear + Apply */}
          <View style={[styles.bottomBar, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[styles.clearBtn, { borderColor: colors.border }]}
              onPress={onClearAll}
              activeOpacity={0.7}
            >
              <Text style={[styles.clearBtnText, { color: colors.textSecondary }]}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={onApply}
              activeOpacity={0.7}
            >
              <Text style={[styles.applyBtnText, { color: colors.background }]}>
                Apply{totalActive > 0 ? ` (${totalActive})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Sort Bottom Sheet ────────────────────────────────────────

export interface SortOption {
  label: string;
  value: string;
  icon: string;
}

interface SortBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  options: SortOption[];
  selectedOption: string;
  onSelect: (value: string) => void;
}

export const SortBottomSheet: React.FC<SortBottomSheetProps> = ({
  visible, onClose, options, selectedOption, onSelect,
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.sheet, styles.sortSheet, { backgroundColor: colors.background }]}>
          {/* Handle */}
          <View style={styles.handleBar}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Sort By</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Sort options */}
          <View style={styles.sortOptionsContainer}>
            {options.map(option => {
              const isSelected = selectedOption === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortItem,
                    { borderBottomColor: colors.borderLight },
                    isSelected && { backgroundColor: colors.primary + '10' },
                  ]}
                  onPress={() => { onSelect(option.value); onClose(); }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={isSelected ? colors.primary : colors.textSecondary}
                    style={styles.sortItemIcon}
                  />
                  <Text style={[
                    styles.sortItemText,
                    { color: isSelected ? colors.primary : colors.text }
                  ]}>{option.label}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.78,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    overflow: 'hidden',
  },
  sortSheet: {
    height: SCREEN_HEIGHT * 0.45,
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: spacing.s,
    paddingBottom: spacing.xxs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    ...typography.h3,
  },
  closeBtn: {
    padding: spacing.xxs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.l + 10,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 36,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: borderRadius.m,
    paddingLeft: 32,
    paddingRight: 28,
    ...typography.caption,
  },
  clearSearch: {
    position: 'absolute',
    right: spacing.l + 6,
    padding: 2,
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 110,
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.xs,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.s,
    marginVertical: 1,
  },
  sidebarIcon: {
    marginRight: spacing.s,
  },
  sidebarLabel: {
    ...typography.caption,
    fontWeight: '600',
    flex: 1,
  },
  sidebarBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sidebarBadgeText: {
    ...typography.small,
    fontSize: 10,
    fontWeight: 'bold',
  },
  valuesPanel: {
    flex: 1,
    paddingLeft: spacing.s,
  },
  valuesContainer: {
    paddingVertical: spacing.xs,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: borderRadius.s,
    marginHorizontal: spacing.xs,
    marginBottom: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.s,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  valueText: {
    ...typography.body,
    fontWeight: '500',
  },
  emptyValues: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.caption,
    marginTop: spacing.s,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.m,
  },
  clearBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m,
    borderRadius: borderRadius.l,
    borderWidth: 1,
  },
  clearBtnText: {
    ...typography.button,
  },
  applyBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m,
    borderRadius: borderRadius.l,
  },
  applyBtnText: {
    ...typography.button,
  },
  // Sort styles
  sortOptionsContainer: {
    padding: spacing.m,
  },
  sortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: borderRadius.s,
  },
  sortItemIcon: {
    marginRight: spacing.m,
  },
  sortItemText: {
    ...typography.body,
    fontWeight: '500',
    flex: 1,
  },
});
