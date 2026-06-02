import { create } from 'zustand';
import { Trip, TripItem } from '../../../types';
import { tripRepository } from '../../../repositories/tripRepository';

interface TripsState {
    history: Trip[];
    isLoading: boolean;
    locationQuery: string;

    fetchData: () => void;
    addTrip: (name: string, location: string, date: string, time: string, day: string, notes: string, clothIds: string[]) => void;
    updateTrip: (id: string, name: string, location: string, date: string, time: string, day: string, notes: string, clothIds: string[]) => void;
    togglePacked: (tripItemId: string, isPacked: boolean) => void;
    toggleCollected: (tripItemId: string, isCollected: boolean) => void;
    collectAll: (tripId: string) => void;
    uncollectAll: (tripId: string) => void;
    getTripItems: (id: string) => TripItem[];
    deleteTrip: (id: string) => void;
    deleteMultiple: (ids: string[]) => void;
    setLocationQuery: (query: string) => void;
    clearFilters: () => void;
}

export const useTripsStore = create<TripsState>((set, get) => ({
    history: [],
    isLoading: false,
    locationQuery: '',

    fetchData: () => {
        set({ isLoading: true });
        try {
            const dbHistory = tripRepository.getAll();
            set({ history: dbHistory });
        } finally {
            set({ isLoading: false });
        }
    },

    addTrip: (name, location, date, time, day, notes, clothIds) => {
        tripRepository.add(name, location, date, time, day, notes, clothIds);
        get().fetchData();
    },

    updateTrip: (id, name, location, date, time, day, notes, clothIds) => {
        tripRepository.update(id, name, location, date, time, day, notes, clothIds);
        get().fetchData();
    },

    togglePacked: (tripItemId, isPacked) => {
        tripRepository.togglePacked(tripItemId, isPacked ? 1 : 0);
        get().fetchData();
    },

    toggleCollected: (tripItemId, isCollected) => {
        tripRepository.toggleCollected(tripItemId, isCollected ? 1 : 0);
        get().fetchData();
    },

    collectAll: (tripId) => {
        tripRepository.collectAll(tripId);
        get().fetchData();
    },

    uncollectAll: (tripId) => {
        tripRepository.uncollectAll(tripId);
        get().fetchData();
    },

    getTripItems: (id) => {
        return tripRepository.getTripItems(id);
    },

    deleteTrip: (id) => {
        tripRepository.delete(id);
        get().fetchData();
    },

    deleteMultiple: (ids) => {
        tripRepository.deleteMultiple(ids);
        get().fetchData();
    },

    setLocationQuery: (query) => set({ locationQuery: query }),
    clearFilters: () => set({ locationQuery: '' })
}));
