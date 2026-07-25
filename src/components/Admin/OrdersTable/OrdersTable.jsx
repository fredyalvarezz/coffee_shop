import "./OrdersTable.css";

const orders = [
    {
        id: 145,
        customer: "Fredy Alvarez",
        total: "$185",
        status: "Preparando",
    },
    {
        id: 144,
        customer: "Adan Iwaya",
        total: "$95",
        status: "Entregado",
    },
    {
        id: 143,
        customer: "Sergey Nugget",
        total: "$210",
        status: "Cancelado",
    },
    {
        id: 142,
        customer: "Ana Lopez",
        total: "$140",
        status: "Pendiente",
    },

];

export default function OrdersTable() {
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
                    
                    {orders.map((order) => (
                        <tr key={order.id}>

                            <td>#{order.id}</td>

                            <td>{order.customer}</td>

                            <td>{order.total}</td>

                            <td>
                                <span
                                    className={`orders-table__status orders-table__status--${order.status.toLowerCase()}`}
                                >
                                    {order.status}
                                </span>
                            </td>

                        </tr>
                    ))}

                </tbody>
            </table>
        </section>
    )
}