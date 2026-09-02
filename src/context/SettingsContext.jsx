import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "cafeteria_settings";

const SettingsContext = createContext(null);

const defaultSettings = {
    businessName: "Kopi Coffee",
    phone: "",
    address: "",
    currency: "$",
    openTime: "08:00",
    closeTime: "20:00",
};

function loadInitialSettings() {

    try {

        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            // merge por si en el futuro agregamos un campo nuevo y el
            // usuario ya tiene algo guardado de antes
            return { ...defaultSettings, ...JSON.parse(stored) };
        }

    } catch (err) {
        console.error("No se pudo leer la configuración guardada:", err);
    }

    return defaultSettings;

}

export function SettingsProvider({ children }) {

    const [settings, setSettings] = useState(loadInitialSettings);

    useEffect(() => {

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (err) {
            console.error("No se pudo guardar la configuración:", err);
        }

    }, [settings]);

    const updateSettings = (updates) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );

}

export function useSettings() {

    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error("useSettings debe usarse dentro de un <SettingsProvider>");
    }

    return context;

}