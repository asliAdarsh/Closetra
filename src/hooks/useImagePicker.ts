import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';

export const useImagePicker = () => {
    const saveImageLocally = async (uri: string) => {
        try {
            const documentDirectory: string = FileSystem.documentDirectory as string;
            const imgDir = documentDirectory + 'images/';

            try {
                await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
            } catch (e) {
                // Directory likely exists, ignore
            }

            const filename = Crypto.randomUUID() + '.jpg';
            const newPath = imgDir + filename;

            await FileSystem.copyAsync({
                from: uri,
                to: newPath
            });

            return newPath;
        } catch (error) {
            console.error('Error saving image:', error);
            return uri;
        }
    };

    const pickImage = async (useCamera: boolean): Promise<string | null> => {
        try {
            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') return null;
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') return null;
            }

            const result = useCamera
                ? await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                })
                : await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                return await saveImageLocally(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
        return null;
    };

    return { pickImage };
};
