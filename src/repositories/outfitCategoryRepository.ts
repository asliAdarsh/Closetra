import { getDb } from '../database/db';
import { OutfitCategory } from '../types';
import * as Crypto from 'expo-crypto';

const db = getDb();

export const outfitCategoryRepository = {
    getAll: (): OutfitCategory[] => {
        return db.getAllSync<OutfitCategory>('SELECT * FROM OutfitCategories ORDER BY name ASC');
    },

    add: (name: string, icon: string): OutfitCategory => {
        const id = Crypto.randomUUID();
        db.runSync(
            'INSERT INTO OutfitCategories (id, name, icon) VALUES (?, ?, ?)',
            [id, name, icon]
        );
        return { id, name, icon };
    },

    update: (id: string, name: string, icon: string): void => {
        db.runSync(
            'UPDATE OutfitCategories SET name = ?, icon = ? WHERE id = ?',
            [name, icon, id]
        );
    },

    delete: (id: string): void => {
        // Unset categoryId on orphaned outfits
        db.runSync("UPDATE Outfits SET categoryId = '' WHERE categoryId = ?", [id]);
        db.runSync('DELETE FROM OutfitCategories WHERE id = ?', [id]);
    }
};
