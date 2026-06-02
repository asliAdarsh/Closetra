import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ImagePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onPickCamera: () => void;
    onPickGallery: () => void;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
    visible, onClose, onPickCamera, onPickGallery
}) => {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.title, { color: colors.text }]}>Add Photo</Text>

                            <TouchableOpacity style={styles.option} onPress={onPickCamera}>
                                <Ionicons name="camera" size={24} color={colors.primary} />
                                <Text style={[styles.optionText, { color: colors.text }]}>Take Photo</Text>
                            </TouchableOpacity>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <TouchableOpacity style={styles.option} onPress={onPickGallery}>
                                <Ionicons name="images" size={24} color={colors.primary} />
                                <Text style={[styles.optionText, { color: colors.text }]}>Choose from Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.l,
        paddingBottom: spacing.xxl,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.l,
        textAlign: 'center',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.l,
    },
    optionText: {
        ...typography.body,
        marginLeft: spacing.m,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        width: '100%',
    }
});
