import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ConfirmDialogProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    visible, title, message, confirmText = 'Confirm', cancelText = 'Cancel',
    isDestructive = false, onConfirm, onCancel
}) => {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                            <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.button} onPress={onCancel}>
                                    <Text style={[styles.buttonText, { color: colors.primary }]}>{cancelText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                                    <Text style={[
                                        styles.buttonText,
                                        { color: isDestructive ? colors.error : colors.primary, fontWeight: 'bold' }
                                    ]}>
                                        {confirmText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    dialog: {
        width: '100%',
        borderRadius: borderRadius.xl,
        padding: spacing.l,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.s,
    },
    message: {
        ...typography.body,
        marginBottom: spacing.l,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.m,
    },
    button: {
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: borderRadius.m,
    },
    buttonText: {
        ...typography.button,
    }
});
