import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useOutfitsStore } from './store/outfitsStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { ClothCard } from '../../components/ClothCard';
import { useTheme } from '../../theme/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export default function OutfitDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    const outfitId = route.params?.id;

    const { outfits, getOutfitItems } = useOutfitsStore();
    const { clothes } = useClothesStore();

    const outfit = useMemo(() => outfits.find(o => o.id === outfitId), [outfits, outfitId]);
    const outfitItems = useMemo(() => getOutfitItems(outfitId), [outfitId, outfits]);

    const outfitClothes = useMemo(() => {
        return outfitItems
            .map(item => clothes.find(c => c.id === item.clothId))
            .filter(Boolean) as any[];
    }, [outfitItems, clothes]);

    if (!outfit) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                    <Text style={[styles.title, { color: colors.text }]}>Outfit Not Found</Text>
                    <View style={{ width: 28 }} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="arrow-back" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>Outfit Details</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddOutfit', { id: outfit.id })}>
                    <Text style={[styles.editBtn, { color: colors.primary }]}>Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.outfitName, { color: colors.text }]}>{outfit.name || 'Unnamed Outfit'}</Text>
                    {outfit.notes ? (
                        <Text style={[styles.outfitNotes, { color: colors.textSecondary }]}>{outfit.notes}</Text>
                    ) : null}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Items ({outfitClothes.length})
                </Text>

                <View style={styles.grid}>
                    {outfitClothes.map((cloth) => (
                        <View key={cloth.id} style={styles.gridItem}>
                            <ClothCard
                                cloth={cloth}
                                onPress={() => navigation.navigate('Clothes', {
                                    screen: 'AddCloth',
                                    params: { id: cloth.id }
                                })}
                                onToggleFavorite={() => { }}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.l,
        borderBottomWidth: 1,
    },
    title: { ...typography.h3 },
    editBtn: { ...typography.h3, fontWeight: 'bold' },
    content: { padding: spacing.l, paddingBottom: 100 },
    infoCard: {
        padding: spacing.l,
        borderRadius: borderRadius.m,
        borderWidth: 1,
        marginBottom: spacing.xl,
    },
    outfitName: { ...typography.h1, marginBottom: spacing.s },
    outfitNotes: { ...typography.body },
    sectionTitle: { ...typography.h2, marginBottom: spacing.m },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.m,
    },
    gridItem: {
        width: '47%',
        marginBottom: spacing.m,
    }
});
