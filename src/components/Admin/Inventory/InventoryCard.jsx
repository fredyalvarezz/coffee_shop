import "./InventoryCard.css";

export default function InventoryCard({ item, onEdit, onDelete }) {

    const isLow = item.stock <= item.minimum;

    return (

        <article className="inventory-card">

            <div className="inventory-card__body">

                <h3>{item.name}</h3>

                <p className="inventory-card__stock">
                    {item.stock} {item.unit}
                </p>

                <span className="inventory-card__minimum">
                    Mínimo: {item.minimum} {item.unit}
                </span>

                <span
                    className={
                        isLow
                            ? "inventory-card__badge inventory-card__badge--low"
                            : "inventory-card__badge inventory-card__badge--ok"
                    }
                >
                    {isLow ? "Bajo stock" : "Disponible"}
                </span>

                <div className="inventory-card__actions">

                    <button
                        className="inventory-card__edit"
                        onClick={onEdit}
                    >
                        Editar
                    </button>

                    <button
                        className="inventory-card__delete"
                        onClick={onDelete}
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        </article>

    );

}
