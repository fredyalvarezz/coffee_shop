import "./SidebarAdmin.css";

import {
    FaChartPie,
    FaCoffee,
    FaBoxes,
    FaClipboardList,
    FaUsers,
    FaChartLine,
    FaCog,
} from "react-icons/fa";

export default function SidebarAdmin({
    page,
    setPage,
}) {
    return (
        <aside className="sidebar-admin">

            <h2 className="sidebar-admin__logo">
                Kopi Admin
            </h2>

            <nav className="sidebar-admin__menu">

                <button
                    className={`sidebar-admin__link ${page === "dashboard" ? "active" : ""
                        }`}
                    onClick={() => setPage("dashboard")}
                >
                    <FaChartPie />
                    Dashboard
                </button>

                <button
                    className={`sidebar-admin__link ${page === "products" ? "active" : ""
                        }`}
                    onClick={() => setPage("products")}
                >
                    <FaCoffee />
                    Productos
                </button>

                <button
                    className={`sidebar-admin__link ${page === "inventory" ? "active" : ""
                        }`}
                    onClick={() => setPage("inventory")}
                >
                    <FaBoxes />
                    Inventario
                </button>

                <button
                    className={`sidebar-admin__link ${page === "orders" ? "active" : ""
                        }`}
                    onClick={() => setPage("orders")}
                >
                    <FaClipboardList />
                    Pedidos
                </button>

                <button
                    className={`sidebar-admin__link ${page === "users" ? "active" : ""
                        }`}
                    onClick={() => setPage("users")}
                >
                    <FaUsers />
                    Usuarios
                </button>

                <button
                    className={`sidebar-admin__link ${page === "reports" ? "active" : ""
                        }`}
                    onClick={() => setPage("reports")}
                >
                    <FaChartLine />
                    Reportes
                </button>

                <button
                    className={`sidebar-admin__link ${page === "settings" ? "active" : ""
                        }`}
                    onClick={() => setPage("settings")}
                >
                    <FaCog />
                    Configuración
                </button>

            </nav>

        </aside>
    );
}