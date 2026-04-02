import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLaundryStore } from './store/laundryStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ClothCard } from '../../components/ClothCard';

export default function EditLaundryScreen({ route }: any) {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const sessionId = route.params?.id;

    const { history, updateLaundry, clothesInLaundry, getLaundryItems } = useLaundryStore();
    const { clothes } = useClothesStore();

    const session = history.find(s => s.id === sessionId);
    const existingItems = useMemo(() => getLaundryItems(sessionId), [sessionId, getLaundryItems]);

    const [date, setDate] = useState(session?.date || new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState(session?.note || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClothIds, setSelectedClothIds] = useState<string[]>(
        existingItems.map(i => i.clothId)
    );
    const [showPicker, setShowPicker] = useState(false);

    const availableClothes = useMemo(() => {
        const existingIds = existingItems.map(i => i.clothId);
        return clothes.filter(c => {
            // Include clothes already in this session, exclude clothes in other sessions
            if (clothesInLaundry.includes(c.id) && !existingIds.includes(c.id)) {
                return false;
            }
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!c.name.toLowerCase().includes(query) &&
                    !c.color.toLowerCase().includes(query) &&
                    !c.brand.toLowerCase().includes(query) &&
                    !(c.notes || '').toLowerCase().includes(query)) {
                    return false;
                }
            }
            return true;
        });
    }, [clothes, clothesInLaundry, existingItems, searchQuery]);

    const toggleSelection = (id: string) => {
        setSelectedClothIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        if (selectedClothIds.length === 0) {
            Alert.alert("No Items", "Please select at least one cloth.");
            return;
        }
        const time = session?.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = session?.day || new Date().toLocaleDateString('en-US', { weekday: 'long' });

        updateLaundry(sessionId, date, time, day, note, selectedClothIds);
        navigation.goBack();
    };

    if (!session) return null;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="close" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>Edit Laundry</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={[styles.saveBtn, { color: colors.primary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <Text style={[styles.input, { color: date ? colors.text : colors.textSecondary }]}>
                            {date || "YYYY-MM-DD"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showPicker && (
                    <DateTimePicker
                        value={new Date(date || Date.now())}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowPicker(false);
                            if (selectedDate) {
                                setDate(selectedDate.toISOString().split('T')[0]);
                            }
                        }}
                    />
                )}

                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Note (Optional)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={note}
                        onChangeText={setNote}
                        placeholder="e.g. Dry clean only items"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Clothes</Text>
                    <Text style={[styles.countText, { color: colors.primary }]}>{selectedClothIds.length} selected</Text>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                        placeholder="Search color, brand, notes..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.grid}>
                    {availableClothes.map((item) => {
                        const isSelected = selectedClothIds.includes(item.id);
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.gridItem,
                                    isSelected && { borderColor: colors.primary, borderWidth: 3 }
                                ]}
                                onPress={() => toggleSelection(item.id)}
                                activeOpacity={0.8}
                            >
                                <ClothCard
                                    cloth={item}
                                    onPress={() => toggleSelection(item.id)}
                                    onToggleFavorite={() => { }}
                                    hideFavorite={true}
                                />
                                {isSelected && (
                                    <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                                        <Ionicons name="checkmark" size={16} color={colors.background} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
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
    saveBtn: { ...typography.h3, fontWeight: 'bold' },
    contentContainer: {
        padding: spacing.l,
        paddingBottom: 100,
    },
    inputContainer: {
        padding: spacing.m,
        borderRadius: borderRadius.m,
        borderWidth: 1,
        marginBottom: spacing.l,
    },
    label: {
        ...typography.caption,
        marginBottom: spacing.xs,
    },
    input: {
        ...typography.body,
        padding: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: spacing.m,
        marginTop: spacing.s,
    },
    sectionTitle: { ...typography.h3 },
    countText: { ...typography.body, fontWeight: 'bold' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    searchInput: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderRadius: 24,
        paddingLeft: 40,
        paddingRight: spacing.m,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.m,
    },
    gridItem: {
        width: '47%',
        marginBottom: spacing.m,
        borderRadius: borderRadius.m,
        overflow: 'hidden',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    }
});
