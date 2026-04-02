import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface EmptyStateProps {
    iconName: keyof typeof Ionicons.glyphMap;
    message: string;
    subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ iconName, message, subMessage }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: colors.border }]}>
                <Ionicons name={iconName} size={48} color={colors.textSecondary} />
            </View>
            <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
            {subMessage && (
                <Text style={[styles.subMessage, { color: colors.textSecondary }]}>{subMessage}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        marginTop: spacing.xxl,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    message: {
        ...typography.h3,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subMessage: {
        ...typography.body,
        textAlign: 'center',
    }
});
