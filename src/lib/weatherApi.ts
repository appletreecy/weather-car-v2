// src/lib/weatherApi.ts

// High-level condition our app cares about
export type Condition = "none" | "drizzle" | "rain";

export type DayForecast = {
    date: string;             // e.g. "2025-11-19"
    condition: Condition;
    precipitationMm: number | null;
    weatherCode: number | null;
};

export type SevenDayForecast = {
    days: DayForecast[];      // ideally 7 items
};

const API_BASE = "https://api.open-meteo.com/v1/forecast";

/**
 * Map Open-Meteo weathercode to our Condition
 * Rough mapping:
 *  - 0,1,2,3,45,48 => none (clear / clouds / fog)
 *  - 51-57         => drizzle
 *  - 61-67,80-82,
 *    95-99         => rain / showers / thunder
 */
function mapWeatherCodeToCondition(code: number): Condition {
    if (code >= 51 && code <= 57) return "drizzle";
    if (
        (code >= 61 && code <= 67) ||
        (code >= 80 && code <= 82) ||
        (code >= 95 && code <= 99)
    ) {
        return "rain";
    }
    return "none";
}

/**
 * Fetch 7-day daily forecast from Open-Meteo.
 * No API key required.
 */
export async function fetchSevenDayForecast(
    latitude: number,
    longitude: number
): Promise<SevenDayForecast> {
    const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        daily: "weathercode,precipitation_sum",
        timezone: "auto",
    });

    const url = `${API_BASE}?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Weather API error: ${res.status} ${text}`);
    }

    const json = await res.json();

    const dates: string[] = json.daily?.time ?? [];
    const codes: number[] = json.daily?.weathercode ?? [];
    const precips: number[] = json.daily?.precipitation_sum ?? [];

    const days: DayForecast[] = dates.map((date, idx) => {
        const code = typeof codes[idx] === "number" ? codes[idx] : null;
        const precip =
            typeof precips[idx] === "number"
                ? Math.round(precips[idx] * 10) / 10
                : null;

        const condition = code != null ? mapWeatherCodeToCondition(code) : "none";

        return {
            date,
            condition,
            precipitationMm: precip,
            weatherCode: code,
        };
    });

    // Keep at most 7 days in case API returns more
    return { days: days.slice(0, 7) };
}
