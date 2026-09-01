import { createContext, useContext, useState, useEffect } from "react";
import seedOrders from "../data/orders";

const STORAGE_KEY = "cafeteria_orders";

const OrdersContext = createContext(null);

function loadInitialOrders() {

    try {

        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            return JSON.parse(stored);
        }

    } catch (err) {
        console.error("No se pudieron leer los pedidos guardados:", err);
    }

    return seedOrders;

}

export function OrdersProvider({ children }) {

    const [orders, setOrders] = useState(loadInitialOrders);

    useEffect(() => {

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        } catch (err) {
            console.error("No se pudieron guardar los pedidos:", err);
        }

    }, [orders]);

    // Se llama al completar un pago real desde el carrito del cliente.
    // El pedido más nuevo queda primero, para que el admin lo vea arriba.
    const addOrder = (orderData) => {

        setOrders(prev => {

            const nextId = prev.length > 0
                ? Math.max(...prev.map(o => o.id)) + 1
                : 1;

            return [{ id: nextId, ...orderData }, ...prev];

        });

    };

    // Para que el admin pueda mover un pedido de "pending" a "preparing"
    // a "completed" (o "cancelled"), desde la pantalla de Pedidos.
    const updateOrderStatus = (id, status) => {

        setOrders(prev =>
            prev.map(o => (o.id === id ? { ...o, status } : o))
        );

    };

    const updatePaymentStatus = (id, paymentStatus) => {

        setOrders(prev =>
            prev.map(o => (o.id === id ? { ...o, paymentStatus } : o))
        );

    };

    return (
        <OrdersContext.Provider
            value={{ orders, addOrder, updateOrderStatus, updatePaymentStatus }}
        >
            {children}
        </OrdersContext.Provider>
    );

}

export function useOrders() {

    const context = useContext(OrdersContext);

    if (!context) {
        throw new Error("useOrders debe usarse dentro de un <OrdersProvider>");
    }

    return context;

}