import { getDb } from '../database/db';
import { Trip, TripItem } from '../types';
import * as Crypto from 'expo-crypto';

const db = getDb();

export const tripRepository = {
    getAll: (): Trip[] => {
        return db.getAllSync<Trip>('SELECT * FROM Trips ORDER BY date DESC, time DESC');
    },

    getTripItems: (tripId: string): TripItem[] => {
        return db.getAllSync<TripItem>('SELECT * FROM TripItems WHERE tripId = ?', [tripId]);
    },

    add: (name: string, location: string, date: string, time: string, day: string, clothIds: string[]): Trip => {
        const id = Crypto.randomUUID();
        db.runSync(
            'INSERT INTO Trips (id, name, location, date, time, day) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, location, date, time, day]
        );

        for (const clothId of clothIds) {
            db.runSync('INSERT INTO TripItems (id, tripId, clothId, isPacked, isCollected) VALUES (?, ?, ?, 0, 0)', [Crypto.randomUUID(), id, clothId]);
        }

        return { id, name, location, date, time, day };
    },

    togglePacked: (tripItemId: string, isPacked: number): void => {
        db.runSync("UPDATE TripItems SET isPacked = ? WHERE id = ?", [isPacked, tripItemId]);
    },

    toggleCollected: (tripItemId: string, isCollected: number): void => {
        db.runSync("UPDATE TripItems SET isCollected = ? WHERE id = ?", [isCollected, tripItemId]);
    },

    delete: (id: string): void => {
        db.runSync("DELETE FROM TripItems WHERE tripId = ?", [id]);
        db.runSync("DELETE FROM Trips WHERE id = ?", [id]);
    }
};
