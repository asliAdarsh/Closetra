import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { exportData, importData } from '../../utils/backupRestore';
import { getDb } from '../../database/db';
import { useUpdateChecker } from '../../hooks/useUpdateChecker';

export default function MoreScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { checkForUpdates, isChecking } = useUpdateChecker();

    const handleBackup = async () => {
        try {
            await exportData();
        } catch (error) {
            Alert.alert('Backup Failed', 'An error occurred while exporting data.');
        }
    };

    const handleRestore = async () => {
        Alert.alert(
            "Restore Backup",
            "This will overwrite all your current data. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Restore",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const success = await importData();
                            if (success) {
                                Alert.alert('Success', 'Data restored successfully! Please restart the app.');
                            }
                        } catch (error) {
                            Alert.alert('Restore Failed', 'Invalid backup file or error during restore.');
                        }
                    }
                }
            ]
        );
    };

    const handleClearData = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            "Clear All Data",
            "This cannot be undone. All your clothes, trips, and settings will be permanently deleted.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear Data",
                    style: "destructive",
                    onPress: () => {
                        const db = getDb();
                        db.execSync(`
              DELETE FROM Clothes;
              DELETE FROM Trips;
              DELETE FROM TripItems;
              DELETE FROM Laundry;
              DELETE FROM LaundryItems;
              DELETE FROM Outfits;
            `);
                        Alert.alert('Success', 'All data cleared! Please restart the app.');
                    }
                }
            ]
        );
    };

    const renderItem = (icon: any, title: string, onPress: () => void, colorOverride?: string, customRight?: React.ReactNode) => (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
            onPress={onPress}
            disabled={!!customRight && isChecking} // disable if loading visually replaces arrow
        >
            <View style={styles.itemLeft}>
                <Ionicons name={icon} size={24} color={colorOverride || colors.primary} style={styles.icon} />
                <Text style={[styles.itemText, { color: colorOverride || colors.text }]}>{title}</Text>
            </View>
            {customRight ? customRight : <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Menu</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.section}>
                    {renderItem("stats-chart", "Analytics & Stats", () => navigation.navigate('Analytics'))}
                    {renderItem("settings", "App Settings", () => navigation.navigate('Settings'))}
                </View>

                <View style={styles.section}>
                    {renderItem("cloud-download", "Backup Data", handleBackup)}
                    {renderItem("cloud-upload", "Restore Data", handleRestore)}
                </View>

                <View style={styles.section}>
                    {renderItem("information-circle", "About", () => navigation.navigate('About'))}
                    {renderItem(
                        "refresh",
                        "Check for Updates",
                        () => checkForUpdates(),
                        undefined,
                        isChecking ? <ActivityIndicator size="small" color={colors.primary} /> : undefined
                    )}
                </View>

                <View style={styles.section}>
                    {renderItem("trash", "Clear All Data", handleClearData, colors.error)}
                </View>
            </ScrollView>

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
    scroll: { paddingHorizontal: spacing.l, paddingBottom: 100, paddingTop: spacing.m },
    section: {
        marginBottom: spacing.l,
        borderRadius: borderRadius.m,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.m,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    itemLeft: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: spacing.m },
    itemText: { ...typography.body, fontWeight: '500' }
});
