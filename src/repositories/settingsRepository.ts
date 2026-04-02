import { getDb } from '../database/db';
import { AppSettings } from '../types';

const db = getDb();

export const settingsRepository = {
    getSettings: (): AppSettings => {
        const s = db.getFirstSync<AppSettings>('SELECT * FROM AppSettings LIMIT 1');
        if (s) return s;
        return {
            id: 'settings',
            theme: 'System',
            themeName: 'Classic',
            gridColumns: 2,
            defaultSeason: 'All-Season',
            defaultCategoryId: '',
            autoReturnDays: 7
        };
    },

    updateSettings: (updates: Partial<AppSettings>): void => {
        const fields: string[] = [];
        const values: any[] = [];

        for (const [key, value] of Object.entries(updates)) {
            if (key !== 'id') {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) return;

        db.runSync(`UPDATE AppSettings SET ${fields.join(', ')} WHERE id = 'settings'`, values);
    }
};
