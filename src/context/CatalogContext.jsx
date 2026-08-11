import { createContext, useContext, useState, useEffect } from "react";
import {
    milks as seedMilks,
    coffeeOptions as seedCoffeeOptions,
    infusionOptions as seedInfusionOptions,
    extras as seedExtras,
    flavorGroups as seedFlavorGroups,
} from "../data/productOptions";

const STORAGE_KEY = "cafeteria_catalog";

const CatalogContext = createContext(null);

function loadInitialCatalog() {

    try {

        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            return JSON.parse(stored);
        }

    } catch (err) {
        console.error("No se pudo leer el catálogo guardado:", err);
    }

    // Primera vez que se abre la app: arranca con lo que ya tenías
    // escrito en productOptions.js
    return {
        milks: seedMilks,
        coffeeOptions: seedCoffeeOptions,
        infusionOptions: seedInfusionOptions,
        extras: seedExtras,
        flavorGroups: seedFlavorGroups,
    };

}

export function CatalogProvider({ children }) {

    const [catalog, setCatalog] = useState(loadInitialCatalog);

    useEffect(() => {

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
        } catch (err) {
            console.error("No se pudo guardar el catálogo:", err);
        }

    }, [catalog]);

    // --- Listas simples de texto: milks, coffeeOptions, infusionOptions ---

    const addListItem = (listName, value) => {

        const trimmed = value.trim();

        if (!trimmed) return;

        setCatalog(prev => {

            if (prev[listName].includes(trimmed)) return prev; // ya existe

            return { ...prev, [listName]: [...prev[listName], trimmed] };

        });

    };

    const removeListItem = (listName, value) => {

        setCatalog(prev => ({
            ...prev,
            [listName]: prev[listName].filter(item => item !== value),
        }));

    };

    // --- Extras (objetos con id, nombre y precio) ---

    const addExtra = (extra) => {

        const name = extra.name.trim();

        if (!name) return;

        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        setCatalog(prev => {

            if (prev.extras.some(e => e.id === id)) return prev; // ya existe

            return {
                ...prev,
                extras: [...prev.extras, { id, name, price: Number(extra.price) || 0 }],
            };

        });

    };

    const updateExtra = (id, updates) => {

        setCatalog(prev => ({
            ...prev,
            extras: prev.extras.map(e => (e.id === id ? { ...e, ...updates } : e)),
        }));

    };

    const removeExtra = (id) => {

        setCatalog(prev => ({
            ...prev,
            extras: prev.extras.filter(e => e.id !== id),
        }));

    };

    // --- Sabores, agrupados por tipo de producto (flavorGroups) ---

    const addFlavor = (group, value) => {

        const trimmed = value.trim();

        if (!trimmed) return;

        setCatalog(prev => {

            const current = prev.flavorGroups[group] || [];

            if (current.includes(trimmed)) return prev; // ya existe

            return {
                ...prev,
                flavorGroups: { ...prev.flavorGroups, [group]: [...current, trimmed] },
            };

        });

    };

    const removeFlavor = (group, value) => {

        setCatalog(prev => ({
            ...prev,
            flavorGroups: {
                ...prev.flavorGroups,
                [group]: (prev.flavorGroups[group] || []).filter(item => item !== value),
            },
        }));

    };

    // Para cuando agregues un tipo de producto nuevo (ej. Smoothies) que
    // necesite su propio grupo de sabores, sin mezclarse con los demás.
    const addFlavorGroup = (groupName) => {

        const key = groupName.trim().toLowerCase().replace(/\s+/g, "-");

        if (!key) return;

        setCatalog(prev => {

            if (prev.flavorGroups[key]) return prev; // ya existe

            return { ...prev, flavorGroups: { ...prev.flavorGroups, [key]: [] } };

        });

    };

    return (
        <CatalogContext.Provider
            value={{
                catalog,
                addListItem,
                removeListItem,
                addExtra,
                updateExtra,
                removeExtra,
                addFlavor,
                removeFlavor,
                addFlavorGroup,
            }}
        >
            {children}
        </CatalogContext.Provider>
    );

}

export function useCatalog() {

    const context = useContext(CatalogContext);

    if (!context) {
        throw new Error("useCatalog debe usarse dentro de un <CatalogProvider>");
    }

    return context;

}