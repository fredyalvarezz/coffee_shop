import "./TopProducts.css";

import products from "../../../data/products";
import orders from "../../../data/orders";

export default function TopProducts() {

    const sales = {};

    orders.forEach((order) => {

        order.items.forEach((item) => {

            sales[item.productId] =
                (sales[item.productId] || 0) + item.quantity;

        });

    });

    const ranking = products
        .map((product) => ({
            ...product,
            sold: sales[product.id] || 0,
        }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);

    return (

        <section className="top-products">

            <h2>

                Productos más vendidos

            </h2>

            {ranking.map((product) => (

                <div
                    key={product.id}
                    className="top-products__item"
                >

                    <span>

                        {product.title}

                    </span>

                    <strong>

                        {product.sold} ventas

                    </strong>

                </div>

            ))}

        </section>

    );

}