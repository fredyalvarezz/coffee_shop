import "./Catalog.css";

import { useState } from "react";

import { useCatalog } from "../../../context/CatalogContext";
import { useInventory } from "../../../context/InventoryContext";
import Toast from "../../../components/Toast/Toast";
import { FaTimes, FaPlus } from "react-icons/fa";

// Editor de una lista de valores del catálogo (leches, tipo de café,
// infusiones, sabores). Cada valor se muestra en su propio renglón con
// un selector para vincularlo (opcional) a un insumo del Inventario —
// eso es lo que permite que la Receta de un producto diga "usa la leche
// que elija el cliente" y sepa a qué insumo se refiere.
function LinkableListEditor({
    items,
    onAdd,
    onRemove,
    placeholder,
    links,
    inventoryOptions,
    onLinkChange,
}) {

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

            <div className="catalog__linkable-list">

                {items.length === 0 && (
                    <span className="catalog__tags-empty">
                        Todavía no hay ninguno.
                    </span>
                )}

                {items.map(item => (
                    <div key={item} className="catalog__linkable-row">

                        <span className="catalog__linkable-name">
                            {item}
                        </span>

                        <select
                            value={links?.[item] || ""}
                            onChange={(e) => onLinkChange(item, e.target.value)}
                        >
                            <option value="">Sin vincular a insumo</option>
                            {inventoryOptions.map(inv => (
                                <option key={inv.id} value={inv.id}>
                                    {inv.name}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => onRemove(item)}
                            aria-label={`Quitar ${item}`}
                        >
                            <FaTimes />
                        </button>

                    </div>
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
        updateExtra,
        removeExtra,
        addFlavor,
        removeFlavor,
        addFlavorGroup,
        setInventoryLink,
    } = useCatalog();

    const { inventory } = useInventory();

    const [showToast, setShowToast] = useState(false);

    const [newExtraName, setNewExtraName] = useState("");
    const [newExtraPrice, setNewExtraPrice] = useState("");
    const [newExtraInventoryId, setNewExtraInventoryId] = useState("");
    const [newExtraAmount, setNewExtraAmount] = useState("");

    const [newFlavorGroupName, setNewFlavorGroupName] = useState("");

    // Mientras se edita la cantidad de un extra existente, el valor
    // "en proceso" vive aquí (por id de extra) — solo se confirma al
    // catálogo (updateExtra) hasta que el campo pierde el foco (onBlur).
    // Así evitamos guardar/mostrar el Toast en cada tecla, que era lo
    // que le quitaba el foco al campo y no dejaba seguir escribiendo.
    const [editingAmounts, setEditingAmounts] = useState({});

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
            inventoryItemId: newExtraInventoryId,
            amount: newExtraAmount,
        });

        setNewExtraName("");
        setNewExtraPrice("");
        setNewExtraInventoryId("");
        setNewExtraAmount("");

        notify();

    };

    const handleAddFlavorGroup = () => {

        if (!newFlavorGroupName.trim()) return;

        addFlavorGroup(newFlavorGroupName);

        setNewFlavorGroupName("");

        notify();

    };

    const handleLinkChange = (category, value, inventoryItemId) => {
        setInventoryLink(category, value, inventoryItemId);
        notify();
    };

    return (
        <section className="catalog">

            <div className="catalog__header">
                <h1>Catálogo</h1>
                <p className="catalog__subtitle">
                    Estas son las opciones que ve el formulario al crear un
                    producto nuevo. Agrega o quita valores aquí — no hace
                    falta tocar código. El selector junto a cada uno lo
                    vincula a un insumo del Inventario, para que las
                    recetas "según elección del cliente" sepan qué descontar.
                </p>
            </div>

            <div className="catalog__grid">

                {/* Leches */}
                <div className="catalog__block">
                    <h3>Leches</h3>
                    <LinkableListEditor
                        items={catalog.milks}
                        onAdd={handleAddMilk}
                        onRemove={(v) => { removeListItem("milks", v); notify(); }}
                        placeholder="Ej. Leche de coco"
                        links={catalog.inventoryLinks.milks}
                        inventoryOptions={inventory}
                        onLinkChange={(value, id) => handleLinkChange("milks", value, id)}
                    />
                </div>

                {/* Tipo de café */}
                <div className="catalog__block">
                    <h3>Tipo de café</h3>
                    <LinkableListEditor
                        items={catalog.coffeeOptions}
                        onAdd={handleAddCoffee}
                        onRemove={(v) => { removeListItem("coffeeOptions", v); notify(); }}
                        placeholder="Ej. Orgánico"
                        links={catalog.inventoryLinks.coffeeOptions}
                        inventoryOptions={inventory}
                        onLinkChange={(value, id) => handleLinkChange("coffeeOptions", value, id)}
                    />
                </div>

                {/* Tipos de infusión */}
                <div className="catalog__block">
                    <h3>Tipos de infusión</h3>
                    <LinkableListEditor
                        items={catalog.infusionOptions}
                        onAdd={handleAddInfusion}
                        onRemove={(v) => { removeListItem("infusionOptions", v); notify(); }}
                        placeholder="Ej. Té Verde"
                        links={catalog.inventoryLinks.infusionOptions}
                        inventoryOptions={inventory}
                        onLinkChange={(value, id) => handleLinkChange("infusionOptions", value, id)}
                    />
                </div>

                {/* Extras */}
                <div className="catalog__block">
                    <h3>Extras</h3>

                    <p className="catalog__block-hint">
                        Si le das insumo y cantidad a un extra, se
                        descuenta del inventario cada vez que un cliente
                        lo elige — sin importar en qué producto.
                    </p>

                    <div className="catalog__extras-list">

                        {catalog.extras.length === 0 && (
                            <span className="catalog__tags-empty">
                                Todavía no hay ningún extra.
                            </span>
                        )}

                        {catalog.extras.map(extra => (
                            <div key={extra.id} className="catalog__extra-row">

                                <div className="catalog__extra-main">
                                    <span className="catalog__extra-name">
                                        {extra.name}
                                    </span>
                                    <span className="catalog__extra-price">
                                        {extra.price > 0 ? `+$${extra.price}` : "Gratis"}
                                    </span>
                                </div>

                                <select
                                    value={extra.inventoryItemId || ""}
                                    onChange={(e) => {
                                        updateExtra(extra.id, {
                                            inventoryItemId: e.target.value ? Number(e.target.value) : null,
                                        });
                                        notify();
                                    }}
                                >
                                    <option value="">Sin vincular a insumo</option>
                                    {inventory.map(inv => (
                                        <option key={inv.id} value={inv.id}>
                                            {inv.name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="catalog__extra-amount"
                                    value={
                                        editingAmounts[extra.id] !== undefined
                                            ? editingAmounts[extra.id]
                                            : (extra.amount ?? "")
                                    }
                                    onFocus={() => {
                                        // Guardamos el valor original cuando comienza la edición
                                        setEditingAmounts(prev => ({
                                            ...prev,
                                            [extra.id]: String(extra.amount ?? ""),
                                        }));
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setEditingAmounts(prev => ({
                                            ...prev,
                                            [extra.id]: value,
                                        }));
                                    }}
                                    onBlur={() => {
                                        const originalValue = String(extra.amount ?? "");
                                        const newValue = editingAmounts[extra.id];

                                        // Por seguridad, si no había edición, no hacemos nada
                                        if (newValue === undefined) {
                                            return;
                                        }

                                        // Si no cambió, simplemente terminamos la edición
                                        if (newValue === originalValue) {
                                            setEditingAmounts(prev => {
                                                const next = { ...prev };
                                                delete next[extra.id];
                                                return next;
                                            });

                                            return;
                                        }

                                        // Si lo dejó vacío, guardamos 0
                                        const amount = newValue.trim() === ""
                                            ? 0
                                            : Number(newValue);

                                        // Nunca guardamos NaN
                                        if (!Number.isFinite(amount)) {
                                            setEditingAmounts(prev => {
                                                const next = { ...prev };
                                                delete next[extra.id];
                                                return next;
                                            });

                                            return;
                                        }

                                        // Aquí sí hubo un cambio real
                                        updateExtra(extra.id, {
                                            amount,
                                        });

                                        setEditingAmounts(prev => {
                                            const next = { ...prev };
                                            delete next[extra.id];
                                            return next;
                                        });

                                        notify();
                                    }}
                                    placeholder="Cant."
                                />

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
                        <select
                            value={newExtraInventoryId}
                            onChange={(e) => setNewExtraInventoryId(e.target.value)}
                        >
                            <option value="">Sin vincular a insumo</option>
                            {inventory.map(inv => (
                                <option key={inv.id} value={inv.id}>
                                    {inv.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="catalog__extra-amount"
                            value={newExtraAmount}
                            onChange={(e) => setNewExtraAmount(e.target.value)}
                            placeholder="Cant."
                        />

                        <button type="button" onClick={handleAddExtra}>
                            <FaPlus />
                            Agregar
                        </button>
                    </div>

                </div>

                {/* Sabores, por grupo — comparten la categoría "flavors" de
                    vínculos, así que si el mismo nombre aparece en dos
                    grupos, comparte el mismo insumo vinculado */}
                <div className="catalog__block catalog__block--wide">
                    <h3>Sabores</h3>

                    {Object.entries(catalog.flavorGroups).map(([group, items]) => (
                        <div key={group} className="catalog__flavor-group">
                            <h4>
                                {FLAVOR_GROUP_LABELS[group] || group}
                            </h4>
                            <LinkableListEditor
                                items={items}
                                onAdd={(v) => { addFlavor(group, v); notify(); }}
                                onRemove={(v) => { removeFlavor(group, v); notify(); }}
                                placeholder="Ej. Coco"
                                links={catalog.inventoryLinks.flavors}
                                inventoryOptions={inventory}
                                onLinkChange={(value, id) => handleLinkChange("flavors", value, id)}
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