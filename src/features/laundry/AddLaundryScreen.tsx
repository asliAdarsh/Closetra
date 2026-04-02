import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

export default function AddLaundryScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { addLaundry, clothesInLaundry } = useLaundryStore();
    const { clothes } = useClothesStore();

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClothIds, setSelectedClothIds] = useState<string[]>([]);
    const [showPicker, setShowPicker] = useState(false);

    const availableClothes = useMemo(() => {
        return clothes.filter(c => {
            if (clothesInLaundry.includes(c.id)) return false;
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
    }, [clothes, clothesInLaundry, searchQuery]);

    const toggleSelection = (id: string) => {
        setSelectedClothIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        if (selectedClothIds.length === 0) {
            alert("Please select at least one cloth.");
            return;
        }
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        addLaundry(date, time, day, note, selectedClothIds);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="close" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>Add to Laundry</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={[styles.saveBtn, { color: colors.primary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={[styles.label, { color: colors.text }]}>Date</Text>
                <TouchableOpacity
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowPicker(true)}
                >
                    <Text style={{ color: date ? colors.text : colors.textSecondary }}>
                        {date || "YYYY-MM-DD"}
                    </Text>
                </TouchableOpacity>

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

                <Text style={[styles.label, { color: colors.text }]}>Note (Optional)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={note}
                    onChangeText={setNote}
                    placeholder="e.g. Dry clean only items"
                    placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.label, { color: colors.text, marginTop: spacing.l }]}>Select Clothes</Text>
                <TextInput
                    style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    placeholder="Search by name, color, brand..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={availableClothes}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => {
                    const isSelected = selectedClothIds.includes(item.id);
                    return (
                        <TouchableOpacity
                            style={[styles.cardWrapper, isSelected && { opacity: 0.5 }]}
                            onPress={() => toggleSelection(item.id)}
                            activeOpacity={0.8}
                        >
                            <ClothCard
                                cloth={item}
                                onPress={() => toggleSelection(item.id)}
                                onToggleFavorite={() => { }}
                            />
                            {isSelected && (
                                <View style={styles.checkOverlay}>
                                    <Ionicons name="checkmark-circle" size={40} color={colors.primary} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
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
    saveBtn: { ...typography.h3, fontWeight: 'bold' },
    form: { paddingHorizontal: spacing.l, paddingTop: spacing.l },
    label: { ...typography.body, fontWeight: 'bold', marginBottom: spacing.s, marginTop: spacing.m },
    input: {
        borderWidth: 1,
        borderRadius: borderRadius.m,
        padding: spacing.m,
        ...typography.body,
    },
    grid: { paddingHorizontal: spacing.l, paddingBottom: 100, paddingTop: spacing.m },
    row: { gap: spacing.m },
    cardWrapper: { flex: 1, maxWidth: '50%' },
    checkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.m,
    },
    searchBar: {
        borderWidth: 1,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.m,
        ...typography.body,
        marginTop: spacing.s,
    }
});
