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

    add: (name: string, location: string, date: string, time: string, day: string, notes: string, clothIds: string[]): Trip => {
        const id = Crypto.randomUUID();
        db.runSync(
            'INSERT INTO Trips (id, name, location, date, time, day, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, location, date, time, day, notes || '']
        );

        for (const clothId of clothIds) {
            db.runSync('INSERT INTO TripItems (id, tripId, clothId, isPacked, isCollected) VALUES (?, ?, ?, 0, 0)', [Crypto.randomUUID(), id, clothId]);
        }

        return { id, name, location, date, time, day, notes: notes || '' };
    },

    update: (id: string, name: string, location: string, date: string, time: string, day: string, notes: string, clothIds: string[]): void => {
        try {
            // Update trip metadata
            db.runSync(
                'UPDATE Trips SET name = ?, location = ?, date = ?, time = ?, day = ?, notes = ? WHERE id = ?',
                [name, location, date, time, day, notes || '', id]
            );

            // Replace trip items: delete old, insert new
            db.runSync('DELETE FROM TripItems WHERE tripId = ?', [id]);

            for (const clothId of clothIds) {
                db.runSync(
                    'INSERT INTO TripItems (id, tripId, clothId, isPacked, isCollected) VALUES (?, ?, ?, 0, 0)',
                    [Crypto.randomUUID(), id, clothId]
                );
            }
        } catch (error) {
            console.error('Failed to update trip:', error);
            throw error;
        }
    },

    togglePacked: (tripItemId: string, isPacked: number): void => {
        db.runSync("UPDATE TripItems SET isPacked = ? WHERE id = ?", [isPacked, tripItemId]);
    },

    toggleCollected: (tripItemId: string, isCollected: number): void => {
        db.runSync("UPDATE TripItems SET isCollected = ? WHERE id = ?", [isCollected, tripItemId]);
    },

    collectAll: (tripId: string): void => {
        try {
            db.runSync("UPDATE TripItems SET isPacked = 1 WHERE tripId = ?", [tripId]);
        } catch (error) {
            console.error('Failed to pack all items:', error);
            throw error;
        }
    },

    uncollectAll: (tripId: string): void => {
        try {
            db.runSync("UPDATE TripItems SET isPacked = 0 WHERE tripId = ?", [tripId]);
        } catch (error) {
            console.error('Failed to unpack all items:', error);
            throw error;
        }
    },

    delete: (id: string): void => {
        db.runSync("DELETE FROM TripItems WHERE tripId = ?", [id]);
        db.runSync("DELETE FROM Trips WHERE id = ?", [id]);
    },

    deleteMultiple: (ids: string[]): void => {
        for (const id of ids) {
            db.runSync("DELETE FROM TripItems WHERE tripId = ?", [id]);
            db.runSync("DELETE FROM Trips WHERE id = ?", [id]);
        }
    }
};
