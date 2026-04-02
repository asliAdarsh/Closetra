import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useOutfitsStore } from './store/outfitsStore';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function OutfitCategoryManagerScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { outfitCategories, addOutfitCategory, deleteOutfitCategory } = useOutfitsStore();

    const [newCatName, setNewCatName] = useState('');

    const handleAdd = () => {
        if (!newCatName.trim()) return;
        addOutfitCategory(newCatName.trim(), 'list');
        setNewCatName('');
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Category",
            `Are you sure you want to delete '${name}'? Outfits in this category will be uncategorized.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteOutfitCategory(id)
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="arrow-back" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>Outfit Categories</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.addSection}>
                <TextInput
                    style={[styles.input, { flex: 1, backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={newCatName}
                    onChangeText={setNewCatName}
                    placeholder="New Category Name"
                    placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={handleAdd}>
                    <Text style={[styles.addBtnText, { color: colors.background }]}>Add</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={outfitCategories}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.catName, { color: colors.text }]}>{item.name}</Text>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => handleDelete(item.id, item.name)}
                            >
                                <Ionicons name="trash" size={20} color={colors.error} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
    addSection: {
        flexDirection: 'row',
        padding: spacing.l,
        gap: spacing.m,
    },
    input: {
        borderWidth: 1,
        borderRadius: borderRadius.m,
        paddingHorizontal: spacing.m,
        height: 44,
        ...typography.body,
    },
    addBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        borderRadius: borderRadius.m,
    },
    addBtnText: {
        ...typography.body,
        fontWeight: 'bold',
    },
    list: { paddingHorizontal: spacing.l, paddingBottom: spacing.xxl },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.m,
        borderRadius: borderRadius.m,
        borderWidth: 1,
        marginBottom: spacing.s,
    },
    catName: { ...typography.body, fontWeight: '500', flex: 1 },
    actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
    actionBtn: { padding: spacing.xs },
});
