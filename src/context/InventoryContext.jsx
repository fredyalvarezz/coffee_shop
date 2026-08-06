import { createContext, useContext, useState, useEffect } from "react";
import seedInventory from "../data/inventory";

const STORAGE_KEY = "cafeteria_inventory";

const InventoryContext = createContext(null);

function loadInitialInventory() {

    try {

        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            return JSON.parse(stored);
        }

    } catch (err) {
        console.error("No se pudo leer el inventario guardado:", err);
    }

    return seedInventory;

}

export function InventoryProvider({ children }) {

    const [inventory, setInventory] = useState(loadInitialInventory);

    useEffect(() => {

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
        } catch (err) {
            console.error("No se pudo guardar el inventario:", err);
        }

    }, [inventory]);

    const addItem = (itemData) => {

        setInventory(prev => {

            const nextId = prev.length > 0
                ? Math.max(...prev.map(i => i.id)) + 1
                : 1;

            return [...prev, { id: nextId, ...itemData }];

        });

    };

    const updateItem = (id, updates) => {
        setInventory(prev =>
            prev.map(i => (i.id === id ? { ...i, ...updates } : i))
        );
    };

    const deleteItem = (id) => {
        setInventory(prev => prev.filter(i => i.id !== id));
    };

    // Suma (o resta, con un número negativo) al stock actual de un insumo.
    // No se usa todavía en ningún lado — está lista para cuando conectemos
    // el descuento automático por receta al completarse un pedido.
    const adjustStock = (id, amount) => {
        setInventory(prev =>
            prev.map(i =>
                i.id === id
                    ? { ...i, stock: Math.max(0, i.stock + amount) }
                    : i
            )
        );
    };

    return (
        <InventoryContext.Provider
            value={{ inventory, addItem, updateItem, deleteItem, adjustStock }}
        >
            {children}
        </InventoryContext.Provider>
    );

}

export function useInventory() {

    const context = useContext(InventoryContext);

    if (!context) {
        throw new Error("useInventory debe usarse dentro de un <InventoryProvider>");
    }

    return context;

}