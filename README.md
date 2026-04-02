# Closetra

Closetra is a premium, fully offline, and private wardrobe management application built for the modern fashion-conscious user. Organize your closet, design outfits, track laundry, and plan trips with a sleek, high-contrast interface—all without ever needing an internet connection or a cloud account.

## Premium Features

*   **Virtual Closet (Closet)**: Digitize your entire wardrobe with ease. Add photos, categorize items (Shirts, Pants, Shoes, etc.), and track details like brand, color, season, and notes. Items can be marked as favorites for quick access.
*   **Outfit Architect**: Build limitless outfit combinations. Mix and match items from your closet, assign them to custom categories, and search through your saved looks. Perfect for planning your week or saving inspiration.
*   **Intelligent Laundry Tracking**: Keep your wardrobe rotation fresh. Add items to laundry to track what's currently in the wash. Clothes in laundry are automatically badged in your closet so you know exactly what's available to wear.
*   **Advanced Trip Planner**: Organize your packing lists for upcoming travel. Track your location, dates, and notes. Use the "Pack All" feature to batch-process your items as you prepare for your journey.
*   **7 Premium Themes**: Personalize your experience with curated color palettes including **Classic, Ocean, Forest, Sunset, Crimson, Lavender, and Midnight**. Every theme supports both Light and Dark modes with smooth, animated transitions.
*   **Dynamic Analytics**: Gain insights into your style. View a beautiful breakdown of your wardrobe by category with interactive charts and see real-time stats on your total items, active laundry, and planned trips.
*   **Integrated Update System**: Stay on the latest version with the built-in "Check for Updates" feature. It fetches the latest release data directly from GitHub while keeping your data strictly on-device.
*   **100% Offline & Private**: Your data is yours. All information and images are stored securely on your device using a local SQLite database and protected file system. No cloud login required.
*   **Elite UI/UX**: Experience a minimalist, high-performance interface featuring smooth transitions, haptic feedback, and a consistent design language across all modules.
*   **Backup & Restore**: Never lose your data. Export your entire database to a portable JSON file and restore it on any device using the native sharing menu.

## Technology Stack

*   **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 54](https://expo.dev/)
*   **Language**: TypeScript
*   **Animation**: React Native Reanimated & LayoutAnimations
*   **Theme Engine**: Custom ThemeContext with 7 Adaptive Palettes
*   **State Management**: Zustand
*   **Database**: `expo-sqlite` (Local Persistence)
*   **Storage**: `expo-file-system` (Local Image Management)
*   **Haptics**: `expo-haptics`
*   **Charts**: `react-native-chart-kit`

## Data Persistence

*   **Database**: Stored locally in the SQLite document directory.
*   **Images**: When you select an image, it is copied to a persistent `Images` folder within the app's local document directory. The database stores the local URI to ensure lightning-fast performance and offline availability.

## License

This project is for personal use and portfolio demonstration. All rights reserved.
