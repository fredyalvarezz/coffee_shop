import "./Cartera.css";

import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useWallet } from "../../context/WalletContext";
import Toast from "../../components/Toast/Toast";
import CardPaymentModal from "../../components/CardPaymentModal/CardPaymentModal";
import { FaWallet, FaPlus, FaCreditCard } from "react-icons/fa";

const PRESET_AMOUNTS = [50, 100, 200, 500];

function formatDate(isoString) {

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) return isoString;

    return date.toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });

}

export default function Cartera() {

    const { user } = useAuth();
    const { getBalance, getTransactions, addFunds } = useWallet();

    const [customAmount, setCustomAmount] = useState("");
    const [showCardModal, setShowCardModal] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const notify = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1500);
    };

    if (!user) {
        return (
            <div className="cartera cartera--empty">
                <h2>Debes iniciar sesión para ver tu cartera.</h2>
            </div>
        );
    }

    const balance = getBalance(user.id);
    const transactions = getTransactions(user.id);

    const handleRecharge = (amount) => {

        const result = addFunds(user.id, amount, "Recarga de saldo");

        if (result.success) {
            notify(`Se agregaron $${amount} a tu cartera ✅`);
        } else {
            notify(result.error, "warning");
        }

    };

    const handleCustomRecharge = () => {

        const amount = Number(customAmount);

        if (!amount || amount <= 0) {
            notify("Escribe un monto válido.", "warning");
            return;
        }

        handleRecharge(amount);

        setCustomAmount("");

    };

    const handleCardPaymentConfirm = (amount) => {

        setShowCardModal(false);

        const result = addFunds(user.id, amount, "Recarga con tarjeta");

        if (result.success) {
            notify(`Se agregaron $${amount} a tu cartera con tarjeta ✅`);
        } else {
            notify(result.error, "warning");
        }

    };

    return (
        <section className="cartera">

            <div className="cartera__balance-card">

                <FaWallet className="cartera__balance-icon" />

                <div>
                    <p className="cartera__balance-label">Saldo disponible</p>
                    <h1 className="cartera__balance-amount">${balance.toFixed(2)}</h1>
                </div>

            </div>

            <div className="cartera__block">

                <h3>Recargar saldo</h3>

                <div className="cartera__presets">
                    {PRESET_AMOUNTS.map(amount => (
                        <button
                            key={amount}
                            onClick={() => handleRecharge(amount)}
                        >
                            +${amount}
                        </button>
                    ))}
                </div>

                <div className="cartera__custom">
                    <input
                        type="number"
                        min="1"
                        placeholder="Otra cantidad"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                    />
                    <button onClick={handleCustomRecharge}>
                        <FaPlus />
                        Agregar
                    </button>
                </div>

                <button
                    className="cartera__card-button"
                    onClick={() => setShowCardModal(true)}
                >
                    <FaCreditCard />
                    Pagar con tarjeta
                </button>

            </div>

            <div className="cartera__block">

                <h3>Movimientos</h3>

                {transactions.length === 0 ? (
                    <p className="cartera__empty-history">
                        Todavía no tienes movimientos.
                    </p>
                ) : (
                    <div className="cartera__transactions">

                        {transactions.map(t => (
                            <div key={t.id} className="cartera__transaction">

                                <div>
                                    <p className="cartera__transaction-note">{t.note}</p>
                                    <p className="cartera__transaction-date">{formatDate(t.date)}</p>
                                </div>

                                <span
                                    className={`cartera__transaction-amount cartera__transaction-amount--${t.type}`}
                                >
                                    {t.type === "recharge" ? "+" : "-"}${t.amount}
                                </span>

                            </div>
                        ))}

                    </div>
                )}

            </div>

            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
            />

            {showCardModal && (
                <CardPaymentModal
                    onClose={() => setShowCardModal(false)}
                    onConfirm={handleCardPaymentConfirm}
                />
            )}

        </section>
    );

}