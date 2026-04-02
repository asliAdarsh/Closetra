import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLaundryStore } from './store/laundryStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ClothCard } from '../../components/ClothCard';

export default function LaundryDetailScreen({ route }: any) {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const id = route.params?.id;

    const { history, markReturned, getLaundryItems } = useLaundryStore();
    const { clothes } = useClothesStore();

    const laundry = history.find(l => l.id === id);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        if (laundry) {
            const laundryItems = getLaundryItems(laundry.id);
            const clothList = laundryItems.map(li => clothes.find(c => c.id === li.clothId)).filter(Boolean);
            setItems(clothList);
        }
    }, [laundry, clothes, getLaundryItems]);

    if (!laundry) return null;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="arrow-back" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>Laundry Detail</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.infoBox}>
                <Text style={[styles.dateText, { color: colors.text }]}>{laundry.date} • {laundry.time}</Text>
                {!!laundry.note && <Text style={[styles.noteText, { color: colors.textSecondary }]}>{laundry.note}</Text>}

                <View style={[styles.statusBadge, { backgroundColor: laundry.status === 'Returned' ? colors.success : colors.warning }]}>
                    <Text style={styles.statusText}>{laundry.status}</Text>
                </View>

                {laundry.status === 'Given' && (
                    <TouchableOpacity
                        style={[styles.returnBtn, { backgroundColor: colors.primary }]}
                        onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            markReturned(laundry.id);
                        }}
                    >
                        <Text style={styles.returnBtnText}>Mark as Returned</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Items ({items.length})</Text>

            <FlatList
                data={items}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <ClothCard
                            cloth={item}
                            onPress={() => { }}
                            onToggleFavorite={() => { }}
                        />
                    </View>
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
    title: { ...typography.h3 },
    infoBox: {
        padding: spacing.l,
        alignItems: 'center',
    },
    dateText: { ...typography.h3, marginBottom: spacing.xs },
    noteText: { ...typography.body, marginBottom: spacing.m, textAlign: 'center' },
    statusBadge: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.m,
        marginBottom: spacing.l,
    },
    statusText: { ...typography.body, fontWeight: 'bold' },
    returnBtn: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.m,
        borderRadius: borderRadius.m,
    },
    returnBtnText: { ...typography.body, fontWeight: 'bold' },
    sectionTitle: {
        ...typography.h3,
        paddingHorizontal: spacing.l,
        marginBottom: spacing.m,
    },
    grid: { paddingHorizontal: spacing.l, paddingBottom: 100 },
    row: { gap: spacing.m },
    cardWrapper: { flex: 1, maxWidth: '50%' }
});
