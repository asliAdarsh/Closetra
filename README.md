# Closetra

Closetra is a fully offline, private wardrobe and outfit management application built with Expo and React Native. Organize your closet, track your laundry, plan your trips, and build custom outfits—all without an internet connection or cloud account.

## Features

*   **Virtual Closet**: Digitize your wardrobe. Add photos, categorize items (e.g., shirts, pants, shoes), and add custom details like brand, color, season, and notes.
*   **Outfit Builder**: Create limitless outfit combinations. Mix and match any number of items, give them custom names, and save your favorites for quick inspiration.
*   **Laundry Tracking**: Keep track of what's currently in the wash. Clothes in laundry are automatically badged in your closet so you know they aren't available to wear right now.
*   **Trip Planning**: Create packing lists for upcoming trips. Check off items as you pack them and easily mark them as "collected" when you return. 
*   **Analytics**: View a breakdown of your closet by category with an interactive pie chart, and see key stats like your total number of clothes, active laundry loads, and planned trips.
*   **100% Offline & Private**: All data (including images) is securely stored locally on your device using an SQLite database and the local file system.
*   **Backup & Restore**: Easily export your entire database to a JSON file and share it via your phone's native sharing menu. You can import this file anytime to restore your closet across devices.
*   **Dark Mode**: Full support for both light and dark system themes.

## Technology Stack

*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (Managed Workflow)
*   **Language**: TypeScript
*   **Navigation**: React Navigation (Bottom Tabs & Native Stack)
*   **State Management**: Zustand
*   **Database**: `expo-sqlite`
*   **Storage**: `expo-file-system` (for local image persistence)
*   **Icons**: `@expo/vector-icons` (Ionicons)
*   **Charts**: `react-native-chart-kit`

## Getting Started

### Prerequisites

*   Node.js (v18 or newer recommended)
*   npm or yarn
*   [Expo Go](https://expo.dev/go) app installed on your physical device (iOS or Android), or an emulator/simulator setup.

### Installation

1.  **Clone the repository** (if you have the source files):
    ```bash
    git clone <repository-url>
    cd Closetra
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Expo development server**:
    ```bash
    npx expo start
    ```

4.  **Run the app**:
    *   Open the **Expo Go** app on your phone and scan the QR code displayed in your terminal.
    *   Alternatively, press `a` in the terminal to open the app in an Android emulator, or `i` to open it in an iOS simulator (requires Xcode/Android Studio setup).

## Building an APK (Android)

You can easily generate an installable `.apk` file for Android devices using Expo Application Services (EAS).

1.  Create an Expo account at [expo.dev](https://expo.dev/) and install the EAS CLI:
    ```bash
    npm install -g eas-cli
    ```
2.  Log in to your account:
    ```bash
    eas login
    ```
3.  Trigger the cloud build:
    ```bash
    eas build -p android --profile preview
    ```
4.  Once the build finishes, you will receive a direct link to download the `.apk` file.

## Data Persistence

*   **Database**: Stored in `${FileSystem.documentDirectory}SQLite/closetra.db`.
*   **Images**: When you select an image via the camera or gallery, it is copied to a persistent `Images` folder within the app's local document directory. The SQLite database only stores the local URI string (e.g., `file:///data/user/0/.../Images/xyz.jpg`) to maintain performance.

## License

This project is for personal use and portfolio demonstration. All rights reserved.
