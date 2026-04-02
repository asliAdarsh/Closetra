import { create } from 'zustand';
import { Outfit, OutfitItem } from '../../../types';
import { outfitRepository } from '../../../repositories/outfitRepository';

interface OutfitsState {
    outfits: Outfit[];
    isLoading: boolean;

    fetchData: () => void;
    addOutfit: (name: string, notes: string, clothIds: string[]) => void;
    updateOutfit: (id: string, name: string, notes: string, clothIds: string[]) => void;
    toggleFavorite: (id: string, isFavorite: boolean) => void;
    getOutfitItems: (id: string) => OutfitItem[];
    deleteOutfit: (id: string) => void;
}

export const useOutfitsStore = create<OutfitsState>((set, get) => ({
    outfits: [],
    isLoading: false,

    fetchData: () => {
        set({ isLoading: true });
        try {
            const dbOutfits = outfitRepository.getAll();
            set({ outfits: dbOutfits });
        } finally {
            set({ isLoading: false });
        }
    },

    addOutfit: (name, notes, clothIds) => {
        outfitRepository.add(name, notes, clothIds);
        get().fetchData();
    },

    updateOutfit: (id, name, notes, clothIds) => {
        outfitRepository.update(id, name, notes, clothIds);
        get().fetchData();
    },

    toggleFavorite: (id, isFavorite) => {
        outfitRepository.toggleFavorite(id, isFavorite ? 1 : 0);
        get().fetchData();
    },

    getOutfitItems: (id) => {
        return outfitRepository.getOutfitItems(id);
    },

    deleteOutfit: (id) => {
        outfitRepository.delete(id);
        get().fetchData();
    }
}));
