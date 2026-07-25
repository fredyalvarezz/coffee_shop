import "./ProductCard.css";

export default function ProductCard({ product }) {

    return (

        <article className="product-card">

            <img
                src={product.image}
                alt={product.title}
                className="product-card__image"
            />

            <div className="product-card__body">

                <h3>{product.title}</h3>

                <p>${product.basePrice}</p>

                <span>

                    {product.menuCategory}

                </span>

                <span
                    className={
                        product.stock
                            ? "product-card__stock"
                            : "product-card__stock product-card__stock--off"
                    }
                >

                    {product.stock ? "Disponible" : "Agotado"}

                </span>

                <button>

                    Editar

                </button>

            </div>

        </article>

    );

}