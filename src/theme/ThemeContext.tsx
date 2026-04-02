import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { themes, Colors, ThemeName } from './colors';
import { settingsRepository } from '../repositories/settingsRepository';

type ThemeMode = 'Light' | 'Dark' | 'System';

interface ThemeContextValue {
    /** Light / Dark / System toggle */
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    /** Named colour theme (Classic, Ocean, Forest) */
    themeName: ThemeName;
    setThemeName: (name: ThemeName) => void;
    /** Resolved colour tokens for the current theme+mode */
    colors: Colors;
    isDark: boolean;
    gridColumns: number;
    setGridColumns: (cols: number) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'System',
    setTheme: () => { },
    themeName: 'Classic',
    setThemeName: () => { },
    colors: themes.Classic.light,
    isDark: false,
    gridColumns: 2,
    setGridColumns: () => { }
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ThemeMode>('System');
    const [themeName, setThemeNameState] = useState<ThemeName>('Classic');
    const [gridColumns, setGridColumnsState] = useState<number>(2);

    useEffect(() => {
        try {
            const settings = settingsRepository.getSettings();
            setThemeState(settings.theme);
            if (settings.themeName && themes[settings.themeName as ThemeName]) {
                setThemeNameState(settings.themeName as ThemeName);
            }
            if (settings.gridColumns) {
                setGridColumnsState(settings.gridColumns);
            }
        } catch (e) {
            // Ignore initial render errors before DB is ready
        }
    }, []);

    const setTheme = (newTheme: ThemeMode) => {
        import('react-native').then(({ LayoutAnimation }) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setThemeState(newTheme);
        });
        setTimeout(() => settingsRepository.updateSettings({ theme: newTheme }), 0);
    };

    const setThemeName = (name: ThemeName) => {
        import('react-native').then(({ LayoutAnimation }) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setThemeNameState(name);
        });
        setTimeout(() => settingsRepository.updateSettings({ themeName: name }), 0);
    };

    const setGridColumns = (cols: number) => {
        import('react-native').then(({ LayoutAnimation }) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setGridColumnsState(cols);
        });
        setTimeout(() => settingsRepository.updateSettings({ gridColumns: cols }), 0);
    }

    const isDark = theme === 'System' ? systemColorScheme === 'dark' : theme === 'Dark';
    const palette = themes[themeName] ?? themes.Classic;
    const colors = isDark ? palette.dark : palette.light;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themeName, setThemeName, colors, isDark, gridColumns, setGridColumns }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
