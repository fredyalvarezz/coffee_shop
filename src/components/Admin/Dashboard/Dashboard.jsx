import "./Dashboard.css";

import StatsCard from "../StatsCard/StatsCard";

import OrdersTable from "../OrdersTable/OrdersTable";
import { useAdmin } from "../../../context/AdminContext";



import {
    FaCoffee,
    FaUsers,
    FaClipboardList,
    FaDollarSign,
} from "react-icons/fa";

export default function Dashboard() {

    const {
        products,
        users,
        orders,
    } = useAdmin();

    const totalSales = orders.reduce(
        (sum, order) => sum + order.total,
        0
    );

    // La fecha de hoy en formato "YYYY-MM-DD", para comparar contra
    // order.createdAt. Soporta tanto pedidos reales (fecha completa
    // ISO, ej. "2026-08-24T15:30:00.000Z") como los de la semilla
    // (solo fecha, ej. "2026-07-13") — ambos comparten ese prefijo.
    const todayKey = new Date().toISOString().slice(0, 10);

    const salesToday = orders
        .filter(order => String(order.createdAt).slice(0, 10) === todayKey)
        .reduce((sum, order) => sum + order.total, 0);

    return (

        <section className="dashboard">

            <div className="dashboard__header">

                <h1>

                    Panel de Administración

                </h1>

                <p>

                    Bienvenido al centro de control de Kopi Coffee
                </p>

            </div>

            <div className="dashboard__cards">

                <StatsCard
                    title="Productos"
                    value={products.length}
                    icon={< FaCoffee />}
                />

                <StatsCard
                    title="Usuarios"
                    value={users.length}
                    icon={<FaUsers />}
                />

                <StatsCard
                    title="Pedidos"
                    value={orders.length}
                    icon={<FaClipboardList />}
                />

                <StatsCard
                    title="Ventas Totales"
                    value={`$${totalSales}`}
                    icon={<FaDollarSign />}
                />

                <StatsCard
                    title="Ventas de hoy"
                    value={`$${salesToday}`}
                    icon={<FaDollarSign />}
                />

            </div>

            <OrdersTable />



        </section>
    );
}