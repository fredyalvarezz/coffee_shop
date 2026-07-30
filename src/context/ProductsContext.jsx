import { createContext, useContext, useState, useEffect } from "react";
import seedProducts from "../data/products";

const STORAGE_KEY = "cafeteria_products";

const ProductsContext = createContext(null);

function loadInitialProducts() {

    try {

        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            return JSON.parse(stored);
        }

    } catch (err) {
        console.error("No se pudo leer productos guardados:", err);
    }

    // Si no hay nada guardado todavía (primera vez que abren la app),
    // arranca con el catálogo base que ya tenías en products.js
    return seedProducts;

}

export function ProductsProvider({ children }) {

    const [products, setProducts] = useState(loadInitialProducts);

    // Cada vez que la lista de productos cambia, se guarda en localStorage
    // para que sobreviva a un recargo de página.
    useEffect(() => {

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        } catch (err) {
            console.error("No se pudo guardar el catálogo de productos:", err);
        }

    }, [products]);

    const addProduct = (productData) => {

        setProducts(prev => {

            const nextId = prev.length > 0
                ? Math.max(...prev.map(p => p.id)) + 1
                : 1;

            const newProduct = {
                id: nextId,
                ...productData,
            };

            return [...prev, newProduct];

        });

    };

    const updateProduct = (id, updates) => {
        setProducts(prev =>
            prev.map(p => (p.id === id ? { ...p, ...updates } : p))
        );
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    // Por si algún día quieres un botón "Restaurar catálogo original"
    const resetToSeed = () => {
        setProducts(seedProducts);
    };

    return (
        <ProductsContext.Provider
            value={{ products, addProduct, updateProduct, deleteProduct, resetToSeed }}
        >
            {children}
        </ProductsContext.Provider>
    );

}

export function useProducts() {

    const context = useContext(ProductsContext);

    if (!context) {
        throw new Error("useProducts debe usarse dentro de un <ProductsProvider>");
    }

    return context;

}
