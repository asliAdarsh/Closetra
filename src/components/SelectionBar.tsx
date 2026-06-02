import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface SelectionBarProps {
    selectedCount: number;
    actions: Array<{
        label: string;
        icon: string;
        onPress: () => void;
        destructive?: boolean;
    }>;
    onCancel: () => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
    selectedCount,
    actions,
    onCancel,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            {/* Top row: cancel + count */}
            <View style={styles.topRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
                    <Ionicons name="close" size={18} color={colors.textSecondary} />
                    <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>

                <View style={styles.countBadge}>
                    <Text style={[styles.countNumber, { color: colors.primary }]}>{selectedCount}</Text>
                    <Text style={[styles.countLabel, { color: colors.textSecondary }]}>selected</Text>
                </View>
            </View>

            {/* Bottom row: action buttons */}
            <View style={styles.actionsRow}>
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.actionButton,
                            {
                                backgroundColor: action.destructive ? colors.error + '18' : colors.primary + '12',
                                borderColor: action.destructive ? colors.error + '30' : colors.primary + '25',
                            }
                        ]}
                        onPress={action.onPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={action.icon as any}
                            size={16}
                            color={action.destructive ? colors.error : colors.primary}
                        />
                        <Text style={[
                            styles.actionText,
                            { color: action.destructive ? colors.error : colors.primary }
                        ]}>
                            {action.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingBottom: spacing.xl,
        paddingTop: spacing.m,
        paddingHorizontal: spacing.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.m,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.s,
    },
    cancelText: {
        ...typography.caption,
        fontWeight: '600',
        marginLeft: spacing.xs,
    },
    countBadge: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.xxs,
    },
    countNumber: {
        ...typography.h2,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    countLabel: {
        ...typography.caption,
        fontWeight: '500',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: spacing.s,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: borderRadius.l,
        borderWidth: 1,
        gap: spacing.xs,
    },
    actionText: {
        ...typography.chip,
        fontWeight: '600',
    },
});
