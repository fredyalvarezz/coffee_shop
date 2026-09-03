import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "cafeteria_wallet";

const WalletContext = createContext(null);

function loadInitialWallet() {

    try {

        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            return JSON.parse(stored);
        }

    } catch (err) {
        console.error("No se pudo leer la cartera guardada:", err);
    }

    return { balances: {}, transactions: [] };

}

export function WalletProvider({ children }) {

    const [wallet, setWallet] = useState(loadInitialWallet);

    useEffect(() => {

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
        } catch (err) {
            console.error("No se pudo guardar la cartera:", err);
        }

    }, [wallet]);

    const getBalance = (userId) => wallet.balances[userId] || 0;

    const getTransactions = (userId) =>
        wallet.transactions
            .filter(t => t.userId === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

    const nextTransactionId = () =>
        wallet.transactions.length > 0
            ? Math.max(...wallet.transactions.map(t => t.id)) + 1
            : 1;

    // Recarga: siempre se puede hacer, mientras el monto sea válido.
    const addFunds = (userId, amount, note = "Recarga de saldo") => {

        if (!userId) return { success: false, error: "No hay sesión activa." };

        if (!amount || amount <= 0) {
            return { success: false, error: "El monto debe ser mayor a cero." };
        }

        setWallet(prev => ({
            balances: {
                ...prev.balances,
                [userId]: (prev.balances[userId] || 0) + amount,
            },
            transactions: [
                {
                    id: nextTransactionId(),
                    userId,
                    type: "recharge",
                    amount,
                    date: new Date().toISOString(),
                    note,
                },
                ...prev.transactions,
            ],
        }));

        return { success: true };

    };

    // Descuento (pago): valida que haya saldo suficiente ANTES de
    // mover nada — igual que ya haces con el inventario al pagar.
    const deductFunds = (userId, amount, note = "Pago de pedido") => {

        if (!userId) return { success: false, error: "No hay sesión activa." };

        const currentBalance = wallet.balances[userId] || 0;

        if (currentBalance < amount) {
            return { success: false, error: "Saldo insuficiente." };
        }

        setWallet(prev => ({
            balances: {
                ...prev.balances,
                [userId]: (prev.balances[userId] || 0) - amount,
            },
            transactions: [
                {
                    id: nextTransactionId(),
                    userId,
                    type: "payment",
                    amount,
                    date: new Date().toISOString(),
                    note,
                },
                ...prev.transactions,
            ],
        }));

        return { success: true };

    };

    return (
        <WalletContext.Provider
            value={{ getBalance, getTransactions, addFunds, deductFunds }}
        >
            {children}
        </WalletContext.Provider>
    );

}

export function useWallet() {

    const context = useContext(WalletContext);

    if (!context) {
        throw new Error("useWallet debe usarse dentro de un <WalletProvider>");
    }

    return context;

}