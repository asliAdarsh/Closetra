import { getDb } from '../database/db';
import { Outfit, OutfitItem } from '../types';
import * as Crypto from 'expo-crypto';

const db = getDb();

export const outfitRepository = {
    getAll: (): Outfit[] => {
        return db.getAllSync<Outfit>('SELECT * FROM Outfits');
    },

    getOutfitItems: (outfitId: string): OutfitItem[] => {
        return db.getAllSync<OutfitItem>('SELECT * FROM OutfitItems WHERE outfitId = ?', [outfitId]);
    },

    add: (name: string, notes: string, clothIds: string[], categoryId?: string): Outfit => {
        const id = Crypto.randomUUID();
        db.runSync(
            'INSERT INTO Outfits (id, name, notes, isFavorite, categoryId) VALUES (?, ?, ?, ?, ?)',
            [id, name, notes, 0, categoryId || '']
        );
        for (const clothId of clothIds) {
            db.runSync('INSERT INTO OutfitItems (id, outfitId, clothId) VALUES (?, ?, ?)', [Crypto.randomUUID(), id, clothId]);
        }
        return { id, name, notes, isFavorite: 0, categoryId: categoryId || '' };
    },

    toggleFavorite: (id: string, isFavorite: number): void => {
        db.runSync('UPDATE Outfits SET isFavorite = ? WHERE id = ?', [isFavorite, id]);
    },

    update: (id: string, name: string, notes: string, clothIds: string[], categoryId?: string): void => {
        db.runSync(
            'UPDATE Outfits SET name = ?, notes = ?, categoryId = ? WHERE id = ?',
            [name, notes, categoryId || '', id]
        );
        db.runSync('DELETE FROM OutfitItems WHERE outfitId = ?', [id]);
        for (const clothId of clothIds) {
            db.runSync('INSERT INTO OutfitItems (id, outfitId, clothId) VALUES (?, ?, ?)', [Crypto.randomUUID(), id, clothId]);
        }
    },

    delete: (id: string): void => {
        db.runSync('DELETE FROM OutfitItems WHERE outfitId = ?', [id]);
        db.runSync('DELETE FROM Outfits WHERE id = ?', [id]);
    },

    deleteMultiple: (ids: string[]): void => {
        for (const id of ids) {
            db.runSync('DELETE FROM OutfitItems WHERE outfitId = ?', [id]);
            db.runSync('DELETE FROM Outfits WHERE id = ?', [id]);
        }
    },

    moveToCategory: (ids: string[], categoryId: string): void => {
        for (const id of ids) {
            db.runSync('UPDATE Outfits SET categoryId = ? WHERE id = ?', [categoryId, id]);
        }
    }
};
