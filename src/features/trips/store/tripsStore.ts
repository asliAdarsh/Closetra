import { create } from 'zustand';
import { Trip, TripItem } from '../../../types';
import { tripRepository } from '../../../repositories/tripRepository';

interface TripsState {
    history: Trip[];
    isLoading: boolean;

    fetchData: () => void;
    addTrip: (name: string, location: string, date: string, time: string, day: string, clothIds: string[]) => void;
    togglePacked: (tripItemId: string, isPacked: boolean) => void;
    toggleCollected: (tripItemId: string, isCollected: boolean) => void;
    getTripItems: (id: string) => TripItem[];
    deleteTrip: (id: string) => void;
}

export const useTripsStore = create<TripsState>((set, get) => ({
    history: [],
    isLoading: false,

    fetchData: () => {
        set({ isLoading: true });
        try {
            const dbHistory = tripRepository.getAll();
            set({ history: dbHistory });
        } finally {
            set({ isLoading: false });
        }
    },

    addTrip: (name, location, date, time, day, clothIds) => {
        tripRepository.add(name, location, date, time, day, clothIds);
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

    getTripItems: (id) => {
        return tripRepository.getTripItems(id);
    },

    deleteTrip: (id) => {
        tripRepository.delete(id);
        get().fetchData();
    }
}));
