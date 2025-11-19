// src/screens/WeatherScreen.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { useSettings } from "../context/SettingsContext";
import {
    Condition,
    DayForecast,
    SevenDayForecast,
    fetchSevenDayForecast,
} from "../lib/weatherApi";

// Coordinates for Sydney (you can change later)
const LATITUDE = -33.8688;
const LONGITUDE = 151.2093;

const WeatherScreen: React.FC = () => {
    const { coverIfDrizzle } = useSettings();
    const [forecast, setForecast] = useState<SevenDayForecast | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const loadWeather = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchSevenDayForecast(LATITUDE, LONGITUDE);
            setForecast(data);
            setLastUpdated(new Date());
        } catch (err: any) {
            console.error("Failed to fetch forecast", err);
            setError(err.message ?? "Failed to fetch forecast");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWeather();
    }, []);

    const today = forecast?.days[0];

    const getStatusText = (condition: Condition): string => {
        if (condition === "rain") return "Heavy rain ☔️";
        if (condition === "drizzle") return "Drizzle 🌦";
        return "No rain 🌤";
    };

    const getAdvice = (condition: Condition): string => {
        if (condition === "rain") {
            return "Don’t cover the car";
        } else if (condition === "drizzle") {
            return coverIfDrizzle
                ? "Cover the car (drizzle OK)"
                : "Don’t cover (treat drizzle as rain)";
        } else {
            return "Cover the car";
        }
    };

    const formatDate = (dateStr: string): string => {
        const d = new Date(dateStr);
        // e.g. "Wed 20"
        return d.toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
        });
    };

    const renderDayRow = ({ item, index }: { item: DayForecast; index: number }) => {
        const label = index === 0 ? "Today" : formatDate(item.date);
        return (
            <View style={styles.row}>
                <View style={styles.rowLeft}>
                    <Text style={styles.rowLabel}>{label}</Text>
                    <Text style={styles.rowStatus}>{getStatusText(item.condition)}</Text>
                </View>
                <View style={styles.rowRight}>
                    {item.precipitationMm != null && (
                        <Text style={styles.rowPrecip}>{item.precipitationMm} mm</Text>
                    )}
                    <Text style={styles.rowAdvice}>{getAdvice(item.condition)}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weather Car App v2</Text>

            <View style={styles.card}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator />
                        <Text style={styles.loadingText}>Loading 7-day forecast…</Text>
                    </View>
                ) : error ? (
                    <View>
                        <Text style={styles.errorTitle}>Error loading forecast</Text>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : today ? (
                    <>
                        <Text style={styles.city}>Sydney (7-day)</Text>
                        <Text style={styles.status}>{getStatusText(today.condition)}</Text>
                        <Text style={styles.advice}>{getAdvice(today.condition)}</Text>
                        {today.precipitationMm != null && (
                            <Text style={styles.todayPrecip}>
                                Today’s precipitation: {today.precipitationMm} mm
                            </Text>
                        )}
                    </>
                ) : (
                    <Text style={styles.loadingText}>No data yet</Text>
                )}
            </View>

            {/* 7-day list */}
            {forecast && !loading && !error && (
                <>
                    <Text style={styles.sectionTitle}>Next 7 days</Text>
                    <FlatList
                        data={forecast.days}
                        keyExtractor={(item) => item.date}
                        renderItem={renderDayRow}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                </>
            )}

            {lastUpdated && (
                <Text style={styles.helperText}>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </Text>
            )}
        </View>
    );
};

export default WeatherScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        backgroundColor: "#f3f4f6",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 24,
        color: "#111827",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        marginBottom: 16,
    },
    city: {
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        color: "#4b5563",
        marginBottom: 8,
    },
    status: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
        color: "#111827",
    },
    advice: {
        fontSize: 18,
        fontWeight: "500",
        textAlign: "center",
        color: "#2563eb",
    },
    todayPrecip: {
        marginTop: 8,
        textAlign: "center",
        fontSize: 13,
        color: "#6b7280",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#111827",
    },
    row: {
        flexDirection: "row",
        paddingVertical: 8,
    },
    rowLeft: {
        flex: 1,
    },
    rowRight: {
        flex: 1,
        alignItems: "flex-end",
    },
    rowLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    rowStatus: {
        fontSize: 13,
        color: "#4b5563",
    },
    rowPrecip: {
        fontSize: 13,
        color: "#4b5563",
    },
    rowAdvice: {
        fontSize: 13,
        color: "#2563eb",
        fontWeight: "500",
        marginTop: 2,
        textAlign: "right",
    },
    separator: {
        height: 1,
        backgroundColor: "#e5e7eb",
    },
    center: {
        alignItems: "center",
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#b91c1c",
        marginBottom: 4,
        textAlign: "center",
    },
    errorText: {
        fontSize: 13,
        color: "#b91c1c",
        textAlign: "center",
    },
    helperText: {
        marginTop: 8,
        fontSize: 12,
        textAlign: "center",
        color: "#6b7280",
    },
});
