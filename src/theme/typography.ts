import { Platform, TextStyle } from 'react-native';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Raleway_400Regular, Raleway_500Medium, Raleway_600SemiBold } from '@expo-google-fonts/raleway';

// Proxima Nova .ttf files loaded from local package
const ProximaNovaRegular = require('font-proxima-nova/fonts/ProximaNova-Regular.ttf');
const ProximaNovaSemibold = require('font-proxima-nova/fonts/ProximaNova-Semibold.ttf');
const ProximaNovaBold = require('font-proxima-nova/fonts/ProximaNova-Bold.ttf');

// ─── Font Family Names ─────────────────────────────────────────
export const fontFamilies = {
  // Proxima Nova — bold, geometric, clean → headings, titles, buttons
  display: 'ProximaNova-Bold',
  // Proxima Nova Semibold — compact, modern → card titles, subtitles
  modern: 'ProximaNova-Semibold',
  // Proxima Nova Regular — clean, minimal → label text
  modernRegular: 'ProximaNova-Regular',
  // Lato — warm, highly readable → body, sections
  elegant: 'Lato_400Regular',
  // Lato Bold — emphasis
  elegantBold: 'Lato_700Bold',
  // Raleway — elegant, refined → captions, metadata, chips
  soft: 'Raleway_400Regular',
  // Raleway Medium — tab labels
  softMedium: 'Raleway_500Medium',
  // Raleway SemiBold — chip text, badges
  softSemiBold: 'Raleway_600SemiBold',
};

// ─── Typography Scale ───────────────────────────────────────────
// Minimalist scale using Proxima Nova, Lato, and Raleway
export const typography: Record<string, TextStyle> = {
  // Hero header — "My Closet", "Outfits"
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: 0.3,
  },
  // Section header — "Select Clothes", "Trip Details"
  h2: {
    fontFamily: fontFamilies.elegantBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  // Card title / item name
  h3: {
    fontFamily: fontFamilies.modern,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  // Primary body text
  body: {
    fontFamily: fontFamilies.elegant,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  // Captions / metadata / dates
  caption: {
    fontFamily: fontFamilies.soft,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  // Small print / badges / timestamps
  small: {
    fontFamily: fontFamilies.softMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  // Button text / label text
  button: {
    fontFamily: fontFamilies.modern,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  // Navigation tab label
  tabLabel: {
    fontFamily: fontFamilies.softMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  // Filter chip / badge text
  chip: {
    fontFamily: fontFamilies.softSemiBold,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 0.3,
  },
};

// ─── Font loading map for expo-font ────────────────────────────
export const fontConfig: Record<string, any> = {
  'ProximaNova-Regular': ProximaNovaRegular,
  'ProximaNova-Semibold': ProximaNovaSemibold,
  'ProximaNova-Bold': ProximaNovaBold,
  'Lato_400Regular': Lato_400Regular,
  'Lato_700Bold': Lato_700Bold,
  'Raleway_400Regular': Raleway_400Regular,
  'Raleway_500Medium': Raleway_500Medium,
  'Raleway_600SemiBold': Raleway_600SemiBold,
};
