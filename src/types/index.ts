export interface Category {
    id: string;
    name: string;
    isDefault: number;
    createdAt: string;
}

export interface Cloth {
    id: string;
    name: string;
    imagePath: string;
    categoryId: string;
    color: string;
    brand: string;
    season: string;
    notes: string;
    isFavorite: number;
    createdAt: string;
}

export interface Laundry {
    id: string;
    date: string;
    time: string;
    day: string;
    note: string;
    status: 'Given' | 'Returned';
}

export interface LaundryItem {
    id: string;
    laundryId: string;
    clothId: string;
}

export interface Trip {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
    day: string;
}

export interface TripItem {
    id: string;
    tripId: string;
    clothId: string;
    isPacked: number;
    isCollected: number;
}

export interface OutfitItem {
    id: string;
    outfitId: string;
    clothId: string;
}

export interface Outfit {
    id: string;
    name: string;
    notes: string;
    isFavorite: number;
}

export interface AppSettings {
    id: string;
    theme: 'Light' | 'Dark' | 'System';
    animationsEnabled: number;
    gridColumns: number;
    defaultSeason: string;
    defaultCategoryId: string;
    autoReturnDays: number;
}
