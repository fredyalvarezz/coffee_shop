import "./ProductCard.css";
import { FALLBACK_IMAGE, handleImageError } from "../../../utils/fallbackImage";

export default function ProductCard({ product }) {

    return (

        <article className="product-card">

            <img
                src={product.image || FALLBACK_IMAGE}
                alt={product.title}
                className="product-card__image"
                onError={handleImageError}
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
