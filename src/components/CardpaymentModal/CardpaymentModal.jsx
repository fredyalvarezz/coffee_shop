import { useState } from "react";
import Modal from "../Modal/Modal";
import Toast from "../Toast/Toast";
import "./CardPaymentModal.css";

export default function CardPaymentModal({ onClose, onConfirm }) {

    const [amount, setAmount] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [processing, setProcessing] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const showError = (message) => {
        setToastMessage(message);
        setToastType("warning");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    };

    // Agrupa el número de tarjeta en bloques de 4 mientras se escribe
    const handleCardNumberChange = (e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
        const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
        const formatted = digits.length > 2
            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
            : digits;
        setExpiry(formatted);
    };

    const validate = () => {

        const numericAmount = Number(amount);

        if (!numericAmount || numericAmount <= 0) {
            showError("Escribe un monto válido.");
            return false;
        }

        const rawCardNumber = cardNumber.replace(/\s/g, "");

        if (rawCardNumber.length !== 16) {
            showError("El número de tarjeta debe tener 16 dígitos.");
            return false;
        }

        if (!cardName.trim()) {
            showError("Escribe el nombre tal como aparece en la tarjeta.");
            return false;
        }

        const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);

        if (!expiryMatch) {
            showError("La fecha de vencimiento debe tener el formato MM/AA.");
            return false;
        }

        const month = Number(expiryMatch[1]);
        const year = Number(expiryMatch[2]) + 2000;

        if (month < 1 || month > 12) {
            showError("El mes de vencimiento no es válido.");
            return false;
        }

        const now = new Date();
        const expiryDate = new Date(year, month); // primer día del mes siguiente al de vencimiento

        if (expiryDate <= now) {
            showError("Esa tarjeta ya está vencida.");
            return false;
        }

        if (cvv.length < 3 || cvv.length > 4) {
            showError("El CVV debe tener 3 o 4 dígitos.");
            return false;
        }

        return true;

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validate()) return;

        setProcessing(true);

        // Simula el tiempo de procesamiento de una pasarela real.
        // No se cobra nada de verdad — nada más se agrega el saldo.
        setTimeout(() => {
            setProcessing(false);
            onConfirm(Number(amount));
        }, 1200);

    };

    return (
        <Modal title="Pagar con tarjeta" onClose={onClose}>

            <form className="card-payment__form" onSubmit={handleSubmit}>

                <p className="card-payment__notice">
                    Esta es una simulación — no se hace ningún cargo real
                    ni se guardan tus datos de tarjeta.
                </p>

                <input
                    type="number"
                    min="1"
                    className="card-payment__input"
                    placeholder="Monto a recargar"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={processing}
                />

                <input
                    type="text"
                    inputMode="numeric"
                    className="card-payment__input"
                    placeholder="Número de tarjeta"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    disabled={processing}
                />

                <input
                    type="text"
                    className="card-payment__input"
                    placeholder="Nombre en la tarjeta"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    disabled={processing}
                />

                <div className="card-payment__row">

                    <input
                        type="text"
                        inputMode="numeric"
                        className="card-payment__input"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={handleExpiryChange}
                        disabled={processing}
                    />

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        className="card-payment__input"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        disabled={processing}
                    />

                </div>

                <button
                    type="submit"
                    className="card-payment__button"
                    disabled={processing}
                >
                    {processing ? "Procesando..." : "Pagar"}
                </button>

            </form>

            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
            />

        </Modal>
    );

}