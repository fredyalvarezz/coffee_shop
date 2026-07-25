import { useState } from "react";

import {
    coffeeOptions,
    productTypes,
    menuCategories,
    sizes,
    flavors,
    milks,
    styles,
    extras,
} from "../../../data/productOptions";

import "./ProductForm.css";

export default function ProductForm() {

    const [form] = useState({
        title: "",
        description: "",
        basePrice: "",
        productType: "Café",
        menuCategory: "Calientes",
        image: "",
        stock: true,
        customizable: true,

        options: {
            coffee: [],
            sizes: [],
            flavors: [],
            milks: [],
            styles: [],
            extras: [],
        },
    });


    return (

        <section className="product-form">

            <h2 className="product-form__title">
                Nuevo Producto
            </h2>

            <div className="product-form__grid">

                {/* Nombre */}

                <div className="product-form__group">

                    <label className="product-form__label">
                        Nombre
                    </label>

                    <input
                        className="product-form__input"
                        type="text"
                        placeholder="Ej. Latte"
                    />

                </div>

                {/* Descripcion */}
                <div className="product-form__group">

                    <label className="product-form__label">
                        Descripción
                    </label>

                    <textarea
                        className="product-form__textarea"
                        placeholder="Describe el producto..."
                    />

                </div>

                {/* Precio */}

                <div className="product-form__group">

                    <label className="product-form__label">
                        Precio
                    </label>

                    <input
                        className="product-form__input"
                        type="number"
                        placeholder="$0"
                    />

                </div>

                {/* Categoría / Tipo de producto */}

                <div className="product-form__group">

                    <label className="product-form__label">
                        Tipo de producto
                    </label>

                    <select className="product-form__select">

                        {productTypes.map(type => (

                            <option
                                key={type}
                                value={type}
                            >
                                {type}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Categoria menu */}
                <div className="product-form__group">

                    <label className="product-form__label">
                        Menú
                    </label>

                    <select className="product-form__select">

                        {menuCategories.map(menu => (

                            <option
                                key={menu}
                                value={menu}
                            >
                                {menu}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Imagen */}

                <div className="product-form__group">

                    <label className="product-form__label">
                        Imagen
                    </label>

                    <input
                        className="product-form__input"
                        type="text"
                        placeholder="/latte.jpg"
                    />

                </div>

            </div>

            {/* Estado */}

            <div className="product-form__switches">

                <label className="product-form__checkbox">

                    <input type="checkbox" />

                    Disponible

                </label>

                <label className="product-form__checkbox">

                    <input type="checkbox" />

                    Personalizable

                </label>

            </div>

            {/* Opciones */}

            <div className="product-form__options">

                {/* Café */}

                <div className="product-form__block">

                    <h3 className="product-form__subtitle">
                        Tipo de café
                    </h3>

                    <div className="product-form__list">

                        {coffeeOptions.map(option => (

                            <label
                                key={option}
                                className="product-form__checkbox"
                            >

                                <input type="checkbox" />

                                {option}

                            </label>

                        ))}

                    </div>

                </div>

                {/* Tamaños */}

                <div className="product-form__block">

                    <h3 className="product-form__subtitle">
                        Tamaños
                    </h3>

                    <div className="product-form__list">

                        {sizes.map(option => (

                            <label
                                key={option}
                                className="product-form__checkbox"
                            >

                                <input type="checkbox" />

                                {option}

                            </label>

                        ))}

                    </div>

                </div>

                {/* Leches */}

                <div className="product-form__block">

                    <h3 className="product-form__subtitle">
                        Leches
                    </h3>

                    <div className="product-form__list">

                        {milks.map(option => (

                            <label
                                key={option}
                                className="product-form__checkbox"
                            >

                                <input type="checkbox" />

                                {option}

                            </label>

                        ))}

                    </div>

                </div>

                {/* Sabores */}

                <div className="product-form__block">

                    <h3 className="product-form__subtitle">
                        Sabores
                    </h3>

                    <div className="product-form__list">

                        {flavors.map(option => (

                            <label
                                key={option}
                                className="product-form__checkbox"
                            >

                                <input type="checkbox" />

                                {option}

                            </label>

                        ))}

                    </div>

                </div>

                {/* Preparación */}

                <div className="product-form__block">

                    <h3 className="product-form__subtitle">
                        Preparación
                    </h3>

                    <div className="product-form__list">

                        {styles.map(option => (

                            <label
                                key={option}
                                className="product-form__checkbox"
                            >

                                <input type="checkbox" />

                                {option}

                            </label>

                        ))}

                    </div>

                </div>

                {/* Extras */}

                <div className="product-form__block">

                    <h3 className="product-form__subtitle">
                        Extras
                    </h3>

                    <div className="product-form__list">

                        {extras.map(extra => (

                            <label
                                key={extra.id}
                                className="product-form__checkbox"
                            >

                                <input type="checkbox" />

                                {extra.name}

                            </label>

                        ))}

                    </div>

                </div>

            </div>

            <button className="product-form__button">

                Guardar producto

            </button>

        </section>

    );

}