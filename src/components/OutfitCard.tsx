import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Outfit, Cloth } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface Props {
    outfit: Outfit;
    items: Cloth[];
    onPress: () => void;
    onToggleFavorite: (id: string, isFav: boolean) => void;
}

export const OutfitCard: React.FC<Props> = ({ outfit, items, onPress, onToggleFavorite }) => {
    const { colors } = useTheme();

    // Take max 4 items to display in a 2x2 grid for the thumbnail
    const displayItems = items.slice(0, 4);

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.gridContainer}>
                {displayItems.length === 0 ? (
                    <View style={styles.emptyGrid}>
                        <Ionicons name="body-outline" size={32} color={colors.textSecondary} />
                    </View>
                ) : (
                    <View style={styles.fluidGrid}>
                        {displayItems.map((item, index) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.imageWrapper,
                                    displayItems.length === 1 && { width: '100%', height: '100%' },
                                    displayItems.length === 2 && { width: '50%', height: '100%' },
                                    displayItems.length === 3 && index === 0 && { width: '100%', height: '50%' },
                                    displayItems.length === 3 && index > 0 && { width: '50%', height: '50%' },
                                    displayItems.length >= 4 && { width: '50%', height: '50%' },
                                ]}
                            >
                                <Image source={{ uri: item.imagePath }} style={styles.image} />
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {outfit.name || 'Unnamed Outfit'}
                </Text>
                {items.length > 4 && (
                    <Text style={[styles.count, { color: colors.textSecondary }]}>+{items.length - 4} items</Text>
                )}
            </View>

            <TouchableOpacity
                style={[styles.favBtn, { backgroundColor: colors.surface }]}
                onPress={() => onToggleFavorite(outfit.id, outfit.isFavorite === 0)}
            >
                <Ionicons
                    name={outfit.isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={outfit.isFavorite ? colors.error : colors.textSecondary}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
        height: 200,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    gridContainer: {
        flex: 1,
        padding: spacing.xs,
    },
    fluidGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: borderRadius.m,
        overflow: 'hidden',
        gap: 2,
    },
    imageWrapper: {
        // sizing handled dynamically inline
    },
    image: {
        width: '100%',
        height: '100%',
    },
    emptyGrid: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: borderRadius.m,
    },
    footer: {
        padding: spacing.s,
        paddingHorizontal: spacing.m,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    name: {
        ...typography.body,
        fontWeight: 'bold',
    },
    count: {
        ...typography.caption,
        marginTop: 2,
    },
    favBtn: {
        position: 'absolute',
        top: spacing.s,
        right: spacing.s,
        padding: spacing.xs,
        borderRadius: borderRadius.round,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    }
});
