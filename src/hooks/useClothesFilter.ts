import { useMemo } from 'react';
import { Cloth } from '../types';

export type SortOption = 'name-asc' | 'name-desc' | 'newest' | 'oldest';

interface UseClothesFilterOptions {
    clothes: Cloth[];
    searchQuery?: string;
    selectedCategories?: string[];
    colorFilter?: string[];
    brandFilter?: string[];
    seasonFilter?: string;
    showFavoritesOnly?: boolean;
    sortOption?: SortOption;
}

export const useClothesFilter = ({
    clothes,
    searchQuery = '',
    selectedCategories = [],
    colorFilter = [],
    brandFilter = [],
    seasonFilter = 'All-Season',
    showFavoritesOnly = false,
    sortOption = 'newest',
}: UseClothesFilterOptions) => {
    return useMemo(() => {
        let filtered = clothes.filter(cloth => {
            // Category filter (multi-select - ANY match)
            if (selectedCategories.length > 0 && !selectedCategories.includes(cloth.categoryId)) {
                return false;
            }

            // Color filter (multi-select - ANY match)
            if (colorFilter.length > 0 && !colorFilter.some(color => 
                cloth.color.toLowerCase().includes(color.toLowerCase())
            )) {
                return false;
            }

            // Brand filter (multi-select - ANY match)
            if (brandFilter.length > 0 && !brandFilter.some(brand => 
                (cloth.brand || '').toLowerCase().includes(brand.toLowerCase())
            )) {
                return false;
            }

            // Season filter (single-select)
            if (seasonFilter !== 'All-Season' && cloth.season !== seasonFilter && cloth.season !== 'All-Season') {
                return false;
            }

            // Favorites filter
            if (showFavoritesOnly && !cloth.isFavorite) {
                return false;
            }

            // Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (
                    !cloth.name.toLowerCase().includes(query) &&
                    !cloth.color.toLowerCase().includes(query) &&
                    !(cloth.brand || '').toLowerCase().includes(query) &&
                    !(cloth.notes || '').toLowerCase().includes(query)
                ) {
                    return false;
                }
            }

            return true;
        });

        // Sorting
        switch (sortOption) {
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
        }

        return filtered;
    }, [clothes, searchQuery, selectedCategories, colorFilter, brandFilter, seasonFilter, showFavoritesOnly, sortOption]);
};
