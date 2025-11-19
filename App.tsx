// App.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
} from "react-native";
import WeatherScreen from "./src/screens/WeatherScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { SettingsProvider } from "./src/context/SettingsContext";

type Tab = "Weather" | "Settings";

export default function App() {
    const [currentTab, setCurrentTab] = useState<Tab>("Weather");

    const renderScreen = () => {
        if (currentTab === "Weather") {
            return <WeatherScreen />;
        }
        return <SettingsScreen />;
    };

    return (
        <SettingsProvider>
            <SafeAreaView style={styles.root}>
                <View style={styles.screenContainer}>{renderScreen()}</View>

                <View style={styles.tabBar}>
                    <TabButton
                        label="Weather"
                        active={currentTab === "Weather"}
                        onPress={() => setCurrentTab("Weather")}
                    />
                    <TabButton
                        label="Settings"
                        active={currentTab === "Settings"}
                        onPress={() => setCurrentTab("Settings")}
                    />
                </View>
            </SafeAreaView>
        </SettingsProvider>
    );
}

type TabButtonProps = {
    label: string;
    active: boolean;
    onPress: () => void;
};

const TabButton: React.FC<TabButtonProps> = ({ label, active, onPress }) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.tabButton,
            active && styles.tabButtonActive,
            pressed && { opacity: 0.6 },
        ]}
    >
        <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
            {label}
        </Text>
    </Pressable>
);

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#f3f4f6",
    },
    screenContainer: {
        flex: 1,
    },
    tabBar: {
        flexDirection: "row",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e5e7eb",
        backgroundColor: "#ffffff",
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    tabButtonActive: {
        borderTopWidth: 2,
        borderTopColor: "#2563eb",
    },
    tabLabel: {
        fontSize: 12,
        color: "#6b7280",
    },
    tabLabelActive: {
        color: "#2563eb",
        fontWeight: "600",
    },
});
