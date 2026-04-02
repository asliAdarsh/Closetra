import { getDb } from '../database/db';
import { Category } from '../types';
import * as Crypto from 'expo-crypto';

const db = getDb();

export const categoryRepository = {
    getAll: (): Category[] => {
        return db.getAllSync<Category>('SELECT * FROM Categories ORDER BY name ASC');
    },

    add: (name: string): Category => {
        const id = Crypto.randomUUID();
        const now = new Date().toISOString();
        db.runSync('INSERT INTO Categories (id, name, isDefault, createdAt) VALUES (?, ?, ?, ?)', [id, name, 0, now]);
        return { id, name, isDefault: 0, createdAt: now };
    },

    update: (id: string, name: string): void => {
        db.runSync('UPDATE Categories SET name = ? WHERE id = ?', [name, id]);
    },

    delete: (id: string): void => {
        const uncategorizedCheck = db.getFirstSync<{ id: string }>("SELECT id FROM Categories WHERE name = 'Uncategorized'");
        let uncategorizedId = uncategorizedCheck?.id;

        if (!uncategorizedId) {
            uncategorizedId = Crypto.randomUUID();
            db.runSync('INSERT INTO Categories (id, name, isDefault, createdAt) VALUES (?, ?, ?, ?)', [uncategorizedId, 'Uncategorized', 1, new Date().toISOString()]);
        }

        db.runSync('UPDATE Clothes SET categoryId = ? WHERE categoryId = ?', [uncategorizedId, id]);
        db.runSync('DELETE FROM Categories WHERE id = ?', [id]);
    },

    resetDefaults: (): void => {
        const defaultCategories = ['Shirt', 'T-shirt', 'Jeans', 'Pants', 'Jacket', 'Shoes', 'Shorts', 'Hoodie'];
        const now = new Date().toISOString();

        db.runSync('DELETE FROM Categories WHERE isDefault = 1');
        for (const name of defaultCategories) {
            db.runSync("INSERT INTO Categories (id, name, isDefault, createdAt) VALUES (?, ?, ?, ?)", [Crypto.randomUUID(), name, 1, now]);
        }
    }
};
