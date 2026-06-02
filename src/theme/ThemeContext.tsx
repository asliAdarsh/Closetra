import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, ActivityIndicator, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { themes, Colors, ThemeName } from './colors';
import { fontConfig } from './typography';
import { settingsRepository } from '../repositories/settingsRepository';

type ThemeMode = 'Light' | 'Dark' | 'System';

interface ThemeContextValue {
    /** Light / Dark / System toggle */
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    /** Named colour theme (Minimal, Ocean, Forest, etc.) */
    themeName: ThemeName;
    setThemeName: (name: ThemeName) => void;
    /** Resolved colour tokens for the current theme+mode */
    colors: Colors;
    isDark: boolean;
    gridColumns: number;
    setGridColumns: (cols: number) => void;
    /** Whether fonts are loaded */
    fontsLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'System',
    setTheme: () => { },
    themeName: 'Minimal',
    setThemeName: () => { },
    colors: themes.Minimal.light,
    isDark: false,
    gridColumns: 2,
    setGridColumns: () => { },
    fontsLoaded: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ThemeMode>('System');
    const [themeName, setThemeNameState] = useState<ThemeName>('Minimal');
    const [gridColumns, setGridColumnsState] = useState<number>(2);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    // Load custom fonts
    useEffect(() => {
        Font.loadAsync(fontConfig)
            .then(() => setFontsLoaded(true))
            .catch((err) => {
                console.warn('Font loading failed, falling back to system fonts', err);
                setFontsLoaded(true); // Still render even if fonts fail
            });
    }, []);

    // Load saved settings
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
    };

    const isDark = theme === 'System' ? systemColorScheme === 'dark' : theme === 'Dark';
    const palette = themes[themeName] ?? themes.Minimal;
    const colors = isDark ? palette.dark : palette.light;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themeName, setThemeName, colors, isDark, gridColumns, setGridColumns, fontsLoaded }}>
            {fontsLoaded ? children : (
                <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                    <ActivityIndicator size="small" color={colors.textSecondary} />
                </View>
            )}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
