import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, Colors } from './colors';
import { settingsRepository } from '../repositories/settingsRepository';

type ThemeType = 'Light' | 'Dark' | 'System';

interface ThemeContextValue {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    colors: Colors;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'System',
    setTheme: () => { },
    colors: lightColors,
    isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ThemeType>('System');

    useEffect(() => {
        try {
            const settings = settingsRepository.getSettings();
            setThemeState(settings.theme);
        } catch (e) {
            // Ignore initial render errors before DB is ready
        }
    }, []);

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
        settingsRepository.updateSettings({ theme: newTheme });
    };

    const isDark = theme === 'System' ? systemColorScheme === 'dark' : theme === 'Dark';
    const colors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
