import "./SalesChart.css";

import { useAdmin } from "../../../context/AdminContext";

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function getLastNDays(n) {

    const days = [];

    for (let i = n - 1; i >= 0; i--) {

        const date = new Date();
        date.setDate(date.getDate() - i);

        days.push(date);

    }

    return days;

}

function toDateKey(date) {
    return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// order.createdAt puede ser una fecha completa ISO (pedidos reales) o
// solo "YYYY-MM-DD" (pedidos de la semilla) — ambos comparten el
// mismo prefijo de 10 caracteres, así que comparar así funciona para
// los dos casos sin distinguirlos.
function orderDateKey(order) {
    return String(order.createdAt).slice(0, 10);
}

export default function SalesChart() {

    const { orders } = useAdmin();

    const days = getLastNDays(7);

    const salesByDay = days.map(date => {

        const key = toDateKey(date);

        const total = orders
            .filter(order => orderDateKey(order) === key)
            .reduce((sum, order) => sum + order.total, 0);

        return { key, date, total };

    });

    const maxTotal = Math.max(...salesByDay.map(d => d.total), 1);

    return (
        <div className="sales-chart">

            <h3>Ventas de los últimos 7 días</h3>

            <div className="sales-chart__bars">

                {salesByDay.map(({ key, date, total }) => (

                    <div key={key} className="sales-chart__bar-wrap">

                        <span className="sales-chart__value">
                            {total > 0 ? `$${total}` : ""}
                        </span>

                        <div className="sales-chart__track">
                            <div
                                className="sales-chart__bar"
                                style={{ height: `${(total / maxTotal) * 100}%` }}
                                title={`$${total}`}
                            />
                        </div>

                        <span className="sales-chart__label">
                            {WEEKDAY_LABELS[date.getDay()]}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );

}