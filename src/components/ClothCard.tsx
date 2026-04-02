import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cloth } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ClothCardProps {
    cloth: Cloth;
    onPress: () => void;
    onToggleFavorite: (id: string, isFav: boolean) => void;
    isInLaundry?: boolean;
    isInTrip?: boolean;
    hideFavorite?: boolean;
}

export const ClothCard: React.FC<ClothCardProps> = ({
    cloth, onPress, onToggleFavorite, isInLaundry, isInTrip, hideFavorite
}) => {
    const { colors } = useTheme();
    const [imageError, setImageError] = React.useState(false);

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {imageError ? (
                <View style={[styles.imageFallback, { backgroundColor: colors.border }]}>
                    <Text style={[styles.fallbackText, { color: colors.textSecondary }]} numberOfLines={2}>
                        {cloth.name || 'No Image'}
                    </Text>
                </View>
            ) : (
                <Image
                    source={{ uri: cloth.imagePath }}
                    style={styles.image}
                    onError={() => setImageError(true)}
                />
            )}

            <View style={styles.info}>
                <Text style={[styles.brand, { color: colors.text }]} numberOfLines={1}>
                    {cloth.name || 'Unnamed'}
                </Text>
                <Text style={[styles.colorText, { color: colors.textSecondary }]} numberOfLines={1}>
                    {cloth.brand ? `${cloth.brand} • ` : ''}{cloth.color}
                </Text>

                <View style={styles.badges}>
                    {isInLaundry && (
                        <View style={[styles.badge, { backgroundColor: colors.warning }]}>
                            <Text style={[styles.badgeText, { color: colors.background }]}>Laundry</Text>
                        </View>
                    )}
                    {isInTrip && (
                        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.badgeText, { color: colors.background }]}>Packed</Text>
                        </View>
                    )}
                </View>
            </View>

            {!hideFavorite && (
                <TouchableOpacity
                    style={styles.favoriteBtn}
                    onPress={() => onToggleFavorite(cloth.id, !cloth.isFavorite)}
                >
                    <Ionicons
                        name={cloth.isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={cloth.isFavorite ? colors.error : colors.textSecondary}
                    />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: spacing.m,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#E5E5EA',
    },
    imageFallback: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.m,
    },
    fallbackText: {
        ...typography.body,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    info: {
        padding: spacing.s,
    },
    brand: {
        ...typography.small,
        marginBottom: 2,
    },
    colorText: {
        ...typography.caption,
        fontWeight: '500',
    },
    badges: {
        flexDirection: 'row',
        marginTop: 4,
        gap: 4,
        flexWrap: 'wrap',
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: borderRadius.s,
    },
    badgeText: {
        ...typography.small,
        fontSize: 10,
        fontWeight: 'bold',
    },
    favoriteBtn: {
        position: 'absolute',
        top: spacing.s,
        right: spacing.s,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: borderRadius.round,
        padding: 4,
    }
});
