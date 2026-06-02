import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ThemeName, themes } from '../../theme/colors';

const THEME_OPTIONS: Array<{ name: ThemeName; label: string; preview: string }> = [
    { name: 'Minimal', label: 'Minimal', preview: '#1A1A1A' },
    { name: 'Ocean', label: 'Ocean', preview: '#0A6DC4' },
    { name: 'Forest', label: 'Forest', preview: '#2D6A4F' },
    { name: 'Sunset', label: 'Sunset', preview: '#F57C00' },
    { name: 'Crimson', label: 'Crimson', preview: '#C0392B' },
    { name: 'Lavender', label: 'Lavender', preview: '#764ABC' },
    { name: 'Midnight', label: 'Midnight', preview: '#E94560' },
];

export default function SettingsScreen() {
    const { colors, isDark, setTheme, themeName, setThemeName, gridColumns, setGridColumns } = useTheme();
    const navigation = useNavigation();

    const toggleTheme = () => {
        setTheme(isDark ? 'Light' : 'Dark');
    };

    const handleGridColumns = () => {
        const next = gridColumns >= 4 ? 1 : gridColumns + 1;
        setGridColumns(next);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="arrow-back" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Dark Mode Toggle */}
                <View style={[styles.row, { borderBottomColor: colors.border }]}>
                    <View>
                        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Toggle app appearance</Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ true: colors.primary }}
                        thumbColor={colors.primary}
                    />
                </View>

                {/* Theme Picker */}
                <View style={[styles.sectionRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.text, marginBottom: spacing.s }]}>Color Theme</Text>
                    <Text style={[styles.subLabel, { color: colors.textSecondary, marginBottom: spacing.m }]}>
                        Choose a color palette
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {THEME_OPTIONS.map(opt => {
                            const isActive = themeName === opt.name;
                            const themeColors = isDark ? themes[opt.name].dark : themes[opt.name].light;
                            return (
                                <TouchableOpacity
                                    key={opt.name}
                                    style={[
                                        styles.themeChip,
                                        {
                                            borderColor: isActive ? themeColors.primary : colors.border,
                                            backgroundColor: isActive ? themeColors.primary : colors.surface,
                                        },
                                    ]}
                                    onPress={() => setThemeName(opt.name)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.themePreview, { backgroundColor: opt.preview }]} />
                                    <Text
                                        style={[
                                            styles.themeLabel,
                                            { color: isActive ? colors.background : colors.text },
                                        ]}
                                    >
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Grid Columns */}
                <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={handleGridColumns}>
                    <View>
                        <Text style={[styles.label, { color: colors.text }]}>Grid Columns</Text>
                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Closet view ({gridColumns} cols)</Text>
                    </View>
                    <Ionicons name="apps-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
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
    content: { padding: spacing.l },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.l,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    sectionRow: {
        paddingVertical: spacing.l,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    label: { ...typography.body, fontWeight: 'bold', marginBottom: 2 },
    subLabel: { ...typography.small },
    themeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: borderRadius.round,
        borderWidth: 2,
        marginRight: spacing.s,
    },
    themePreview: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: spacing.s,
    },
    themeLabel: {
        ...typography.body,
        fontWeight: '600',
    },
});
