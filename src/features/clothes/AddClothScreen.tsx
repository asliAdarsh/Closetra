import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useClothesStore } from './store/clothesStore';
import { useTheme } from '../../theme/ThemeContext';
import { ImagePickerModal } from '../../components/ImagePickerModal';
import { useImagePicker } from '../../hooks/useImagePicker';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useOutfitsStore } from '../outfits/store/outfitsStore';
import { OutfitCard } from '../../components/OutfitCard';
import { LayoutAnimation } from 'react-native';

export default function AddClothScreen({ route }: any) {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { categories, addCloth, updateCloth, clothes, deleteCloth } = useClothesStore();
    const { pickImage } = useImagePicker();

    const editId = route.params?.id;
    const existingCloth = editId ? clothes.find(c => c.id === editId) : null;

    const { outfits, toggleFavorite, getOutfitItems } = useOutfitsStore();
    const relatedOutfits = React.useMemo(() => {
        if (!existingCloth) return [];
        return outfits.filter(o => {
            const items = getOutfitItems(o.id);
            return items.some(item => item.clothId === existingCloth.id);
        });
    }, [outfits, existingCloth, getOutfitItems]);

    const [imagePath, setImagePath] = useState(existingCloth?.imagePath || '');
    const [name, setName] = useState(existingCloth?.name || '');
    const [categoryId, setCategoryId] = useState(existingCloth?.categoryId || (categories.length > 0 ? categories[0].id : ''));
    const [color, setColor] = useState(existingCloth?.color || '');
    const [brand, setBrand] = useState(existingCloth?.brand || '');
    const [season, setSeason] = useState(existingCloth?.season || 'All-Season');
    const [notes, setNotes] = useState(existingCloth?.notes || '');
    const [isFavorite, setIsFavorite] = useState(existingCloth?.isFavorite === 1);

    const [pickerVisible, setPickerVisible] = useState(false);

    const handleSave = () => {
        if (!name.trim()) {
            alert("Please provide a name for this cloth.");
            return;
        }
        if (!imagePath || !categoryId || !color) {
            alert("Please provide an image, category, and color.");
            return;
        }

        const payload = {
            name: name.trim(),
            imagePath,
            categoryId,
            color,
            brand,
            season,
            notes,
            isFavorite: isFavorite ? 1 : 0
        };

        if (existingCloth) {
            updateCloth(existingCloth.id, payload);
        } else {
            addCloth(payload);
        }
        navigation.goBack();
    };

    const handlePick = async (useCamera: boolean) => {
        setPickerVisible(false);
        const uri = await pickImage(useCamera);
        if (uri) setImagePath(uri);
    };

    const handleDelete = () => {
        if (existingCloth) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert(
                'Delete Item',
                'Are you sure you want to permanently delete this item? This cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            deleteCloth(existingCloth.id);
                            navigation.goBack();
                        },
                    },
                ]
            );
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Ionicons name="close" size={28} color={colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text }]}>{existingCloth ? 'Edit Item' : 'Add Item'}</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={[styles.saveBtn, { color: colors.primary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <TouchableOpacity
                    style={[styles.imageContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setPickerVisible(true)}
                >
                    {imagePath ? (
                        <Image source={{ uri: imagePath }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="camera-outline" size={40} color={colors.textSecondary} />
                            <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Tap to add photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={[styles.label, { color: colors.text }]}>Name</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Favorite Blue Shirt"
                    placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.label, { color: colors.text }]}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
                    {categories.map(c => (
                        <TouchableOpacity
                            key={c.id}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: categoryId === c.id ? colors.primary : colors.surface,
                                    borderColor: categoryId === c.id ? colors.primary : colors.border
                                }
                            ]}
                            onPress={() => setCategoryId(c.id)}
                        >
                            <Text style={{ color: categoryId === c.id ? colors.background : colors.text }}>{c.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={[styles.label, { color: colors.text }]}>Color</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={color}
                    onChangeText={setColor}
                    placeholder="e.g. Navy Blue"
                    placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.label, { color: colors.text }]}>Brand (Optional)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={brand}
                    onChangeText={setBrand}
                    placeholder="e.g. Nike, H&M"
                    placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.label, { color: colors.text }]}>Season</Text>
                <View style={styles.seasonRow}>
                    {['All-Season', 'Summer', 'Winter'].map(s => (
                        <TouchableOpacity
                            key={s}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: season === s ? colors.primary : colors.surface,
                                    borderColor: season === s ? colors.primary : colors.border
                                }
                            ]}
                            onPress={() => setSeason(s)}
                        >
                            <Text style={{ color: season === s ? colors.background : colors.text }}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.label, { color: colors.text }]}>Notes (Optional)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, height: 80 }]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="e.g. Needs delicate wash"
                    placeholderTextColor={colors.textSecondary}
                    multiline
                />

                <View style={styles.switchRow}>
                    <Text style={[styles.label, { color: colors.text, marginTop: 0, marginBottom: 0 }]}>Mark as Favorite</Text>
                    <Switch value={isFavorite} onValueChange={setIsFavorite} trackColor={{ true: colors.primary }} />
                </View>

                {existingCloth && (
                    <>
                        {relatedOutfits.length > 0 && (
                            <View style={styles.relatedSection}>
                                <Text style={[styles.label, { color: colors.text, marginBottom: spacing.m }]}>Related Outfits</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedOutfitsRow}>
                                    {relatedOutfits.map((outfit) => {
                                        const outfitItems = getOutfitItems(outfit.id);
                                        const outfitClothes = outfitItems
                                            .map(i => clothes.find(c => c.id === i.clothId))
                                            .filter(Boolean) as any[];

                                        return (
                                            <View key={outfit.id} style={styles.relatedOutfitCard}>
                                                <OutfitCard
                                                    outfit={outfit}
                                                    items={outfitClothes}
                                                    onPress={() => navigation.navigate('OutfitDetail', { id: outfit.id })}
                                                    onToggleFavorite={(id, isFav) => {
                                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                        toggleFavorite(id, isFav);
                                                    }}
                                                />
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        )}
                        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={20} color={colors.error} />
                            <Text style={[styles.deleteText, { color: colors.error }]}>Delete Item</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            <ImagePickerModal
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                onPickCamera={() => handlePick(true)}
                onPickGallery={() => handlePick(false)}
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
    form: { padding: spacing.l, paddingBottom: 100 },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: borderRadius.l,
        borderWidth: 1,
        borderStyle: 'dashed',
        overflow: 'hidden',
        marginBottom: spacing.l,
    },
    image: { width: '100%', height: '100%' },
    imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    label: { ...typography.body, fontWeight: 'bold', marginBottom: spacing.s, marginTop: spacing.m },
    input: {
        borderWidth: 1,
        borderRadius: borderRadius.m,
        padding: spacing.m,
        ...typography.body,
    },
    chipsRow: { flexDirection: 'row', marginBottom: spacing.m },
    seasonRow: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.m },
    chip: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        marginRight: spacing.s,
    },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.l },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xxl,
        padding: spacing.m,
    },
    deleteText: {
        ...typography.body,
        fontWeight: 'bold',
        marginLeft: spacing.s,
    },
    relatedSection: {
        marginTop: spacing.xl,
        paddingTop: spacing.l,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    relatedOutfitsRow: {
        gap: spacing.m,
        paddingRight: spacing.m,
    },
    relatedOutfitCard: {
        width: 160,
    }
});
