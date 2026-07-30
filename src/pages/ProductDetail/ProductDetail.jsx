import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

import "./ProductDetail.css";
import Toast from "../../components/Toast/Toast";
import { FALLBACK_IMAGE, handleImageError } from "../../utils/fallbackImage";

export default function ProductDetail() {

    const navigate = useNavigate();

    const { id } = useParams();

    const { products } = useProducts();

    const product = products.find((p) => p.id === Number(id));

    const { addToCart } = useCart();

    const [size, setSize] = useState(product?.options?.sizes?.[0] || null);

    const [flavor, setFlavor] = useState(product?.options?.flavors?.[0] || null);

    const [milk, setMilk] = useState(product?.options?.milks?.[0] || null);

    const [preparation, setPreparation] = useState(product?.options?.preparationOptions?.[0] || null);

    const [note, setNote] = useState("");

    const [extras, setExtras] = useState({});

    const [coffee, setCoffee] = useState(
        product?.options?.coffee?.[0] || null
    );

    const [showToast, setShowToast] = useState(false);

    // Si el id no corresponde a ningún producto (ej. link viejo, o el
    // producto se borró), evita que truene tratando de leer sus datos.
    if (!product) {
        return (
            <div className="product-detail__not-found">
                <p>No encontramos ese producto.</p>
                <button onClick={() => navigate(-1)}>← Volver</button>
            </div>
        );
    }

    let finalPrice = product.basePrice;

    if (size === "Mediano") finalPrice += 5;
    if (size === "Grande") finalPrice += 10;

    if (preparation === "Frío") finalPrice += 5;
    if (preparation === "Frappé") finalPrice += 10;

    product.options?.extras?.forEach((extra) => {

        if (extras[extra.id]) {

            finalPrice += extra.price;

        }

    });

    const toggleExtra = (name) => {
        setExtras({
            ...extras,
            [name]: !extras[name],
        });
    };

    return (
        <div className="product-detail">

            {/* Left */}
            <div className="product-detail__left">

                <div className="product-detail__image-wrapper">
                    <img
                        src={product.image || FALLBACK_IMAGE}
                        alt={product.title}
                        className="product-detail__image"
                        onError={handleImageError}
                    />
                </div>

                <div className="product-detail__info">
                    <h1>{product.title}</h1>

                    {product.options?.infusionType && (
                        <p className="product-detail__badge">
                            Infusión: {product.options.infusionType}
                        </p>
                    )}

                    <p>{product.description}</p>

                    <h2>${finalPrice}</h2>
                </div>

            </div>

            {/* Right */}


            <div className="product-detail__right">
                <button
                    className="product-detail__back"
                    onClick={() => navigate(-1)}
                >
                    ← Atras
                </button>

                {/* Preparacion */}
                {product.options?.preparationOptions?.length > 0 && (
                    <div className="product-detail__section">

                        <h3>Preparación</h3>

                        <div className="product-detail__chips">
                            {product.options.preparationOptions.map((p) => (
                                <button
                                    key={p}
                                    className={`chip ${preparation === p ? "chip--active" : ""}`}
                                    onClick={() => setPreparation(p)}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                {/* Tamaños */}
                {product.options?.sizes?.length > 0 && (
                    <div className="product-detail__section">

                        <h3>Tamaño</h3>

                        <div className="product-detail__chips">

                            {product.options.sizes.map((s) => (
                                <button
                                    key={s}
                                    className={`chip ${size === s ? "chip--active" : ""}`}
                                    onClick={() => setSize(s)}
                                >
                                    {s}
                                </button>
                            ))}

                        </div>

                    </div>
                )}

                {product.options?.coffee?.length > 0 && (

                    <div className="product-detail__section">

                        <h3>Tipo de café</h3>

                        <div className="product-detail__chips">

                            {product.options.coffee.map((c) => (

                                <button
                                    key={c}
                                    className={`chip ${coffee === c ? "chip--active" : ""
                                        }`}
                                    onClick={() => setCoffee(c)}
                                >

                                    {c}

                                </button>

                            ))}

                        </div>

                    </div>

                )}

                {/* Leches */}
                {product.options?.milks?.length > 0 && (
                    <div className="product-detail__section">

                        <h3>Leche</h3>

                        <div className="product-detail__chips">

                            {product.options.milks.map((m) => (
                                <button
                                    key={m}
                                    className={`chip ${milk === m ? "chip--active" : ""}`}
                                    onClick={() => setMilk(m)}
                                >
                                    {m}
                                </button>
                            ))}

                        </div>

                    </div>
                )}

                {/* Sabores */}
                {product.options?.flavors?.length > 0 && (
                    <div className="product-detail__section">

                        <h3>Sabores</h3>

                        <div className="product-detail__chips">

                            {product.options.flavors.map((f) => (
                                <button
                                    key={f}
                                    className={`chip ${flavor === f ? "chip--active" : ""}`}
                                    onClick={() => setFlavor(f)}
                                >
                                    {f}
                                </button>
                            ))}

                        </div>

                    </div>
                )}



                {/* Extras */}
                {product.options?.extras?.length > 0 && (

                    <div className="product-detail__section">

                        <h3>Extras</h3>

                        <div className="product-detail__extras">

                            {product.options.extras.map(extra => (

                                <label key={extra.id}>

                                    <input
                                        type="checkbox"
                                        checked={extras[extra.id] || false}
                                        onChange={() => toggleExtra(extra.id)}
                                    />

                                    {extra.name}

                                    {extra.price > 0 && ` (+$${extra.price})`}

                                </label>

                            ))}

                        </div>

                    </div>

                )}
                {/* Notas */}
                <div className="product-detail__section">

                    <h3>Notas</h3>

                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="¿Alguna indicación especial para tu pedido?"
                    />

                </div>

                {/* Button */}
                <button
                    className="product-detail__button"
                    onClick={() => {

                        addToCart({
                            id: product.id,
                            title: product.title,
                            image: product.image,
                            price: finalPrice,
                            size,
                            coffee,
                            infusion: product.options?.infusionType || null,
                            milk,
                            flavor,
                            extras,
                            preparation,
                            note,
                            qty: 1,
                        });

                        setShowToast(true);

                        setTimeout(() => {
                            navigate(-1);
                        }, 1200);

                    }}
                >
                    Agregar al carrito · ${finalPrice}
                </button>
                <Toast
                    message="Producto agregado 🛒"
                    type="success"
                    isVisible={showToast}
                />

            </div>

        </div>
    );
}
