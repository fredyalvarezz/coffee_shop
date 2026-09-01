import "./Orders.css";

import { useState } from "react";

import { useAdmin } from "../../../context/AdminContext";
import { FaSearch } from "react-icons/fa";

const STATUS_LABELS = {
    pending: "Pendiente",
    preparing: "Preparando",
    completed: "Completado",
    cancelled: "Cancelado",
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

function formatDate(isoString) {

    if (!isoString) return "";

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) return isoString; // ej. "2026-07-13" de la semilla

    return date.toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });

}

export default function Orders() {

    const { orders, updateOrderStatus } = useAdmin();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos");

    const filteredOrders = orders.filter((order) => {

        const text = search.toLowerCase();

        const matchesSearch =
            String(order.id).includes(text) ||
            (order.customer || "").toLowerCase().includes(text);

        const matchesStatus =
            statusFilter === "Todos" || order.status === statusFilter;

        return matchesSearch && matchesStatus;

    });

    return (
        <section className="admin-orders">

            <div className="admin-orders__header">

                <h1>Pedidos</h1>

                <div className="admin-orders__controls">

                    <div className="admin-orders__search-container">
                        <FaSearch className="admin-orders__search-icon" />
                        <input
                            type="text"
                            className="admin-orders__search"
                            placeholder="Buscar por cliente o #..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="admin-orders__select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="Todos">Todos los estados</option>
                        {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            <p className="admin-orders__count">
                {filteredOrders.length} pedidos encontrados
            </p>

            {filteredOrders.length === 0 ? (
                <p className="admin-orders__empty">
                    Todavía no hay pedidos que coincidan.
                </p>
            ) : (
                <div className="admin-orders__list">

                    {filteredOrders.map((order) => (

                        <div key={order.id} className="admin-orders__card">

                            <div className="admin-orders__card-header">

                                <div>
                                    <h3>Pedido #{order.id}</h3>
                                    <p className="admin-orders__customer">
                                        {order.customer || "Invitado"}
                                        {" · "}
                                        {formatDate(order.createdAt)}
                                    </p>
                                </div>

                                <div className="admin-orders__card-actions">

                                    <span
                                        className={`admin-orders__badge admin-orders__badge--${order.paymentStatus === "paid" ? "ok" : "warn"
                                            }`}
                                    >
                                        {order.paymentStatus === "paid" ? "Pagado" : "Pendiente de pago"}
                                    </span>

                                    <select
                                        className={`admin-orders__status admin-orders__status--${order.status}`}
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map(status => (
                                            <option key={status} value={status}>
                                                {STATUS_LABELS[status]}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                            </div>

                            <div className="admin-orders__items">

                                {(order.items || []).map((item, index) => (
                                    <div key={index} className="admin-orders__item">

                                        <span className="admin-orders__item-qty">
                                            {item.quantity}×
                                        </span>

                                        <span className="admin-orders__item-title">
                                            {item.title || `Producto #${item.productId}`}
                                        </span>

                                        <span className="admin-orders__item-detail">
                                            {[item.size, item.milk, item.coffee, item.infusion, item.flavor]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </span>

                                    </div>
                                ))}

                            </div>

                            <div className="admin-orders__total">
                                Total: ${order.total}
                            </div>

                        </div>

                    ))}

                </div>
            )}

        </section>
    );

}