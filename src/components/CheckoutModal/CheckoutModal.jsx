import Modal from "../Modal/Modal";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function CheckoutModal({ onClose }) {
    const { cart, total } = useCart();

    const [name, setName] = useState("");
    const [type, setType] = useState("llevar");
    const [payment, setPayment] = useState("efectivo");

    const handleSubmit = () => {
        console.log({
            name,
            type,
            payment,
            cart,
            total
        });
        alert("Pedido enviado");
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <h2>Finalizar pedido</h2>

            <input 
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            />

            <select name="" id=""></select>
        </Modal>
            );

}
