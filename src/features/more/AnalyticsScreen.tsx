import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useLaundryStore } from '../laundry/store/laundryStore';
import { useTripsStore } from '../trips/store/tripsStore';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();

    const { clothes, categories } = useClothesStore();
    const { history: laundryHistory, clothesInLaundry } = useLaundryStore();
    const { history: tripsHistory } = useTripsStore();

    const chartData = useMemo(() => {
        const counts = categories.map(cat => ({
            name: cat.name,
            count: clothes.filter(c => c.categoryId === cat.id).length,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
            legendFontColor: colors.textSecondary,
            legendFontSize: 12
        })).filter(d => d.count > 0);
        return counts;
    }, [clothes, categories, colors.textSecondary]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="arrow-back" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.statsRow, { gap: spacing.m }]}>
                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>{clothes.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Clothes</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>{clothesInLaundry.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Laundry</Text>
                    </View>
                </View>

                <View style={[styles.statsRow, { gap: spacing.m, marginTop: spacing.m }]}>
                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>{laundryHistory.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Laundry Cycles</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>{tripsHistory.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trips Taken</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Distribution</Text>
                {chartData.length > 0 ? (
                    <PieChart
                        data={chartData}
                        width={screenWidth - spacing.l * 2}
                        height={220}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                        }}
                        accessor={"count"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[10, 0]}
                        absolute
                    />
                ) : (
                    <Text style={[styles.noData, { color: colors.textSecondary }]}>Add some clothes to see the chart.</Text>
                )}
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
    content: { padding: spacing.l, paddingBottom: 100 },
    statsRow: { flexDirection: 'row' },
    statBox: {
        flex: 1,
        padding: spacing.l,
        borderRadius: borderRadius.m,
        borderWidth: 1,
        alignItems: 'center',
    },
    statNumber: { ...typography.h2, fontWeight: 'bold', marginBottom: spacing.xs },
    statLabel: { ...typography.small },
    sectionTitle: { ...typography.h3, marginTop: spacing.xl, marginBottom: spacing.l },
    noData: { ...typography.body, textAlign: 'center', fontStyle: 'italic', marginTop: spacing.xl }
});
