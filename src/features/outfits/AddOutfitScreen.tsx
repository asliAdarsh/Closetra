import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useOutfitsStore } from './store/outfitsStore';
import { useClothesStore } from '../clothes/store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ClothCard } from '../../components/ClothCard';

export default function AddOutfitScreen({ route }: any) {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { outfits, addOutfit, updateOutfit, deleteOutfit, getOutfitItems } = useOutfitsStore();
    const { clothes } = useClothesStore();

    const editId = route.params?.id;
    const existingOutfit = editId ? outfits.find(o => o.id === editId) : null;

    const [name, setName] = useState(existingOutfit?.name || '');
    const [notes, setNotes] = useState(existingOutfit?.notes || '');
    const [selectedClothIds, setSelectedClothIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (editId) {
            const items = getOutfitItems(editId);
            setSelectedClothIds(new Set(items.map(i => i.clothId)));
        }
    }, [editId, getOutfitItems]);

    const toggleCloth = (id: string) => {
        setSelectedClothIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        if (selectedClothIds.size === 0) {
            alert("Please select at least one item of clothing.");
            return;
        }

        const finalName = name.trim() || 'My Outfit';
        const finalNotes = notes.trim();

        if (existingOutfit) {
            updateOutfit(existingOutfit.id, finalName, finalNotes, Array.from(selectedClothIds));
            // Navigate back to OutfitDetail if it was open, or just go back
            navigation.goBack();
        } else {
            addOutfit(finalName, finalNotes, Array.from(selectedClothIds));
            navigation.goBack();
        }
    };

    const handleDelete = () => {
        if (existingOutfit) {
            deleteOutfit(existingOutfit.id);
            // We need to pop to top of stack since the Detail screen is also in the stack
            navigation.popToTop();
        }
    };

    const filteredClothes = useMemo(() => {
        if (!searchQuery) return clothes;
        const query = searchQuery.toLowerCase();
        return clothes.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.color.toLowerCase().includes(query) ||
            c.brand.toLowerCase().includes(query) ||
            (c.notes || '').toLowerCase().includes(query)
        );
    }, [clothes, searchQuery]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="close" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>{existingOutfit ? 'Edit Outfit' : 'Create Outfit'}</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={[styles.saveBtn, { color: colors.primary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Outfit Name</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="e.g. Summer Casual"
                        placeholderTextColor={colors.textSecondary}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Notes (Optional)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="e.g. Great for beach days"
                        placeholderTextColor={colors.textSecondary}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Clothes</Text>
                    <Text style={[styles.countText, { color: colors.primary }]}>{selectedClothIds.size} selected</Text>
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
                    {filteredClothes.map((cloth) => {
                        const isSelected = selectedClothIds.has(cloth.id);
                        return (
                            <TouchableOpacity
                                key={cloth.id}
                                style={[
                                    styles.gridItem,
                                    isSelected && { borderColor: colors.primary, borderWidth: 3 }
                                ]}
                                onPress={() => toggleCloth(cloth.id)}
                                activeOpacity={0.8}
                            >
                                <ClothCard
                                    cloth={cloth}
                                    onPress={() => toggleCloth(cloth.id)}
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

                {existingOutfit && (
                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                        <Text style={[styles.deleteText, { color: colors.error }]}>Delete Outfit</Text>
                    </TouchableOpacity>
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
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
        padding: spacing.m,
    },
    deleteText: {
        ...typography.body,
        fontWeight: 'bold',
        marginLeft: spacing.s,
    }
});
