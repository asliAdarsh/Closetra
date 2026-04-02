export const lightColors = {
    background: '#FAFAFC', // Slightly cooler white
    surface: '#FFFFFF',
    primary: '#000000', // Black as primary for minimalist look
    text: '#111111',
    textSecondary: '#666668',
    border: '#EAEAEA',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors = {
    background: '#000000', // True black
    surface: '#111111', // Very dark grey
    primary: '#FFFFFF', // White as primary for dark mode
    text: '#F5F5F5',
    textSecondary: '#9A9A9E',
    border: '#2C2C2E',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    overlay: 'rgba(0,0,0,0.7)',
};

export type Colors = typeof lightColors;
