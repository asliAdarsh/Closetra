# Closetra

A premium, fully offline wardrobe management app. Organize your closet, build outfits, track laundry, and plan trips — all on-device with no internet or cloud account needed.

## Download

Get the latest version from the [GitHub Releases](https://github.com/asliadarsh/Closetra/releases/latest) page. Download the APK for Android or the appropriate build for your platform.

Once installed, the app includes a built-in **Check for Updates** feature under the More tab that fetches the latest release directly from GitHub — no manual checking needed.

## Features

- **Virtual Closet** — Digitize your wardrobe with photos, categories, brand, color, season tracking, and favorites.
- **Outfit Builder** — Mix and match items into outfits with custom categories and search.
- **Laundry Tracker** — Log laundry cycles, mark items as returned, and see what's in the wash directly from your closet.
- **Trip Packing** — Create trips, assign clothes to pack, track progress with pack/unpack toggling.
- **Multi-Select & Batch Actions** — Long-press to select multiple items on any tab. Delete in bulk or move to a category.
- **Advanced Filtering** — Filter clothes by category, color, brand, and season via a bottom-sheet interface. Sort by name or date. Laundry and trips have their own filter and sort options too.
- **8 Color Themes** — Minimal, Ocean, Forest, Sunset, Crimson, Lavender, and Midnight. All themes support Light and Dark mode.
- **Custom Typography** — Uses Proxima Nova, Lato, and Raleway for a clean, editorial feel.
- **Analytics** — View wardrobe stats and a category breakdown chart.
- **Backup & Restore** — Export your data as JSON and restore on any device.
- **100% Offline & Private** — SQLite database and local images. No data ever leaves your device.
- **Premium UI** — Haptic feedback, smooth transitions, minimalist design.

## Tech Stack

- [React Native](https://reactnative.dev/) + [Expo SDK 54](https://expo.dev/)
- TypeScript + Zustand (state) + expo-sqlite (database)
- React Navigation (tabs + stacks)
- expo-image-picker + expo-file-system (images)
- react-native-chart-kit (analytics)

## Data Persistence

*   **Database**: Stored locally in the SQLite document directory.
*   **Images**: When you select an image, it is copied to a persistent `Images` folder within the app's local document directory. The database stores the local URI to ensure lightning-fast performance and offline availability.


## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
