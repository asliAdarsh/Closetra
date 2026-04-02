import { create } from 'zustand';
import { Outfit, OutfitItem, OutfitCategory } from '../../../types';
import { outfitRepository } from '../../../repositories/outfitRepository';
import { outfitCategoryRepository } from '../../../repositories/outfitCategoryRepository';

interface OutfitsState {
    outfits: Outfit[];
    outfitCategories: OutfitCategory[];
    selectedOutfitCategoryId: string | null;
    searchQuery: string;
    showFavoritesOnly: boolean;
    isLoading: boolean;

    fetchData: () => void;
    addOutfit: (name: string, notes: string, clothIds: string[], categoryId?: string) => void;
    updateOutfit: (id: string, name: string, notes: string, clothIds: string[], categoryId?: string) => void;
    toggleFavorite: (id: string, isFavorite: boolean) => void;
    getOutfitItems: (id: string) => OutfitItem[];
    deleteOutfit: (id: string) => void;

    setSelectedOutfitCategory: (id: string | null) => void;
    setSearchQuery: (query: string) => void;
    setShowFavoritesOnly: (show: boolean) => void;
    addOutfitCategory: (name: string, icon: string) => void;
    deleteOutfitCategory: (id: string) => void;
}

export const useOutfitsStore = create<OutfitsState>((set, get) => ({
    outfits: [],
    outfitCategories: [],
    selectedOutfitCategoryId: null,
    searchQuery: '',
    showFavoritesOnly: false,
    isLoading: false,

    fetchData: () => {
        set({ isLoading: true });
        try {
            const dbOutfits = outfitRepository.getAll();
            const dbCategories = outfitCategoryRepository.getAll();
            set({ outfits: dbOutfits, outfitCategories: dbCategories });
        } finally {
            set({ isLoading: false });
        }
    },

    addOutfit: (name, notes, clothIds, categoryId) => {
        outfitRepository.add(name, notes, clothIds, categoryId);
        get().fetchData();
    },

    updateOutfit: (id, name, notes, clothIds, categoryId) => {
        outfitRepository.update(id, name, notes, clothIds, categoryId);
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
    },

    setSelectedOutfitCategory: (id) => set({ selectedOutfitCategoryId: id }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),

    addOutfitCategory: (name, icon) => {
        outfitCategoryRepository.add(name, icon);
        get().fetchData();
    },

    deleteOutfitCategory: (id) => {
        outfitCategoryRepository.delete(id);
        if (get().selectedOutfitCategoryId === id) {
            set({ selectedOutfitCategoryId: null });
        }
        get().fetchData();
    },
}));
