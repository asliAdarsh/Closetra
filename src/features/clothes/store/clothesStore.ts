import { create } from 'zustand';
import { Cloth, Category } from '../../../types';
import { clothesRepository } from '../../../repositories/clothesRepository';
import { categoryRepository } from '../../../repositories/categoryRepository';

interface ClothesState {
    clothes: Cloth[];
    categories: Category[];
    searchQuery: string;
    seasonFilter: string;
    showFavoritesOnly: boolean;
    selectedCategoryId: string | null;
    isLoading: boolean;

    // Actions
    setSearchQuery: (query: string) => void;
    setSeasonFilter: (season: string) => void;
    setShowFavoritesOnly: (show: boolean) => void;
    setSelectedCategory: (id: string | null) => void;

    // Data Fetching
    fetchData: () => void;

    // Mutations
    addCloth: (cloth: Omit<Cloth, 'id' | 'createdAt'>) => void;
    updateCloth: (id: string, updates: Partial<Omit<Cloth, 'id' | 'createdAt'>>) => void;
    deleteCloth: (id: string) => void;

    addCategory: (name: string) => void;
    updateCategory: (id: string, name: string) => void;
    deleteCategory: (id: string) => void;
}

export const useClothesStore = create<ClothesState>((set, get) => ({
    clothes: [],
    categories: [],
    searchQuery: '',
    seasonFilter: 'All-Season',
    showFavoritesOnly: false,
    selectedCategoryId: null,
    isLoading: false,

    setSearchQuery: (query) => set({ searchQuery: query }),
    setSeasonFilter: (season) => set({ seasonFilter: season }),
    setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
    setSelectedCategory: (id) => set({ selectedCategoryId: id }),

    fetchData: () => {
        set({ isLoading: true });
        try {
            const dbCategories = categoryRepository.getAll();
            const dbClothes = clothesRepository.getAll();
            set({ categories: dbCategories, clothes: dbClothes });
        } finally {
            set({ isLoading: false });
        }
    },

    addCloth: (cloth) => {
        clothesRepository.add(cloth);
        get().fetchData();
    },

    updateCloth: (id, updates) => {
        clothesRepository.update(id, updates);
        get().fetchData();
    },

    deleteCloth: (id) => {
        clothesRepository.delete(id);
        get().fetchData();
    },

    addCategory: (name) => {
        categoryRepository.add(name);
        get().fetchData();
    },

    updateCategory: (id, name) => {
        categoryRepository.update(id, name);
        get().fetchData();
    },

    deleteCategory: (id) => {
        categoryRepository.delete(id);
        if (get().selectedCategoryId === id) {
            set({ selectedCategoryId: null });
        }
        get().fetchData();
    }
}));
