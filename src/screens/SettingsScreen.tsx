// src/screens/SettingsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useSettings } from "../context/SettingsContext";

const SettingsScreen: React.FC = () => {
    const { coverIfDrizzle, setCoverIfDrizzle } = useSettings();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.row}>
                <View style={styles.rowText}>
                    <Text style={styles.optionTitle}>Cover car when drizzle</Text>
                    <Text style={styles.optionSubtitle}>
                        If enabled, drizzle is treated like “safe to cover”.
                    </Text>
                </View>
                <Switch
                    value={coverIfDrizzle}               // ✅ boolean
                    onValueChange={setCoverIfDrizzle}    // gets boolean
                />
            </View>

            <Text style={styles.sectionTitle}>Explanation</Text>
            <Text style={styles.text}>
                Recommendation logic:
                {"\n"}• Heavy rain → Don’t cover the car
                {"\n"}• No rain → Cover the car
                {"\n"}• Drizzle → Depends on this toggle
            </Text>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        backgroundColor: "#f9fafb",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 24,
        textAlign: "center",
        color: "#111827",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: "#ffffff",
        marginBottom: 24,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    rowText: {
        flex: 1,
        marginRight: 12,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    optionSubtitle: {
        fontSize: 13,
        color: "#6b7280",
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#111827",
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        color: "#374151",
    },
});
