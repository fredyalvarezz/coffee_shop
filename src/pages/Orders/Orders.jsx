import { useCart } from "../../context/CartContext";

import "./Orders.css";

export default function Orders() {

    const {
        cart,
        total,
        increaseQty,
        decreaseQty,
    } = useCart();

    const getExtras = (extras) => {

        return Object.entries(extras)
            .filter(([key, value]) => value)
            .map(([key]) => key)
            .join(", ");

    };

    return (

        <div className="orders">

            {/* LEFT */}
            <div className="orders__items">

                <h1>Mi Pedido</h1>

                {cart.length === 0 && (
                    <p>Tu carrito está vacío</p>
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

                <button className="orders__pay">
                    Pagar
                </button>

            </div>

        </div>
    );
}