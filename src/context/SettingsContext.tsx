// src/context/SettingsContext.tsx
import React, { createContext, useContext, useState } from "react";

type SettingsContextValue = {
    /** If true -> when it's drizzle, we still COVER the car. */
    coverIfDrizzle: boolean;
    setCoverIfDrizzle: (value: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
    undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                              children,
                                                                          }) => {
    // Default: drizzle is treated as "OK to cover"
    const [coverIfDrizzle, setCoverIfDrizzle] = useState<boolean>(true);

    return (
        <SettingsContext.Provider value={{ coverIfDrizzle, setCoverIfDrizzle }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextValue => {
    const ctx = useContext(SettingsContext);
    if (!ctx) {
        throw new Error("useSettings must be used inside a SettingsProvider");
    }
    return ctx;
};
