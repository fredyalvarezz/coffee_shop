import "./OrdersTable.css";

import { useAdmin } from "../../../context/AdminContext";

// Traduce el status real (en inglés, para que combine con AdminOrders.jsx)
// al texto y a la clase CSS en español que ya tenías armados aquí.
const STATUS_STYLE = {
    pending: { label: "Pendiente", className: "pendiente" },
    preparing: { label: "Preparando", className: "preparando" },
    completed: { label: "Completado", className: "entregado" },
    cancelled: { label: "Cancelado", className: "cancelado" },
};

export default function OrdersTable() {

    const { orders } = useAdmin();

    // orders ya viene con el más reciente primero (así lo guarda
    // OrdersContext), así que solo tomamos los primeros 5 para el
    // resumen del dashboard.
    const latestOrders = orders.slice(0, 5);

    return (

        <section className="orders-table">

            <div className="orders-table__header">
                <h2>Últimos pedidos</h2>
            </div>

            <table className="orders-table__table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>

                    {latestOrders.length === 0 && (
                        <tr>
                            <td colSpan={4}>
                                Todavía no hay pedidos.
                            </td>
                        </tr>
                    )}

                    {latestOrders.map((order) => {

                        const style = STATUS_STYLE[order.status] || {
                            label: order.status,
                            className: "pendiente",
                        };

                        return (
                            <tr key={order.id}>

                                <td>#{order.id}</td>

                                <td>{order.customer || "Invitado"}</td>

                                <td>${order.total}</td>

                                <td>
                                    <span
                                        className={`orders-table__status orders-table__status--${style.className}`}
                                    >
                                        {style.label}
                                    </span>
                                </td>

                            </tr>
                        );

                    })}

                </tbody>
            </table>
        </section>
    )
}