import { create } from 'zustand';
import { Laundry, LaundryItem } from '../../../types';
import { laundryRepository } from '../../../repositories/laundryRepository';

interface LaundryState {
    history: Laundry[];
    clothesInLaundry: string[];
    isLoading: boolean;
    statusFilter: string;

    fetchData: () => void;
    addLaundry: (date: string, time: string, day: string, note: string, clothIds: string[]) => void;
    updateLaundry: (id: string, date: string, time: string, day: string, note: string, clothIds: string[]) => void;
    markReturned: (id: string) => void;
    markMultipleReturned: (ids: string[]) => void;
    deleteLaundry: (id: string) => void;
    deleteMultiple: (ids: string[]) => void;
    getLaundryItems: (id: string) => LaundryItem[];
    setStatusFilter: (status: string) => void;
    clearFilters: () => void;
}

export const useLaundryStore = create<LaundryState>((set, get) => ({
    history: [],
    clothesInLaundry: [],
    isLoading: false,
    statusFilter: 'All',

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

    updateLaundry: (id, date, time, day, note, clothIds) => {
        laundryRepository.update(id, date, time, day, note, clothIds);
        get().fetchData();
    },

    markReturned: (id) => {
        laundryRepository.markReturned(id);
        get().fetchData();
    },

    markMultipleReturned: (ids) => {
        laundryRepository.markMultipleReturned(ids);
        get().fetchData();
    },

    deleteLaundry: (id) => {
        laundryRepository.delete(id);
        get().fetchData();
    },

    deleteMultiple: (ids) => {
        laundryRepository.deleteMultiple(ids);
        get().fetchData();
    },

    setStatusFilter: (status) => set({ statusFilter: status }),
    clearFilters: () => set({ statusFilter: 'All' }),

    getLaundryItems: (id) => {
        return laundryRepository.getLaundryItems(id);
    }
}));
