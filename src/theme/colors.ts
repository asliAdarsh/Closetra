// ─── Color Token Shape ───────────────────────────────────────────
export interface Colors {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    overlay: string;
}

// ─── Theme Definitions ──────────────────────────────────────────
export type ThemeName = 'Classic' | 'Ocean' | 'Forest' | 'Sunset' | 'Crimson' | 'Lavender' | 'Midnight';

export interface ThemeVariants {
    light: Colors;
    dark: Colors;
}

export const themes: Record<ThemeName, ThemeVariants> = {
    Classic: {
        light: {
            background: '#FAFAFC',
            surface: '#FFFFFF',
            primary: '#000000',
            accent: '#3A3A3C',
            text: '#111111',
            textSecondary: '#666668',
            border: '#EAEAEA',
            error: '#FF3B30',
            success: '#34C759',
            warning: '#FF9500',
            overlay: 'rgba(0,0,0,0.5)',
        },
        dark: {
            background: '#000000',
            surface: '#111111',
            primary: '#FFFFFF',
            accent: '#D1D1D6',
            text: '#F5F5F5',
            textSecondary: '#9A9A9E',
            border: '#2C2C2E',
            error: '#FF453A',
            success: '#32D74B',
            warning: '#FF9F0A',
            overlay: 'rgba(0,0,0,0.7)',
        },
    },

    Ocean: {
        light: {
            background: '#F0F7FF',
            surface: '#FFFFFF',
            primary: '#0A6DC4',
            accent: '#3B9EE0',
            text: '#0E1B2E',
            textSecondary: '#5A6E82',
            border: '#D6E6F5',
            error: '#E5484D',
            success: '#30A46C',
            warning: '#F5A623',
            overlay: 'rgba(10,109,196,0.35)',
        },
        dark: {
            background: '#0A1628',
            surface: '#112240',
            primary: '#64B5F6',
            accent: '#90CAF9',
            text: '#E1EEFF',
            textSecondary: '#8BA3BF',
            border: '#1E3A5F',
            error: '#FF6B6B',
            success: '#4ADE80',
            warning: '#FBBF24',
            overlay: 'rgba(0,10,30,0.7)',
        },
    },

    Forest: {
        light: {
            background: '#F4F9F4',
            surface: '#FFFFFF',
            primary: '#2D6A4F',
            accent: '#52B788',
            text: '#1B2E20',
            textSecondary: '#5E7A67',
            border: '#D1E8D5',
            error: '#E5484D',
            success: '#40916C',
            warning: '#E6A817',
            overlay: 'rgba(45,106,79,0.35)',
        },
        dark: {
            background: '#0D1F12',
            surface: '#162B1C',
            primary: '#95D5B2',
            accent: '#74C69D',
            text: '#E8F5E9',
            textSecondary: '#8FAF96',
            border: '#264D33',
            error: '#FF6B6B',
            success: '#52B788',
            warning: '#FBBF24',
            overlay: 'rgba(13,31,18,0.7)',
        },
    },

    Sunset: {
        light: {
            background: '#FFF3E0',
            surface: '#FFFFFF',
            primary: '#F57C00',
            accent: '#FFB74D',
            text: '#3E2723',
            textSecondary: '#6D4C41',
            border: '#FFE0B2',
            error: '#D32F2F',
            success: '#388E3C',
            warning: '#FBC02D',
            overlay: 'rgba(245,124,0,0.3)',
        },
        dark: {
            background: '#3E2723',
            surface: '#4E342E',
            primary: '#FFB74D',
            accent: '#FFE0B2',
            text: '#EFEBE9',
            textSecondary: '#BCAAA4',
            border: '#5D4037',
            error: '#EF5350',
            success: '#66BB6A',
            warning: '#FFCE56',
            overlay: 'rgba(62,39,35,0.7)',
        },
    },

    Crimson: {
        light: {
            background: '#FFF5F5',
            surface: '#FFFFFF',
            primary: '#C0392B',
            accent: '#E74C3C',
            text: '#2C1111',
            textSecondary: '#7A4A4A',
            border: '#F0BBBB',
            error: '#E74C3C',
            success: '#27AE60',
            warning: '#F1C40F',
            overlay: 'rgba(192,57,43,0.3)',
        },
        dark: {
            background: '#2C1111',
            surface: '#411F1F',
            primary: '#E74C3C',
            accent: '#F1948A',
            text: '#F8EBEB',
            textSecondary: '#B98F8F',
            border: '#5C3232',
            error: '#E74C3C',
            success: '#2ECC71',
            warning: '#F1C40F',
            overlay: 'rgba(44,17,17,0.7)',
        },
    },

    Lavender: {
        light: {
            background: '#F9F5FF',
            surface: '#FFFFFF',
            primary: '#764ABC',
            accent: '#9A6BDB',
            text: '#2D1B4E',
            textSecondary: '#725E97',
            border: '#E8DDF5',
            error: '#E74C3C',
            success: '#2ECC71',
            warning: '#F1C40F',
            overlay: 'rgba(118,74,188,0.3)',
        },
        dark: {
            background: '#1A102D',
            surface: '#2D1B4E',
            primary: '#9A6BDB',
            accent: '#B88CEB',
            text: '#F2EBFA',
            textSecondary: '#9C8ABF',
            border: '#3F276D',
            error: '#E74C3C',
            success: '#2ECC71',
            warning: '#F1C40F',
            overlay: 'rgba(26,16,45,0.7)',
        },
    },

    Midnight: {
        light: {
            background: '#F0F1F5',
            surface: '#FFFFFF',
            primary: '#1A1A2E',
            accent: '#16213E',
            text: '#0D0D17',
            textSecondary: '#4A4A68',
            border: '#D0D0E0',
            error: '#E53935',
            success: '#43A047',
            warning: '#FBC02D',
            overlay: 'rgba(26,26,46,0.3)',
        },
        dark: {
            background: '#0F0F1A',
            surface: '#1A1A2E',
            primary: '#E94560',
            accent: '#FF7B93',
            text: '#E0E0E6',
            textSecondary: '#8B8B9E',
            border: '#2C2C46',
            error: '#FF5252',
            success: '#69F0AE',
            warning: '#FFD54F',
            overlay: 'rgba(15,15,26,0.8)',
        },
    },
};

// ─── Backwards-compatible exports ───────────────────────────────
export const lightColors: Colors = themes.Classic.light;
export const darkColors: Colors = themes.Classic.dark;
