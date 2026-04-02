import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTripsStore } from './store/tripsStore';
import { useTheme } from '../../theme/ThemeContext';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { EmptyState } from '../../components/EmptyState';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';

export default function TripsScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { history, fetchData } = useTripsStore();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>My Trips</Text>
            </View>

            <FlatList
                data={history}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <EmptyState
                        iconName="airplane-outline"
                        message="No upcoming trips"
                        subMessage="Tap the + button to create a trip packing list."
                    />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => navigation.navigate('TripDetail', { id: item.id })}
                    >
                        <View>
                            <Text style={[styles.nameText, { color: colors.text }]}>{item.name}</Text>
                            <Text style={[styles.locText, { color: colors.textSecondary }]}>{item.location}</Text>
                            <Text style={[styles.dateText, { color: colors.textSecondary }]}>{item.date}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <FloatingActionButton onPress={() => navigation.navigate('AddTrip')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: spacing.l,
        paddingTop: spacing.xl,
        paddingBottom: spacing.m,
    },
    title: { ...typography.h1 },
    list: { paddingHorizontal: spacing.l, paddingBottom: 100 },
    card: {
        padding: spacing.m,
        borderWidth: 1,
        borderRadius: borderRadius.m,
        marginBottom: spacing.m,
    },
    nameText: { ...typography.h3, marginBottom: 4 },
    locText: { ...typography.body, marginBottom: 4 },
    dateText: { ...typography.small },
});
