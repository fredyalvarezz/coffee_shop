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

// inventoryLinks: por cada categoría (milks, coffeeOptions, infusionOptions,
// flavors), un mapa { "nombre del valor": inventoryItemId }. "flavors" es
// plano (no separado por grupo) — si el mismo nombre de sabor existe en
// más de un grupo, comparten el mismo insumo vinculado.
const emptyInventoryLinks = {
    milks: {},
    coffeeOptions: {},
    infusionOptions: {},
    flavors: {},
};

function loadInitialCatalog() {

    const defaults = {
        milks: seedMilks,
        coffeeOptions: seedCoffeeOptions,
        infusionOptions: seedInfusionOptions,
        extras: seedExtras,
        flavorGroups: seedFlavorGroups,
        inventoryLinks: emptyInventoryLinks,
    };

    try {

        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {

            const parsed = JSON.parse(stored);

            // merge por si el catálogo guardado es de antes de que
            // existiera inventoryLinks, para no tronar leyendo undefined
            return {
                ...defaults,
                ...parsed,
                inventoryLinks: {
                    ...emptyInventoryLinks,
                    ...(parsed.inventoryLinks || {}),
                },
            };

        }

    } catch (err) {
        console.error("No se pudo leer el catálogo guardado:", err);
    }

    return defaults;

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
                extras: [...prev.extras, {
                    id,
                    name,
                    price: Number(extra.price) || 0,
                    // Insumo que consume este extra al elegirse, y cuánto.
                    // Ambos opcionales — si se dejan vacíos, el extra no
                    // descuenta nada del inventario (ej. "Splenda").
                    inventoryItemId: extra.inventoryItemId ? Number(extra.inventoryItemId) : null,
                    amount: extra.amount ? Number(extra.amount) : 0,
                }],
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

    // --- Vínculo entre un valor del catálogo y un insumo del Inventario ---
    // category: "milks" | "coffeeOptions" | "infusionOptions" | "flavors"
    // value: el nombre tal cual aparece en el catálogo (ej. "Avena")
    // inventoryItemId: id del insumo en Inventory, o "" / null para quitar
    const setInventoryLink = (category, value, inventoryItemId) => {

        setCatalog(prev => ({
            ...prev,
            inventoryLinks: {
                ...prev.inventoryLinks,
                [category]: {
                    ...prev.inventoryLinks[category],
                    [value]: inventoryItemId ? Number(inventoryItemId) : null,
                },
            },
        }));

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
                setInventoryLink,
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