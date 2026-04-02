import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { getDb } from '../database/db';

export const exportData = async () => {
    const db = getDb();
    const tables = ['Categories', 'Clothes', 'Laundry', 'LaundryItems', 'Trips', 'TripItems', 'Outfits', 'AppSettings'];
    const backup: any = {};

    for (const table of tables) {
        const data = db.getAllSync(`SELECT * FROM ${table}`);
        backup[table] = data;
    }

    const jsonString = JSON.stringify(backup);
    const documentDirectory: string = (FileSystem as any).documentDirectory;
    const fileUri = documentDirectory + 'closetra_backup.json';

    await FileSystem.writeAsStringAsync(fileUri, jsonString);

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
    }
};

export const importData = async (): Promise<boolean> => {
    const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return false;

    const fileUri = result.assets[0].uri;
    const jsonString = await FileSystem.readAsStringAsync(fileUri);
    const backup = JSON.parse(jsonString);

    const tables = ['Categories', 'Clothes', 'Laundry', 'LaundryItems', 'Trips', 'TripItems', 'Outfits', 'AppSettings'];
    const db = getDb();

    db.withTransactionSync(() => {
        for (const table of tables) {
            if (backup[table] && Array.isArray(backup[table])) {
                db.execSync(`DELETE FROM ${table}`);

                for (const row of backup[table]) {
                    const keys = Object.keys(row);
                    const placeholders = keys.map(() => '?').join(', ');
                    const safeValues = keys.map(k => row[k]);

                    db.runSync(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`, safeValues);
                }
            }
        }
    });

    return true;
};
