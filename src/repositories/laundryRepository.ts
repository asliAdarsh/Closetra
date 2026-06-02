import { getDb } from '../database/db';
import { Laundry, LaundryItem } from '../types';
import * as Crypto from 'expo-crypto';

const db = getDb();

export const laundryRepository = {
    getAll: (): Laundry[] => {
        return db.getAllSync<Laundry>('SELECT * FROM Laundry ORDER BY date DESC, time DESC');
    },

    getLaundryItems: (laundryId: string): LaundryItem[] => {
        return db.getAllSync<LaundryItem>('SELECT * FROM LaundryItems WHERE laundryId = ?', [laundryId]);
    },

    add: (date: string, time: string, day: string, note: string, clothIds: string[]): Laundry => {
        const id = Crypto.randomUUID();
        db.runSync(
            'INSERT INTO Laundry (id, date, time, day, note, status) VALUES (?, ?, ?, ?, ?, ?)',
            [id, date, time, day, note, 'Given']
        );

        for (const clothId of clothIds) {
            db.runSync('INSERT INTO LaundryItems (id, laundryId, clothId) VALUES (?, ?, ?)', [Crypto.randomUUID(), id, clothId]);
        }

        return { id, date, time, day, note, status: 'Given' };
    },

    update: (id: string, date: string, time: string, day: string, note: string, clothIds: string[]): void => {
        try {
            // Update session metadata
            db.runSync(
                'UPDATE Laundry SET date = ?, time = ?, day = ?, note = ? WHERE id = ?',
                [date, time, day, note, id]
            );

            // Replace cloth items: delete old, insert new
            db.runSync('DELETE FROM LaundryItems WHERE laundryId = ?', [id]);

            for (const clothId of clothIds) {
                db.runSync(
                    'INSERT INTO LaundryItems (id, laundryId, clothId) VALUES (?, ?, ?)',
                    [Crypto.randomUUID(), id, clothId]
                );
            }
        } catch (error) {
            console.error('Failed to update laundry session:', error);
            throw error;
        }
    },

    markReturned: (id: string): void => {
        db.runSync("UPDATE Laundry SET status = 'Returned' WHERE id = ?", [id]);
    },

    delete: (id: string): void => {
        try {
            db.runSync('DELETE FROM LaundryItems WHERE laundryId = ?', [id]);
            db.runSync('DELETE FROM Laundry WHERE id = ?', [id]);
        } catch (error) {
            console.error('Failed to delete laundry session:', error);
            throw error;
        }
    },

    getClothesInLaundry: (): string[] => {
        const items = db.getAllSync<{ clothId: string }>(
            `SELECT li.clothId FROM LaundryItems li 
       JOIN Laundry l ON li.laundryId = l.id 
       WHERE l.status = 'Given'`
        );
        return items.map(i => i.clothId);
    },

    deleteMultiple: (ids: string[]): void => {
        for (const id of ids) {
            db.runSync('DELETE FROM LaundryItems WHERE laundryId = ?', [id]);
            db.runSync('DELETE FROM Laundry WHERE id = ?', [id]);
        }
    },

    markMultipleReturned: (ids: string[]): void => {
        for (const id of ids) {
            db.runSync("UPDATE Laundry SET status = 'Returned' WHERE id = ?", [id]);
        }
    }
};
