import { useState } from "react";

import { useProducts } from "../../../context/ProductsContext";
import { useCatalog } from "../../../context/CatalogContext";
import { useInventory } from "../../../context/InventoryContext";
import Toast from "../../../components/Toast/Toast";

import {
    productTypes,
    menuCategories,
    menuCategoriesByProductType,
    sizes,
    preparationOptions,
    productTypeConfig,
    defaultProductTypeConfig,
} from "../../../data/productOptions";

import "./ProductForm.css";

const initialFormState = {
    title: "",
    description: "",
    basePrice: "",
    productType: "Café",
    menuCategory: "Calientes",
    image: "",
    stock: true,
    customizable: true,

    // Receta: qué insumos del Inventario consume UNA unidad de este
    // producto al venderse, y cuánto de cada uno. Es la misma para
    // cualquier variante que elija el cliente (leche/sabor/etc no la
    // cambian) — mantenerlo simple a propósito.
    recipe: [],

    options: {
        coffee: [],
        infusionType: "",
        containsCoffee: false,
        sizes: [],
        flavors: [],
        milks: [],
        preparationOptions: [],
        extras: [],
    },
};

// Convierte un producto ya existente (el que se va a editar) a la misma
// forma que usa el estado del formulario. Si no hay producto (modo
// "crear"), regresa el estado inicial vacío de siempre.
function buildFormFromProduct(product) {

    if (!product) return initialFormState;

    return {
        title: product.title || "",
        description: product.description || "",
        basePrice: product.basePrice ?? "",
        productType: product.productType || "Café",
        menuCategory: product.menuCategory || "Calientes",
        image: product.image || "",
        stock: product.stock ?? true,
        customizable: product.customizable ?? true,
        recipe: product.recipe || [],
        options: {
            coffee: product.options?.coffee || [],
            infusionType: product.options?.infusionType || "",
            containsCoffee: product.options?.containsCoffee || false,
            sizes: product.options?.sizes || [],
            flavors: product.options?.flavors || [],
            milks: product.options?.milks || [],
            preparationOptions: product.options?.preparationOptions || [],
            extras: product.options?.extras || [],
        },
    };

}

