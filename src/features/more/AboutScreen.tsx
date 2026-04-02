import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function AboutScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="arrow-back" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>About</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <Ionicons name="shirt-outline" size={80} color={colors.primary} style={{ marginBottom: spacing.m }} />
                <Text style={[styles.appName, { color: colors.text }]}>Closetra</Text>
                <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>

                <Text style={[styles.desc, { color: colors.text }]}>
                    Your offline, privacy-first wardrobe manager.
                    Everything you do in Closetra stays on your device.
                </Text>

                <View style={[styles.badge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="shield-checkmark" size={20} color={colors.success} style={{ marginRight: spacing.s }} />
                    <Text style={[styles.badgeText, { color: colors.text }]}>100% Offline & Private</Text>
                </View>
            </View>
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    appName: { ...typography.h1, marginBottom: spacing.xs },
    version: { ...typography.body, marginBottom: spacing.xl },
    desc: { ...typography.body, textAlign: 'center', lineHeight: 24, marginBottom: spacing.xl },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.m,
        borderRadius: borderRadius.round,
        borderWidth: 1,
    },
    badgeText: { ...typography.body, fontWeight: 'bold' }
});
