import Modal from "../Modal/Modal";
import "./CartModal.css";
import { useCart } from "../../context/CartContext";

export default function CartModal({ onClose }) {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    total,
  } = useCart();

  return (
    <Modal onClose={onClose}>
      <h2>Tu pedido 🛒</h2>

      {cart.length === 0 && <p>Carrito vacío</p>}

      {cart.map((item, index) => (
        <div key={index} className="cart-item">

          {/* IZQUIERDA */}
          <div className="cart-item__info">
            <h4>{item.title}</h4>

            <p>{item.style} • {item.size} • {item.milk}</p>
            <p>{item.note && <small>{item.note}</small>}</p>
            <p className="cart-item__flavor">
              Sabor: {item.flavor}
            </p>

            <small>
              {Object.entries(item.extras)
                .filter(([_, val]) => val)
                .map(([key]) => key)
                .join(", ") || "Sin extras"}
            </small>
          </div>

          {/* DERECHA */}
          <div className="cart-item__actions">
            <p>${item.price * item.qty}</p>

            <div className="cart-item__qty">
              <button onClick={() => decreaseQty(index)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => increaseQty(index)}>+</button>
            </div>

            {/* <button className="cart-item__delete" onClick={() => removeFromCart(index)}>✕</button>*/}
          </div>

        </div>
      ))}

      <h3>Total: ${total}</h3>

      <button className="cart__pay">Pagar</button>
    </Modal>
  );
}