// product: si se manda, el formulario entra en modo "editar" (precargado
//          con sus datos, y guarda con updateProduct en vez de addProduct)
// onDone:  se llama después de guardar (en modo editar) o al cancelar,
//          para que la pantalla que lo use decida a dónde regresar
export default function ProductForm({ product = null, onDone = () => {} }) {

    const { addProduct, updateProduct } = useProducts();

    const { catalog } = useCatalog();

    const { inventory } = useInventory();

    const { coffeeOptions, infusionOptions, milks, extras, flavorGroups } = catalog;

    const isEditing = Boolean(product);

    const [showToast, setShowToast] = useState(false);

    const [form, setForm] = useState(() => buildFormFromProduct(product));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleOptionChange = (group, value) => {

        setForm(prev => {

            const currentOptions = prev.options[group];

            const exists = currentOptions.includes(value);

            return {
                ...prev,
                options: {
                    ...prev.options,
                    [group]: exists
                        ? currentOptions.filter(item => item !== value)
                        : [...currentOptions, value],
                },
            };

        });

    };

    const handleExtraToggle = (extra) => {

        setForm(prev => {

            const exists = prev.options.extras.some(item => item.id === extra.id);

            return {
                ...prev,
                options: {
                    ...prev.options,
                    extras: exists
                        ? prev.options.extras.filter(item => item.id !== extra.id)
                        : [...prev.options.extras, extra],
                },
            };

        });

    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            setForm(prev => ({
                ...prev,
                image: reader.result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const addRecipeLine = () => {

        setForm(prev => ({
            ...prev,
            recipe: [
                ...prev.recipe,
                { inventoryItemId: inventory[0]?.id || "", amount: "" },
            ],
        }));

    };

    const updateRecipeLine = (index, field, value) => {

        setForm(prev => ({
            ...prev,
            recipe: prev.recipe.map((line, i) =>
                i === index ? { ...line, [field]: value } : line
            ),
        }));

    };

    const removeRecipeLine = (index) => {

        setForm(prev => ({
            ...prev,
            recipe: prev.recipe.filter((_, i) => i !== index),
        }));

    };

    const handleInfusionTypeChange = (e) => {
        const value = e.target.value;

        setForm(prev => ({
            ...prev,
            options: {
                ...prev.options,
                infusionType: value,
            },
        }));
    };

    const handleContainsCoffeeToggle = (e) => {
        const checked = e.target.checked;

        setForm(prev => ({
            ...prev,
            options: {
                ...prev.options,
                containsCoffee: checked,
                // si desmarcan "lleva café", limpia el tipo de café elegido
                coffee: checked ? prev.options.coffee : [],
            },
        }));
    };

    // Cuando cambias de productType, las selecciones que ya no aplican
    // (ejemplo. sabores de café guardados y te cambias a Postre) se limpian,
    // para no guardar opciones "fantasma" en un producto que no las usa.
    const handleProductTypeChange = (e) => {
        const newType = e.target.value;

        const validCategories = menuCategoriesByProductType[newType] || menuCategories;

        setForm(prev => ({
            ...prev,
            productType: newType,
            // Si la categoría de menú actual ya no aplica para el nuevo
            // tipo (ej. tenías "Calientes" y cambiaste a "Frappé"), se
            // cambia automáticamente a la primera válida para ese tipo.
            menuCategory: validCategories.includes(prev.menuCategory)
                ? prev.menuCategory
                : validCategories[0],
            options: {
                coffee: [],
                infusionType: "",
                containsCoffee: false,
                sizes: [],
                flavors: [],
                milks: [],
                preparationOptions: prev.options.preparationOptions,
                extras: prev.options.extras,
            },
        }));
    };

    // Config del tipo de producto seleccionado. Si el productType no tiene
    // entrada en productTypeConfig (ej. agregaste uno nuevo y se te olvidó
    // configurarlo), usa un default seguro en vez de tronar.
    const config = productTypeConfig[form.productType] || defaultProductTypeConfig;

    // Categorías de menú permitidas para el productType actual (ej. Frappé
    // solo puede ir en "Frappés"). Si no hay entrada configurada, se
    // muestran todas por seguridad en vez de dejar el select vacío.
    const availableMenuCategories = menuCategoriesByProductType[form.productType] || menuCategories;

    // El bloque de café se muestra si el productType lo trae por default
    // (config.coffee), O si este productType permite el checkbox "¿Lleva
    // café?" (config.coffeeToggle) y el admin lo marcó para este producto
    // en particular (ej. este Chai Latte específico sí es "Dirty").
    const showCoffee = config.coffee || (config.coffeeToggle && form.options.containsCoffee);

    // Grupo de sabores a usar (o null si este producto no lleva sabores)
    const activeFlavors = config.flavors ? flavorGroups[config.flavors] : null;

    // El bloque de Preparación no depende del tipo de producto, depende
    // de la categoría del menú: solo aplica para "Temporada", porque en
    // las demás categorías la forma de preparación ya está implícita.
    const showPreparation = form.menuCategory === "Temporada";

    // Validación mínima antes de guardar: sin nombre o sin precio no
    // tiene caso crear el producto. Se puede ampliar después (ej. exigir
    // que se haya elegido infusionType si config.infusionType es true).
    const isValid = form.title.trim().length > 0 && Number(form.basePrice) > 0;

    const handleSaveProduct = () => {

        if (!isValid) {
            alert("Ponle un nombre y un precio válido al producto antes de guardar.");
            return;
        }

        const cleanRecipe = form.recipe
            .filter(line => line.inventoryItemId && Number(line.amount) > 0)
            .map(line => ({
                inventoryItemId: Number(line.inventoryItemId),
                amount: Number(line.amount),
            }));

        const productData = {
            title: form.title.trim(),
            description: form.description.trim(),
            basePrice: Number(form.basePrice),
            productType: form.productType,
            menuCategory: form.menuCategory,
            image: form.image,
            stock: form.stock,
            customizable: form.customizable,
            recipe: cleanRecipe,
            options: form.options,
        };

        if (isEditing) {

            updateProduct(product.id, productData);

            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
                onDone();
            }, 900);

        } else {

            addProduct(productData);

            setForm(initialFormState);

            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 1500);

        }

    };

    return (

        <section className="product-form">

            <h2 className="product-form__title">
                {isEditing ? "Editar Producto" : "Nuevo Producto"}
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
                        name="title"
                        value={form.title}
                        onChange={handleChange}
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
                        name="description"
                        value={form.description}
                        onChange={handleChange}
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
                        name="basePrice"
                        value={form.basePrice}
                        onChange={handleChange}
                        placeholder="$0"
                    />
                </div>

                {/* Categoría / Tipo de producto */}
                <div className="product-form__group">
                    <label className="product-form__label">
                        Tipo de producto
                    </label>
                    <select className="product-form__select"
                        name="productType"
                        value={form.productType}
                        onChange={handleProductTypeChange}
                    >
                        {productTypes.map(type => (
                            <option key={type} value={type}>
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
                    <select className="product-form__select"
                        name="menuCategory"
                        value={form.menuCategory}
                        onChange={handleChange}
                    >
                        {availableMenuCategories.map(menu => (
                            <option key={menu} value={menu}>
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
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {form.image && (
                        <img
                            src={form.image}
                            alt="Vista previa"
                            className="product-form__image-preview"
                        />
                    )}
                </div>

            </div>

            {/* Estado */}
            <div className="product-form__switches">

                <label className="product-form__checkbox">
                    <input type="checkbox"
                        name="stock"
                        checked={form.stock}
                        onChange={handleChange}
                    />
                    Disponible
                </label>

                <label className="product-form__checkbox">
                    <input type="checkbox"
                        name="customizable"
                        checked={form.customizable}
                        onChange={handleChange}
                    />
                    Personalizable
                </label>

            </div>

            {/* Opciones — cada bloque se muestra según la config del
                productType seleccionado (o según menuCategory / según otra
                opción elegida, en los casos de Preparación y Café).
                Agregar un producto nuevo NO requiere tocar este JSX. */}
            <div className="product-form__options">

                {/* Tipo de infusión — se elige UNA sola, del inventario en
                    infusionOptions. El checkbox de abajo define si ESTE
                    producto en particular lleva café (ej. Dirty Chai) */}
                {config.infusionType && (
                    <div className="product-form__block">
                        <h3 className="product-form__subtitle">
                            Tipo de infusión
                        </h3>
                        <select className="product-form__select"
                            value={form.options.infusionType}
                            onChange={handleInfusionTypeChange}
                        >
                            <option value="" disabled>
                                Selecciona una infusión
                            </option>
                            {infusionOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        {config.coffeeToggle && (
                            <label className="product-form__checkbox">
                                <input type="checkbox"
                                    checked={form.options.containsCoffee}
                                    onChange={handleContainsCoffeeToggle}
                                />
                                ¿Lleva café? (ej. Dirty Chai)
                            </label>
                        )}
                    </div>
                )}

                {/* Café — aparece por default en Café, o automáticamente
                    si eligieron una opción que lleva café (ej. Dirty Chai) */}
                {showCoffee && (
                    <div className="product-form__block">
                        <h3 className="product-form__subtitle">
                            Tipo de café
                        </h3>
                        <div className="product-form__list">
                            {coffeeOptions.map(option => (
                                <label key={option} className="product-form__checkbox">
                                    <input type="checkbox"
                                        checked={form.options.coffee.includes(option)}
                                        onChange={() => handleOptionChange("coffee", option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tamaños */}
                {config.sizes && (
                    <div className="product-form__block">
                        <h3 className="product-form__subtitle">
                            Tamaños
                        </h3>
                        <div className="product-form__list">
                            {sizes.map(option => (
                                <label key={option} className="product-form__checkbox">
                                    <input type="checkbox"
                                        checked={form.options.sizes.includes(option)}
                                        onChange={() => handleOptionChange("sizes", option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Leches */}
                {config.milks && (
                    <div className="product-form__block">
                        <h3 className="product-form__subtitle">
                            Leches
                        </h3>
                        <div className="product-form__list">
                            {milks.map(option => (
                                <label key={option} className="product-form__checkbox">
                                    <input type="checkbox"
                                        checked={form.options.milks.includes(option)}
                                        onChange={() => handleOptionChange("milks", option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sabores — usa el grupo de sabores que le toca a este
                    productType (activeFlavors), nunca se mezclan entre sí */}
                {activeFlavors && (
                    <div className="product-form__block">
                        <h3 className="product-form__subtitle">
                            Sabores
                        </h3>
                        <div className="product-form__list">
                            {activeFlavors.map(option => (
                                <label key={option} className="product-form__checkbox">
                                    <input type="checkbox"
                                        checked={form.options.flavors.includes(option)}
                                        onChange={() => handleOptionChange("flavors", option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Preparación - solo para productos de Temporada, donde
                    la forma de servirlo no está fija por la categoría */}
                {showPreparation && (
                    <div className="product-form__block">
                        <h3 className="product-form__subtitle">
                            Preparación
                        </h3>
                        <div className="product-form__list">
                            {preparationOptions.map(option => (
                                <label key={option} className="product-form__checkbox">
                                    <input type="checkbox"
                                        checked={form.options.preparationOptions.includes(option)}
                                        onChange={() => handleOptionChange("preparationOptions", option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Extras */}
                {config.extras && (
                    <div className="product-form__block">
                        <h3 className="product-form__subtitle">
                            Extras
                        </h3>
                        <div className="product-form__list">
                            {extras.map(extra => (
                                <label key={extra.id} className="product-form__checkbox">
                                    <input type="checkbox"
                                        checked={form.options.extras.some(item => item.id === extra.id)}
                                        onChange={() => handleExtraToggle(extra)}
                                    />
                                    {extra.name}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Receta — qué insumos del Inventario consume este producto
                por unidad vendida. Se aplica sin importar el productType,
                por eso va fuera del grid de "Opciones". */}
            <div className="product-form__block product-form__recipe">

                <h3 className="product-form__subtitle">
                    Receta (descuenta del inventario al venderse)
                </h3>

                {inventory.length === 0 ? (
                    <p className="product-form__hint">
                        Todavía no tienes insumos en Inventario. Agrega
                        alguno ahí primero para poder ligarlo aquí.
                    </p>
                ) : (
                    <>
                        {form.recipe.map((line, index) => {

                            const selectedItem = inventory.find(
                                i => i.id === Number(line.inventoryItemId)
                            );

                            return (
                                <div key={index} className="product-form__recipe-row">

                                    <select
                                        value={line.inventoryItemId}
                                        onChange={(e) =>
                                            updateRecipeLine(index, "inventoryItemId", e.target.value)
                                        }
                                    >
                                        {inventory.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        min="0"
                                        value={line.amount}
                                        onChange={(e) =>
                                            updateRecipeLine(index, "amount", e.target.value)
                                        }
                                        placeholder="Cantidad"
                                    />

                                    <span className="product-form__recipe-unit">
                                        {selectedItem?.unit}
                                    </span>

                                    <button
                                        type="button"
                                        className="product-form__recipe-remove"
                                        onClick={() => removeRecipeLine(index)}
                                    >
                                        Quitar
                                    </button>

                                </div>
                            );

                        })}

                        <button
                            type="button"
                            className="product-form__button product-form__button--secondary product-form__recipe-add"
                            onClick={addRecipeLine}
                        >
                            + Agregar insumo a la receta
                        </button>
                    </>
                )}

            </div>

            <div className="product-form__actions">

                <button className="product-form__button"
                    onClick={handleSaveProduct}
                >
                    {isEditing ? "Guardar cambios" : "Guardar producto"}
                </button>

                {isEditing && (
                    <button
                        type="button"
                        className="product-form__button product-form__button--secondary"
                        onClick={onDone}
                    >
                        Cancelar
                    </button>
                )}

            </div>

            <Toast
                message={isEditing ? "Cambios guardados ✅" : "Producto guardado ✅"}
                type="success"
                isVisible={showToast}
            />

        </section>

    );

}
