import { useState } from 'react';
import { Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

// Define the expected schema of the remote JSON file
interface UpdateData {
    latestVersion: string;
    downloadUrl: string;
    releaseNotes: string;
}

// Ensure you replace [USER] and [REPO] with the actual GitHub details
const UPDATE_JSON_URL = 'https://raw.githubusercontent.com/asliadarsh/Closetra/main/version.json';

export function useUpdateChecker() {
    const [isChecking, setIsChecking] = useState(false);

    // Simple semantic version comparator
    const isNewerVersion = (latest: string, current: string) => {
        const latestParts = latest.split('.').map(Number);
        const currentParts = current.split('.').map(Number);

        for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
            const l = latestParts[i] || 0;
            const c = currentParts[i] || 0;
            if (l > c) return true;
            if (l < c) return false;
        }
        return false;
    };

    const checkForUpdates = async (silentMode: boolean = false) => {
        if (isChecking) return;
        setIsChecking(true);

        try {
            // Check for internet connectivity by fetching the raw URL
            const response = await fetch(UPDATE_JSON_URL, {
                headers: { 'Cache-Control': 'no-cache' }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch update data.");
            }

            const data: UpdateData = await response.json();
            const currentVersion = Constants.expoConfig?.version || '1.0.0';

            if (isNewerVersion(data.latestVersion, currentVersion)) {
                Alert.alert(
                    "Update Available",
                    `Version ${data.latestVersion} is available!\n\nRelease Notes:\n${data.releaseNotes}`,
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Download",
                            onPress: () => {
                                Linking.openURL(data.downloadUrl).catch(() => {
                                    Alert.alert("Error", "Could not open the download URL.");
                                });
                            }
                        }
                    ]
                );
            } else {
                if (!silentMode) {
                    Alert.alert("Up to Date", `You are running the latest version (${currentVersion}).`);
                }
            }
        } catch (error) {
            console.error(error);
            if (!silentMode) {
                Alert.alert(
                    "Network Error",
                    "Could not check for updates. Please check your internet connection."
                );
            }
        } finally {
            setIsChecking(false);
        }
    };

    return { checkForUpdates, isChecking };
}
