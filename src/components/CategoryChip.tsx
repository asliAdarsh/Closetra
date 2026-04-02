import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface CategoryChipProps {
    label: string;
    isSelected?: boolean;
    icon?: string;
    onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label, isSelected, icon, onPress }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.chip,
                {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {icon && (
                <Ionicons
                    name={icon as any}
                    size={16}
                    color={isSelected ? colors.background : colors.textSecondary}
                    style={{ marginRight: 6 }}
                />
            )}
            <Text style={[
                styles.label,
                { color: isSelected ? colors.background : colors.text }
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        marginRight: spacing.s,
        marginBottom: spacing.s,
        alignSelf: 'flex-start'
    },
    label: {
        ...typography.body,
        fontWeight: '500'
    }
});
