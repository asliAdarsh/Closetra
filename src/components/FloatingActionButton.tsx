import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

interface FABProps {
    onPress: () => void;
    style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FABProps> = ({ onPress, style }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Ionicons name="add" size={32} color={colors.background} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.l,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    }
});
