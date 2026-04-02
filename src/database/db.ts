import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export const dbName = 'closetra.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync(dbName);
  }
  return dbInstance;
}

export function initDatabase() {
  const db = getDb();

  db.execSync(`
    CREATE TABLE IF NOT EXISTS Categories (
      id TEXT PRIMARY KEY,
      name TEXT,
      isDefault INTEGER,
      createdAt TEXT
    );
    
    CREATE TABLE IF NOT EXISTS Clothes (
      id TEXT PRIMARY KEY,
      name TEXT,
      imagePath TEXT,
      categoryId TEXT,
      color TEXT,
      brand TEXT,
      season TEXT,
      notes TEXT,
      isFavorite INTEGER,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS Laundry (
      id TEXT PRIMARY KEY,
      date TEXT,
      time TEXT,
      day TEXT,
      note TEXT,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS LaundryItems (
      id TEXT PRIMARY KEY,
      laundryId TEXT,
      clothId TEXT
    );

    CREATE TABLE IF NOT EXISTS Trips (
      id TEXT PRIMARY KEY,
      name TEXT,
      location TEXT,
      date TEXT,
      time TEXT,
      day TEXT
    );

    CREATE TABLE IF NOT EXISTS TripItems (
      id TEXT PRIMARY KEY,
      tripId TEXT,
      clothId TEXT,
      isPacked INTEGER,
      isCollected INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS Outfits (
      id TEXT PRIMARY KEY,
      name TEXT,
      notes TEXT,
      isFavorite INTEGER
    );

    CREATE TABLE IF NOT EXISTS OutfitItems (
      id TEXT PRIMARY KEY,
      outfitId TEXT,
      clothId TEXT
    );

    CREATE TABLE IF NOT EXISTS AppSettings (
      id TEXT PRIMARY KEY,
      theme TEXT,
      animationsEnabled INTEGER,
      gridColumns INTEGER,
      defaultSeason TEXT,
      defaultCategoryId TEXT,
      autoReturnDays INTEGER
    );
  `);

  try {
    db.execSync(`ALTER TABLE Clothes ADD COLUMN name TEXT DEFAULT ''`);
  } catch (e) {
    // Column already exists, ignore error
  }

  try {
    db.execSync(`ALTER TABLE TripItems ADD COLUMN isCollected INTEGER DEFAULT 0`);
  } catch (e) {
    // Column already exists, ignore error
  }

  try {
    db.execSync(`ALTER TABLE Outfits ADD COLUMN name TEXT DEFAULT 'My Outfit'`);
    db.execSync(`ALTER TABLE Outfits ADD COLUMN notes TEXT DEFAULT ''`);

    // Migrate existing old data if topId exists (this implies we just added name/notes to an old schema)
    try {
      const legacyOutfits = db.getAllSync<any>('SELECT id, topId, bottomId, footwearId FROM Outfits WHERE topId IS NOT NULL');

      for (const outfit of legacyOutfits) {
        // Insert each piece into OutfitItems
        if (outfit.topId) {
          db.runSync('INSERT INTO OutfitItems (id, outfitId, clothId) VALUES (?, ?, ?)', [Crypto.randomUUID(), outfit.id, outfit.topId]);
        }
        if (outfit.bottomId) {
          db.runSync('INSERT INTO OutfitItems (id, outfitId, clothId) VALUES (?, ?, ?)', [Crypto.randomUUID(), outfit.id, outfit.bottomId]);
        }
        if (outfit.footwearId) {
          db.runSync('INSERT INTO OutfitItems (id, outfitId, clothId) VALUES (?, ?, ?)', [Crypto.randomUUID(), outfit.id, outfit.footwearId]);
        }
      }
    } catch (migrateErr) {
      console.log("Migration or query failed, likely already migrated", migrateErr);
    }
  } catch (e) {
    // Columns already exist, this isn't the first run after update
  }

  seedDefaultCategories(db);
  seedDefaultSettings(db);
}

function seedDefaultCategories(db: SQLite.SQLiteDatabase) {
  const result = db.getFirstSync<{ count: number }>("SELECT COUNT(*) as count FROM Categories");

  if (result && result.count === 0) {
    const defaultCategories = ['Shirt', 'T-shirt', 'Jeans', 'Pants', 'Jacket', 'Shoes', 'Shorts', 'Hoodie'];
    const now = new Date().toISOString();

    for (const name of defaultCategories) {
      db.runSync("INSERT INTO Categories (id, name, isDefault, createdAt) VALUES (?, ?, ?, ?)", [Crypto.randomUUID(), name, 1, now]);
    }
  }
}

function seedDefaultSettings(db: SQLite.SQLiteDatabase) {
  const result = db.getFirstSync<{ count: number }>("SELECT COUNT(*) as count FROM AppSettings");
  if (result && result.count === 0) {
    db.runSync(
      `INSERT INTO AppSettings (id, theme, animationsEnabled, gridColumns, defaultSeason, defaultCategoryId, autoReturnDays) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['settings', 'System', 1, 2, 'All-Season', '', 7]
    );
  }
}
