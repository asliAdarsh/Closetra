import { create } from 'zustand';
import { Laundry, LaundryItem } from '../../../types';
import { laundryRepository } from '../../../repositories/laundryRepository';

interface LaundryState {
    history: Laundry[];
    clothesInLaundry: string[];
    isLoading: boolean;

    fetchData: () => void;
    addLaundry: (date: string, time: string, day: string, note: string, clothIds: string[]) => void;
    markReturned: (id: string) => void;
    getLaundryItems: (id: string) => LaundryItem[];
}

export const useLaundryStore = create<LaundryState>((set, get) => ({
    history: [],
    clothesInLaundry: [],
    isLoading: false,

    fetchData: () => {
        set({ isLoading: true });
        try {
            const dbHistory = laundryRepository.getAll();
            const inLaundryIds = laundryRepository.getClothesInLaundry();
            set({ history: dbHistory, clothesInLaundry: inLaundryIds });
        } finally {
            set({ isLoading: false });
        }
    },

    addLaundry: (date, time, day, note, clothIds) => {
        laundryRepository.add(date, time, day, note, clothIds);
        get().fetchData();
    },

    markReturned: (id) => {
        laundryRepository.markReturned(id);
        get().fetchData();
    },

    getLaundryItems: (id) => {
        return laundryRepository.getLaundryItems(id);
    }
}));
