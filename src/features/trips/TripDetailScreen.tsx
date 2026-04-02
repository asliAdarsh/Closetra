import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTripsStore } from './store/tripsStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ClothCard } from '../../components/ClothCard';

export default function TripDetailScreen({ route }: any) {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const id = route.params?.id;

    const { history, togglePacked, collectAll, uncollectAll, getTripItems, deleteTrip } = useTripsStore();
    const { clothes } = useClothesStore();

    const trip = history.find(t => t.id === id);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        if (trip) {
            const tripItems = getTripItems(trip.id);
            const clothList = tripItems.map(ti => {
                const c = clothes.find(cloth => cloth.id === ti.clothId);
                return c ? { ...c, tripItemId: ti.id, isPacked: ti.isPacked === 1, isCollected: ti.isCollected === 1 } : null;
            }).filter(Boolean);
            setItems(clothList);
        }
    }, [trip, clothes, history, getTripItems]);

    if (!trip) return null;

    const packedCount = items.filter(i => i.isPacked).length;
    const progress = items.length === 0 ? 0 : (packedCount / items.length) * 100;
    const allPacked = items.length > 0 && items.every(i => i.isPacked);

    const handleDelete = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: () => {
                    deleteTrip(trip.id);
                    navigation.goBack();
                }
            }
        ]);
    };

    const handleCollectionToggle = (val: boolean) => {
        if (val) {
            collectAll(trip.id);
        } else {
            uncollectAll(trip.id);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="arrow-back" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{trip.name}</Text>
                <View style={styles.headerRight}>
                    <Ionicons
                        name="create-outline"
                        size={24}
                        color={colors.primary}
                        onPress={() => navigation.navigate('EditTrip', { id: trip.id })}
                        style={{ marginRight: spacing.m }}
                    />
                    <Ionicons name="trash-outline" size={24} color={colors.error} onPress={handleDelete} />
                </View>
            </View>

            <View style={styles.infoBox}>
                <Text style={[styles.locText, { color: colors.textSecondary }]}>{trip.location} • {trip.date}</Text>
                {!!trip.notes && (
                    <Text style={[styles.notesText, { color: colors.textSecondary }]}>{trip.notes}</Text>
                )}

                <View style={styles.progressContainer}>
                    <Text style={[styles.progressText, { color: colors.text }]}>Packed: {packedCount} / {items.length}</Text>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${progress}%` }]} />
                    </View>
                </View>

                <View style={[styles.collectionToggle, { borderTopColor: colors.border }]}>
                    <Text style={[styles.progressText, { color: colors.text }]}>Pack all items</Text>
                    <Switch
                        value={allPacked}
                        onValueChange={handleCollectionToggle}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>
            </View>

            <FlatList
                data={items}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.cardWrapper, item.isPacked && { opacity: 0.6 }]}
                        onPress={() => {
                            togglePacked(item.tripItemId, !item.isPacked);
                        }}
                        activeOpacity={0.8}
                    >
                        <ClothCard
                            cloth={item}
                            onPress={() => {
                                togglePacked(item.tripItemId, !item.isPacked);
                            }}
                            onToggleFavorite={() => { }}
                        />
                        <View style={[
                            styles.packBadge,
                            { backgroundColor: item.isPacked ? colors.success : colors.warning }
                        ]}>
                            <Text style={[styles.packBadgeText, { color: colors.background }]}>{item.isPacked ? 'Packed' : 'To Pack'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { ...typography.h3, flex: 1, textAlign: 'center', paddingHorizontal: spacing.s },
    infoBox: { padding: spacing.l, alignItems: 'center' },
    locText: { ...typography.body, marginBottom: spacing.s },
    notesText: { ...typography.caption, marginBottom: spacing.m, textAlign: 'center', fontStyle: 'italic' },
    progressContainer: { width: '100%', alignItems: 'center', marginTop: spacing.s },
    progressText: { ...typography.body, fontWeight: 'bold', marginBottom: spacing.s },
    progressBarBg: { width: '100%', height: 8, borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%' },
    collectionToggle: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.m,
        paddingTop: spacing.m,
        borderTopWidth: 1,
    },
    grid: { paddingHorizontal: spacing.l, paddingBottom: 100 },
    row: { gap: spacing.m },
    cardWrapper: { flex: 1, maxWidth: '50%' },
    packBadge: {
        position: 'absolute',
        top: spacing.s,
        left: spacing.s,
        paddingHorizontal: spacing.s,
        paddingVertical: 4,
        borderRadius: borderRadius.s,
    },
    packBadgeText: { ...typography.small, fontWeight: 'bold' }
});
