// ─── Color Token Shape ───────────────────────────────────────────
export interface Colors {
    background: string;
    surface: string;
    surfaceAlt: string;
    primary: string;
    accent: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    error: string;
    success: string;
    warning: string;
    overlay: string;
}

// ─── Theme Definitions ──────────────────────────────────────────
export type ThemeName = 'Minimal' | 'Ocean' | 'Forest' | 'Sunset' | 'Crimson' | 'Lavender' | 'Midnight';

export interface ThemeVariants {
    light: Colors;
    dark: Colors;
}

export const themes: Record<ThemeName, ThemeVariants> = {
    // ── Minimal ─────────────────────────────────────────────────
    Minimal: {
        light: {
            background: '#F8F8F6',
            surface: '#FFFFFF',
            surfaceAlt: '#F2F2F0',
            primary: '#1A1A1A',
            accent: '#6B6B6B',
            text: '#1A1A1A',
            textSecondary: '#7C7C7A',
            textTertiary: '#B0B0AE',
            border: '#E5E5E2',
            borderLight: '#F0F0EE',
            error: '#D95C5C',
            success: '#5B8C5A',
            warning: '#C4955A',
            overlay: 'rgba(26,26,26,0.4)',
        },
        dark: {
            background: '#131313',
            surface: '#1C1C1C',
            surfaceAlt: '#242424',
            primary: '#EDEDED',
            accent: '#8A8A8A',
            text: '#EDEDED',
            textSecondary: '#7E7E7E',
            textTertiary: '#555555',
            border: '#2A2A2A',
            borderLight: '#222222',
            error: '#CF6679',
            success: '#5B8C5A',
            warning: '#C4955A',
            overlay: 'rgba(0,0,0,0.6)',
        },
    },

    // ── Ocean ───────────────────────────────────────────────────
    Ocean: {
        light: {
            background: '#F0F7FF',
            surface: '#FFFFFF',
            surfaceAlt: '#E8F1FC',
            primary: '#0A6DC4',
            accent: '#3B9EE0',
            text: '#0E1B2E',
            textSecondary: '#5A6E82',
            textTertiary: '#8DA3B8',
            border: '#D6E6F5',
            borderLight: '#E8F1FC',
            error: '#E5484D',
            success: '#30A46C',
            warning: '#F5A623',
            overlay: 'rgba(10,109,196,0.35)',
        },
        dark: {
            background: '#0A1628',
            surface: '#112240',
            surfaceAlt: '#1A2D4A',
            primary: '#64B5F6',
            accent: '#90CAF9',
            text: '#E1EEFF',
            textSecondary: '#8BA3BF',
            textTertiary: '#5A7A9A',
            border: '#1E3A5F',
            borderLight: '#162D4A',
            error: '#FF6B6B',
            success: '#4ADE80',
            warning: '#FBBF24',
            overlay: 'rgba(0,10,30,0.7)',
        },
    },

    // ── Forest ──────────────────────────────────────────────────
    Forest: {
        light: {
            background: '#F4F9F4',
            surface: '#FFFFFF',
            surfaceAlt: '#ECF5EC',
            primary: '#2D6A4F',
            accent: '#52B788',
            text: '#1B2E20',
            textSecondary: '#5E7A67',
            textTertiary: '#8AA892',
            border: '#D1E8D5',
            borderLight: '#E4F0E6',
            error: '#E5484D',
            success: '#40916C',
            warning: '#E6A817',
            overlay: 'rgba(45,106,79,0.35)',
        },
        dark: {
            background: '#0D1F12',
            surface: '#162B1C',
            surfaceAlt: '#1E3826',
            primary: '#95D5B2',
            accent: '#74C69D',
            text: '#E8F5E9',
            textSecondary: '#8FAF96',
            textTertiary: '#608A6A',
            border: '#264D33',
            borderLight: '#1C3826',
            error: '#FF6B6B',
            success: '#52B788',
            warning: '#FBBF24',
            overlay: 'rgba(13,31,18,0.7)',
        },
    },

    // ── Sunset ──────────────────────────────────────────────────
    Sunset: {
        light: {
            background: '#FFF3E0',
            surface: '#FFFFFF',
            surfaceAlt: '#FFEDD2',
            primary: '#F57C00',
            accent: '#FFB74D',
            text: '#3E2723',
            textSecondary: '#6D4C41',
            textTertiary: '#A1887F',
            border: '#FFE0B2',
            borderLight: '#FFECD2',
            error: '#D32F2F',
            success: '#388E3C',
            warning: '#FBC02D',
            overlay: 'rgba(245,124,0,0.3)',
        },
        dark: {
            background: '#3E2723',
            surface: '#4E342E',
            surfaceAlt: '#5D4037',
            primary: '#FFB74D',
            accent: '#FFE0B2',
            text: '#EFEBE9',
            textSecondary: '#BCAAA4',
            textTertiary: '#8D6E63',
            border: '#5D4037',
            borderLight: '#4E342E',
            error: '#EF5350',
            success: '#66BB6A',
            warning: '#FFCE56',
            overlay: 'rgba(62,39,35,0.7)',
        },
    },

    // ── Crimson ─────────────────────────────────────────────────
    Crimson: {
        light: {
            background: '#FFF5F5',
            surface: '#FFFFFF',
            surfaceAlt: '#FFEDED',
            primary: '#C0392B',
            accent: '#E74C3C',
            text: '#2C1111',
            textSecondary: '#7A4A4A',
            textTertiary: '#B57373',
            border: '#F0BBBB',
            borderLight: '#F8D5D5',
            error: '#E74C3C',
            success: '#27AE60',
            warning: '#F1C40F',
            overlay: 'rgba(192,57,43,0.3)',
        },
        dark: {
            background: '#2C1111',
            surface: '#411F1F',
            surfaceAlt: '#522828',
            primary: '#E74C3C',
            accent: '#F1948A',
            text: '#F8EBEB',
            textSecondary: '#B98F8F',
            textTertiary: '#8F5E5E',
            border: '#5C3232',
            borderLight: '#4A2626',
            error: '#E74C3C',
            success: '#2ECC71',
            warning: '#F1C40F',
            overlay: 'rgba(44,17,17,0.7)',
        },
    },

    // ── Lavender ────────────────────────────────────────────────
    Lavender: {
        light: {
            background: '#F9F5FF',
            surface: '#FFFFFF',
            surfaceAlt: '#F2EBFA',
            primary: '#764ABC',
            accent: '#9A6BDB',
            text: '#2D1B4E',
            textSecondary: '#725E97',
            textTertiary: '#A894C4',
            border: '#E8DDF5',
            borderLight: '#F0EAF8',
            error: '#E74C3C',
            success: '#2ECC71',
            warning: '#F1C40F',
            overlay: 'rgba(118,74,188,0.3)',
        },
        dark: {
            background: '#1A102D',
            surface: '#2D1B4E',
            surfaceAlt: '#3A2563',
            primary: '#9A6BDB',
            accent: '#B88CEB',
            text: '#F2EBFA',
            textSecondary: '#9C8ABF',
            textTertiary: '#6F5A96',
            border: '#3F276D',
            borderLight: '#2F1E54',
            error: '#E74C3C',
            success: '#2ECC71',
            warning: '#F1C40F',
            overlay: 'rgba(26,16,45,0.7)',
        },
    },

    // ── Midnight ────────────────────────────────────────────────
    Midnight: {
        light: {
            background: '#F0F1F5',
            surface: '#FFFFFF',
            surfaceAlt: '#E8E9EF',
            primary: '#1A1A2E',
            accent: '#16213E',
            text: '#0D0D17',
            textSecondary: '#4A4A68',
            textTertiary: '#7A7A94',
            border: '#D0D0E0',
            borderLight: '#E2E2EE',
            error: '#E53935',
            success: '#43A047',
            warning: '#FBC02D',
            overlay: 'rgba(26,26,46,0.3)',
        },
        dark: {
            background: '#0F0F1A',
            surface: '#1A1A2E',
            surfaceAlt: '#242440',
            primary: '#E94560',
            accent: '#FF7B93',
            text: '#E0E0E6',
            textSecondary: '#8B8B9E',
            textTertiary: '#5C5C72',
            border: '#2C2C46',
            borderLight: '#22223A',
            error: '#FF5252',
            success: '#69F0AE',
            warning: '#FFD54F',
            overlay: 'rgba(15,15,26,0.8)',
        },
    },
};

// ─── Backwards-compatible exports ───────────────────────────────
export const lightColors: Colors = themes.Minimal.light;
export const darkColors: Colors = themes.Minimal.dark;
