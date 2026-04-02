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

    markReturned: (id: string): void => {
        db.runSync("UPDATE Laundry SET status = 'Returned' WHERE id = ?", [id]);
    },

    getClothesInLaundry: (): string[] => {
        const items = db.getAllSync<{ clothId: string }>(
            `SELECT li.clothId FROM LaundryItems li 
       JOIN Laundry l ON li.laundryId = l.id 
       WHERE l.status = 'Given'`
        );
        return items.map(i => i.clothId);
    }
};
