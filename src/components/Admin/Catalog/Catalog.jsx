import "./Catalog.css";

import { useState } from "react";

import { useCatalog } from "../../../context/CatalogContext";
import Toast from "../../../components/Toast/Toast";
import { FaTimes, FaPlus } from "react-icons/fa";

// Editor genérico para una lista simple de texto (leches, tipos de café,
// tipos de infusión, sabores de un grupo): muestra los valores como tags
// con una "x" para quitarlos, y un input + botón para agregar uno nuevo.
function TagListEditor({ items, onAdd, onRemove, placeholder }) {

    const [value, setValue] = useState("");

    const handleAdd = () => {
        if (!value.trim()) return;
        onAdd(value);
        setValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="catalog__tag-editor">

            <div className="catalog__tags">

                {items.length === 0 && (
                    <span className="catalog__tags-empty">
                        Todavía no hay ninguno.
                    </span>
                )}

                {items.map(item => (
                    <span key={item} className="catalog__tag">
                        {item}
                        <button
                            type="button"
                            onClick={() => onRemove(item)}
                            aria-label={`Quitar ${item}`}
                        >
                            <FaTimes />
                        </button>
                    </span>
                ))}

            </div>

            <div className="catalog__tag-add">

                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />

                <button type="button" onClick={handleAdd}>
                    <FaPlus />
                    Agregar
                </button>

            </div>

        </div>
    );

}

const FLAVOR_GROUP_LABELS = {
    coffee: "Café",
    infusiones: "Infusiones",
};

export default function Catalog() {

    const {
        catalog,
        addListItem,
        removeListItem,
        addExtra,
        removeExtra,
        addFlavor,
        removeFlavor,
        addFlavorGroup,
    } = useCatalog();

    const [showToast, setShowToast] = useState(false);

    const [newExtraName, setNewExtraName] = useState("");
    const [newExtraPrice, setNewExtraPrice] = useState("");

    const [newFlavorGroupName, setNewFlavorGroupName] = useState("");

    const notify = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1200);
    };

    const handleAddMilk = (value) => {
        addListItem("milks", value);
        notify();
    };

    const handleAddCoffee = (value) => {
        addListItem("coffeeOptions", value);
        notify();
    };

    const handleAddInfusion = (value) => {
        addListItem("infusionOptions", value);
        notify();
    };

    const handleAddExtra = () => {

        if (!newExtraName.trim()) return;

        addExtra({
            name: newExtraName,
            price: newExtraPrice,
        });

        setNewExtraName("");
        setNewExtraPrice("");

        notify();

    };

    const handleAddFlavorGroup = () => {

        if (!newFlavorGroupName.trim()) return;

        addFlavorGroup(newFlavorGroupName);

        setNewFlavorGroupName("");

        notify();

    };

    return (
        <section className="catalog">

            <div className="catalog__header">
                <h1>Catálogo</h1>
                <p className="catalog__subtitle">
                    Estas son las opciones que ve el formulario al crear un
                    producto nuevo. Agrega o quita valores aquí — no hace
                    falta tocar código.
                </p>
            </div>

            <div className="catalog__grid">

                {/* Leches */}
                <div className="catalog__block">
                    <h3>Leches</h3>
                    <TagListEditor
                        items={catalog.milks}
                        onAdd={handleAddMilk}
                        onRemove={(v) => { removeListItem("milks", v); notify(); }}
                        placeholder="Ej. Leche de coco"
                    />
                </div>

                {/* Tipo de café */}
                <div className="catalog__block">
                    <h3>Tipo de café</h3>
                    <TagListEditor
                        items={catalog.coffeeOptions}
                        onAdd={handleAddCoffee}
                        onRemove={(v) => { removeListItem("coffeeOptions", v); notify(); }}
                        placeholder="Ej. Orgánico"
                    />
                </div>

                {/* Tipos de infusión */}
                <div className="catalog__block">
                    <h3>Tipos de infusión</h3>
                    <TagListEditor
                        items={catalog.infusionOptions}
                        onAdd={handleAddInfusion}
                        onRemove={(v) => { removeListItem("infusionOptions", v); notify(); }}
                        placeholder="Ej. Té Verde"
                    />
                </div>

                {/* Extras */}
                <div className="catalog__block">
                    <h3>Extras</h3>

                    <div className="catalog__extras-list">

                        {catalog.extras.length === 0 && (
                            <span className="catalog__tags-empty">
                                Todavía no hay ningún extra.
                            </span>
                        )}

                        {catalog.extras.map(extra => (
                            <div key={extra.id} className="catalog__extra-row">
                                <span className="catalog__extra-name">
                                    {extra.name}
                                </span>
                                <span className="catalog__extra-price">
                                    {extra.price > 0 ? `+$${extra.price}` : "Gratis"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => { removeExtra(extra.id); notify(); }}
                                    aria-label={`Quitar ${extra.name}`}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}

                    </div>

                    <div className="catalog__extra-add">
                        <input
                            type="text"
                            value={newExtraName}
                            onChange={(e) => setNewExtraName(e.target.value)}
                            placeholder="Nombre del extra"
                        />
                        <input
                            type="number"
                            value={newExtraPrice}
                            onChange={(e) => setNewExtraPrice(e.target.value)}
                            placeholder="$0"
                            min="0"
                        />
                        <button type="button" onClick={handleAddExtra}>
                            <FaPlus />
                            Agregar
                        </button>
                    </div>

                </div>

                {/* Sabores, por grupo */}
                <div className="catalog__block catalog__block--wide">
                    <h3>Sabores</h3>

                    {Object.entries(catalog.flavorGroups).map(([group, items]) => (
                        <div key={group} className="catalog__flavor-group">
                            <h4>
                                {FLAVOR_GROUP_LABELS[group] || group}
                            </h4>
                            <TagListEditor
                                items={items}
                                onAdd={(v) => { addFlavor(group, v); notify(); }}
                                onRemove={(v) => { removeFlavor(group, v); notify(); }}
                                placeholder="Ej. Coco"
                            />
                        </div>
                    ))}

                    <div className="catalog__new-group">
                        <input
                            type="text"
                            value={newFlavorGroupName}
                            onChange={(e) => setNewFlavorGroupName(e.target.value)}
                            placeholder="Nombre de un grupo nuevo (ej. fruta)"
                        />
                        <button type="button" onClick={handleAddFlavorGroup}>
                            <FaPlus />
                            Crear grupo
                        </button>
                    </div>

                    <p className="catalog__hint">
                        Un grupo de sabores nuevo lo puedes usar luego en
                        productTypeConfig (en productOptions.js) para un
                        tipo de producto futuro, ej. Smoothies.
                    </p>

                </div>

            </div>

            <Toast
                message="Catálogo actualizado ✅"
                type="success"
                isVisible={showToast}
            />

        </section>
    );

}