import "./TopProducts.css";

import { useAdmin } from "../../../context/AdminContext";

export default function TopProducts() {

    const { orders } = useAdmin();

    const counts = {};

    orders.forEach(order => {

        (order.items || []).forEach(item => {

            // Usamos el título guardado en el pedido (no el producto
            // actual) — así, aunque el producto se edite o se borre
            // después, el conteo histórico sigue siendo correcto.
            const key = item.title || `Producto #${item.productId}`;

            counts[key] = (counts[key] || 0) + (item.quantity || 0);

        });

    });

    const topFive = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const maxCount = topFive.length > 0 ? topFive[0][1] : 1;

    return (
        <div className="top-products">

            <h3>Productos más vendidos</h3>

            {topFive.length === 0 ? (
                <p className="top-products__empty">
                    Todavía no hay ventas registradas.
                </p>
            ) : (
                <div className="top-products__list">

                    {topFive.map(([title, qty], index) => (

                        <div key={title} className="top-products__row">

                            <span className="top-products__rank">
                                {index + 1}
                            </span>

                            <div className="top-products__info">

                                <div className="top-products__row-header">
                                    <span className="top-products__name">
                                        {title}
                                    </span>
                                    <span className="top-products__qty">
                                        {qty} {qty === 1 ? "unidad" : "unidades"}
                                    </span>
                                </div>

                                <div className="top-products__bar-track">
                                    <div
                                        className="top-products__bar-fill"
                                        style={{ width: `${(qty / maxCount) * 100}%` }}
                                    />
                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );

}