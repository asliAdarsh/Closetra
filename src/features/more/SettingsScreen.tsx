import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function SettingsScreen() {
    const { colors, isDark, theme, setTheme } = useTheme();
    const navigation = useNavigation();

    const toggleTheme = () => {
        setTheme(isDark ? 'Light' : 'Dark');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="arrow-back" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <View style={[styles.row, { borderBottomColor: colors.border }]}>
                    <View>
                        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Toggle app appearance</Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ true: colors.primary }}
                    />
                </View>

                <View style={[styles.row, { borderBottomColor: colors.border }]}>
                    <View>
                        <Text style={[styles.label, { color: colors.text }]}>Animations</Text>
                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Enable UI animations</Text>
                    </View>
                    <Switch
                        value={true}
                        onValueChange={() => { }}
                        trackColor={{ true: colors.primary }}
                    />
                </View>

                <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]}>
                    <View>
                        <Text style={[styles.label, { color: colors.text }]}>Grid Columns</Text>
                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Clothes view (2 cols)</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
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
    content: { padding: spacing.l },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.l,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    label: { ...typography.body, fontWeight: 'bold', marginBottom: 2 },
    subLabel: { ...typography.small }
});
