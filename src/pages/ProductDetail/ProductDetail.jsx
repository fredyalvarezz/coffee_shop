import { useState } from "react";
import { useParams } from "react-router-dom";
import products from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

import "./ProductDetail.css";
import Toast from "../../components/Toast/Toast";

export default function ProductDetail() {

    const navigate = useNavigate();

    const { id } = useParams();

    const product = products.find((p) => p.id === Number(id));

    const { addToCart } = useCart();

    const [size, setSize] = useState(product.options?.sizes?.[0] || null);

    const [flavor, setFlavor] = useState(product.options?.flavors?.[0] || null);

    const [milk, setMilk] = useState(product.options?.milks?.[0] || null);

    const [style, setStyle] = useState(product.options?.styles?.[0] || null);

    const [note, setNote] = useState("");

    const [extras, setExtras] = useState({}); 

    const [coffee, setCoffee] = useState(
        product.options?.coffee?.[0] || null
    );

    const [showToast, setShowToast] = useState(false);

    let finalPrice = product.basePrice;

    if (size === "mediano") finalPrice += 5;
    if (size === "grande") finalPrice += 10;

    if (style === "frio") finalPrice += 5;
    if (style === "frappe") finalPrice += 10;

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
                        src={product.image}
                        alt={product.title}
                        className="product-detail__image"
                    />
                </div>

                <div className="product-detail__info">
                    <h1>{product.title}</h1>

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
                {product.options?.styles?.length > 0 && (
                    <div className="product-detail__section">

                        <h3>Preparación</h3>

                        <div className="product-detail__chips">
                            {product.options.styles.map((s) => (
                                <button
                                    key={s}
                                    className={`chip ${style === s ? "chip--active" : ""}`}
                                    onClick={() => setStyle(s)}
                                >
                                    {s}
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
                            milk,
                            flavor,
                            extras,
                            style,
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