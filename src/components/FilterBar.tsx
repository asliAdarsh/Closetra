import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface FilterChip {
    label: string;
    value: string | string[];
    onPress: () => void;
    isActive: boolean;
}

interface FilterBarProps {
    chips: FilterChip[];
    activeCount: number;
    onClearAll: () => void;
    /** Optional content to show when expanded (filter pickers, sort options) */
    children?: React.ReactNode;
    /** External control of expanded state */
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    chips,
    activeCount,
    onClearAll,
    children,
    isExpanded: externalExpanded,
    onToggleExpand: externalToggle,
}) => {
    const { colors } = useTheme();
    const [internalExpanded, setInternalExpanded] = useState(false);

    const isExpanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
    const setIsExpanded = externalToggle || setInternalExpanded;

    const hasActiveFilters = activeCount > 0;

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View>
            {/* Filter Toggle Button */}
            <View style={styles.filterHeader}>
                <TouchableOpacity
                    style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={handleToggle}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="filter"
                        size={18}
                        color={hasActiveFilters ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[
                        styles.filterButtonText,
                        { color: hasActiveFilters ? colors.primary : colors.textSecondary }
                    ]}>
                        Filters
                    </Text>
                    {hasActiveFilters && (
                        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.badgeText, { color: colors.background }]}>
                                {activeCount}
                            </Text>
                        </View>
                    )}
                    <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color={colors.textTertiary}
                        style={styles.chevron}
                    />
                </TouchableOpacity>

                {hasActiveFilters && (
                    <TouchableOpacity onPress={onClearAll} activeOpacity={0.7}>
                        <Text style={[styles.clearAllText, { color: colors.textTertiary }]}>
                            Clear all
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Expanded Content — filter pickers or active chips */}
            {isExpanded && (
                <View style={[styles.expandedContainer, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
                    {/* Active filter chips (if any) */}
                    {chips.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.chipsContainer}
                        >
                            {chips.map((chip, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: chip.isActive ? colors.primary : colors.surface,
                                            borderColor: chip.isActive ? colors.primary : colors.border,
                                        }
                                    ]}
                                    onPress={chip.onPress}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            { color: chip.isActive ? colors.background : colors.text }
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {chip.label}
                                    </Text>
                                    {typeof chip.value === 'string' && chip.value ? (
                                        <Text
                                            style={[
                                                styles.chipValue,
                                                { color: chip.isActive ? colors.background : colors.textSecondary }
                                            ]}
                                        >
                                            : {chip.value}
                                        </Text>
                                    ) : Array.isArray(chip.value) && chip.value.length > 0 ? (
                                        <Text
                                            style={[
                                                styles.chipValue,
                                                { color: chip.isActive ? colors.background : colors.textSecondary }
                                            ]}
                                        >
                                            : {chip.value.length}
                                        </Text>
                                    ) : null}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {/* Children — e.g. color picker, brand picker, sort options */}
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.l,
        marginBottom: spacing.s,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.l,
        borderWidth: StyleSheet.hairlineWidth,
    },
    filterButtonText: {
        ...typography.chip,
        marginLeft: spacing.xs,
    },
    badge: {
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginLeft: spacing.xs,
    },
    badgeText: {
        ...typography.small,
        fontSize: 10,
        fontWeight: 'bold',
    },
    chevron: {
        marginLeft: spacing.xs,
    },
    clearAllText: {
        ...typography.caption,
        fontWeight: '500',
    },
    expandedContainer: {
        paddingVertical: spacing.s,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    chipsContainer: {
        paddingHorizontal: spacing.l,
        paddingBottom: spacing.xs,
        gap: spacing.xs,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        alignSelf: 'flex-start',
        marginRight: spacing.xs,
    },
    chipText: {
        ...typography.caption,
        fontWeight: '600',
    },
    chipValue: {
        ...typography.small,
        fontWeight: '500',
        marginLeft: 3,
    },
});
