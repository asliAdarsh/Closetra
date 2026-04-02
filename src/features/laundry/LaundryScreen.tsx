import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLaundryStore } from './store/laundryStore';
import { useTheme } from '../../theme/ThemeContext';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { EmptyState } from '../../components/EmptyState';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';

export default function LaundryScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { history, fetchData } = useLaundryStore();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Laundry</Text>
            </View>

            <FlatList
                data={history}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <EmptyState
                        iconName="water-outline"
                        message="No laundry history"
                        subMessage="Tap the + button to add clothes to laundry."
                    />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => navigation.navigate('LaundryDetail', { id: item.id })}
                    >
                        <View>
                            <Text style={[styles.dateText, { color: colors.text }]}>{item.date} • {item.day}</Text>
                            {!!item.note && <Text style={[styles.noteText, { color: colors.textSecondary }]}>{item.note}</Text>}
                        </View>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: item.status === 'Returned' ? colors.success : colors.warning }
                        ]}>
                            <Text style={[styles.statusText, { color: colors.background }]}>{item.status}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <FloatingActionButton onPress={() => navigation.navigate('AddLaundry')} />
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
    list: {
        paddingHorizontal: spacing.l,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.m,
        borderWidth: 1,
        borderRadius: borderRadius.m,
        marginBottom: spacing.m,
    },
    dateText: { ...typography.body, fontWeight: 'bold', marginBottom: 4 },
    noteText: { ...typography.small },
    statusBadge: {
        paddingHorizontal: spacing.s,
        paddingVertical: 4,
        borderRadius: borderRadius.s,
    },
    statusText: {
        ...typography.small,
        fontWeight: 'bold',
    }
});
