import { useState } from "react";
import { useCart } from "../../context/CartContext";

import "./Orders.css";

import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";

export default function Orders() {

    const {
        cart,
        total,
        increaseQty,
        decreaseQty,
        clearCart,
    } = useCart();

    const extraLabels = {
    shot: "Extra Shot",
    foam: "Foam",
    splenda: "Splenda",
    mascabado: "Mascabado",
    stevia: "Stevia",
};

    const getExtras = (extras) => {

        return Object.entries(extras)
            .filter(([key, value]) => value)
            .map(([key]) => extraLabels[key])
            .join(", ");

    };

    const [showConfirm, setShowConfirm] = useState(false);
    const [showToast, setShowToast] = useState(false);

    return (
        <>

            <div className="orders">

                {/* LEFT */}
                <div className="orders__items">

                    <h1>Mi Pedido</h1>

                    {cart.length === 0 && (
                        <div className="orders__empty">
                            <div className="orders__empty-icon">
                                ☕
                            </div>
                            <h2> Aún no agregas bebidas </h2>
                            <p> Explora nuestro menú y encuentra
                                tu café favorito
                            </p>
                        </div>
                    )}

                    {cart.map((item, index) => (

                        <div
                            key={index}
                            className="orders__card"
                        >

                            <img
                                src={item.image}
                                alt={item.title}
                                className="orders__image"
                            />

                            <div className="orders__info">

                                <h3>{item.title}</h3>

                                <p>
                                    {item.size} • {item.milk}
                                </p>

                                <small>
                                    {item.flavor}
                                </small>

                                {item.style && (
                                    <small>
                                        Preparación: {item.style}
                                    </small>
                                )}

                                {getExtras(item.extras) && (
                                    <small>
                                        Extras: {getExtras(item.extras)}
                                    </small>
                                )}

                                {item.note && (
                                    <small>
                                        Nota: {item.note}
                                    </small>
                                )}

                                <h4>
                                    ${item.price * item.qty}
                                </h4>

                            </div>

                            <div className="orders__qty">

                                <button
                                    onClick={() => decreaseQty(index)}
                                >
                                    -
                                </button>

                                <span>{item.qty}</span>

                                <button
                                    onClick={() => increaseQty(index)}
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                {/* RIGHT */}
                <div className="orders__summary">

                    <h2>Resumen</h2>

                    {cart.length > 0 && (
                        <button
                            className="orders__clear"
                            onClick={() => setShowConfirm(true)}
                        >
                            Eliminar pedido
                        </button>
                    )}

                    <div className="orders__row">
                        <span>Subtotal</span>
                        <span>${total}</span>
                    </div>

                    <div className="orders__row">
                        <span>Envío</span>
                        <span>$0</span>
                    </div>

                    <div className="orders__row orders__total">
                        <span>Total</span>
                        <span>${total}</span>
                    </div>

                    <button className="orders__pay"
                    disabled={cart.length === 0}>
                        Pagar
                    </button>

                </div>

            </div>

        {/* Modal Confirmación */}
            {showConfirm && (
                <Modal onClose={() => setShowConfirm(false)}>

                    <div className="orders__confirm">

                        <h2>Eliminar pedido</h2>

                        <p>
                            ¿Seguro que deseas eliminar todos los productos?
                        </p>

                        <div className="orders__confirm-buttons">

                            <button
                                className="orders__confirm-cancel"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="orders__confirm-delete"
                                onClick={() => {

                                    clearCart();

                                    setShowConfirm(false);

                                    setShowToast(true);

                                    setTimeout(() => {
                                        setShowToast(false);
                                    }, 1500);

                                }}
                            >
                                Sí, eliminar
                            </button>

                        </div>

                    </div>

                </Modal>
            )
            }

            {/* Toast */}
            <Toast
                message="Pedido eliminado ☕"
                type="warning"
                isVisible={showToast}
            />
            </>
            );
}