import Modal from "../Modal/Modal";
import { useOrders } from "../../context/OrdersContext";
import "./MyOrdersModal.css";

const STATUS_LABELS = {
    pending: "Pendiente",
    preparing: "Preparando",
    completed: "Completado",
    cancelled: "Cancelado",
};

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

export default function MyOrdersModal({ user, onClose }) {

    const { orders } = useOrders();

    // Pedidos hechos antes de que agregáramos userId a cada pedido no
    // van a aparecer aquí (no tienen forma de saber de quién eran) —
    // solo afecta a pedidos de prueba viejos, los nuevos sí quedan bien.
    const myOrders = orders.filter(order => order.userId === user.id);

    return (

        <Modal
            title="Mis pedidos"
            onClose={onClose}
        >

            {myOrders.length === 0 ? (

                <p className="my-orders__empty">
                    Todavía no has hecho ningún pedido.
                </p>

            ) : (

                <div className="my-orders__list">

                    {myOrders.map(order => (

                        <div key={order.id} className="my-orders__card">

                            <div className="my-orders__card-header">

                                <span className="my-orders__id">
                                    Pedido #{order.id}
                                </span>

                                <span
                                    className={`my-orders__status my-orders__status--${order.status}`}
                                >
                                    {STATUS_LABELS[order.status] || order.status}
                                </span>

                            </div>

                            <p className="my-orders__date">
                                {formatDate(order.createdAt)}
                            </p>

                            <ul className="my-orders__items">
                                {(order.items || []).map((item, index) => (
                                    <li key={index}>
                                        {item.quantity}× {item.title}
                                    </li>
                                ))}
                            </ul>

                            <p className="my-orders__total">
                                Total: ${order.total}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </Modal>

    );

}