import { getDb } from '../database/db';
import { Cloth } from '../types';
import * as Crypto from 'expo-crypto';

const db = getDb();

export const clothesRepository = {
    getAll: (): Cloth[] => {
        return db.getAllSync<Cloth>('SELECT * FROM Clothes ORDER BY createdAt DESC');
    },

    add: (cloth: Omit<Cloth, 'id' | 'createdAt'>): Cloth => {
        const id = Crypto.randomUUID();
        const now = new Date().toISOString();

        db.runSync(
            `INSERT INTO Clothes (id, name, imagePath, categoryId, color, brand, season, notes, isFavorite, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, cloth.name, cloth.imagePath, cloth.categoryId, cloth.color, cloth.brand || '', cloth.season, cloth.notes || '', cloth.isFavorite, now]
        );

        return { ...cloth, id, createdAt: now };
    },

    update: (id: string, updates: Partial<Omit<Cloth, 'id' | 'createdAt'>>): void => {
        const fields: string[] = [];
        const values: any[] = [];

        for (const [key, value] of Object.entries(updates)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        if (fields.length === 0) return;

        values.push(id);
        db.runSync(`UPDATE Clothes SET ${fields.join(', ')} WHERE id = ?`, values);
    },

    delete: (id: string): void => {
        db.runSync('DELETE FROM TripItems WHERE clothId = ?', [id]);
        db.runSync('DELETE FROM LaundryItems WHERE clothId = ?', [id]);
        db.runSync('DELETE FROM Clothes WHERE id = ?', [id]);
    },

    deleteMultiple: (ids: string[]): void => {
        for (const id of ids) {
            db.runSync('DELETE FROM TripItems WHERE clothId = ?', [id]);
            db.runSync('DELETE FROM LaundryItems WHERE clothId = ?', [id]);
            db.runSync('DELETE FROM Clothes WHERE id = ?', [id]);
        }
    },

    moveToCategory: (ids: string[], categoryId: string): void => {
        for (const id of ids) {
            db.runSync('UPDATE Clothes SET categoryId = ? WHERE id = ?', [categoryId, id]);
        }
    }
};
