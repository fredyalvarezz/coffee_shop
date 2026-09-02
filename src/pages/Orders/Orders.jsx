import { useState } from "react";
import { useCart } from "../../context/CartContext";

import "./Orders.css";

import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import { useCatalog } from "../../context/CatalogContext";
import { useProducts } from "../../context/ProductsContext";
import { useInventory } from "../../context/InventoryContext";
import { useOrders } from "../../context/OrdersContext";
import { useAuth } from "../../context/AuthContext";
import { FALLBACK_IMAGE, handleImageError } from "../../utils/fallbackImage";

export default function Orders() {

    const {
        cart,
        total,
        increaseQty,
        decreaseQty,
        clearCart,
    } = useCart();

    const { catalog } = useCatalog();

    const { products } = useProducts();

    // IMPORTANTE:
    // Ahora necesitamos inventory además de adjustStock,
    // porque primero vamos a comprobar si hay suficiente stock.
    const {
        inventory,
        adjustStock,
    } = useInventory();

    const { addOrder } = useOrders();

    const { user } = useAuth();

    const extraLabels = Object.fromEntries(
        catalog.extras.map(extra => [extra.id, extra.name])
    );

    const getExtras = (extras) => {

        return Object.entries(extras || {})
            .filter(([key, value]) => value)
            .map(([key]) => extraLabels[key])
            .filter(Boolean)
            .join(", ");

    };

    const [showConfirm, setShowConfirm] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showPaidToast, setShowPaidToast] = useState(false);
    const [showStockToast, setShowStockToast] = useState(false);
    const [stockError, setStockError] = useState("");

    /*
     * Para una receta variable, averigua qué valor eligió el cliente
     * y busca el insumo correspondiente en Catalog.
     */
    const resolveVariableInventoryId = (group, item) => {

        const chosenValue =
            group === "milks"
                ? item.milk
                : group === "coffeeOptions"
                    ? item.coffee
                    : group === "infusionOptions"
                        ? item.infusion
                        : group === "flavors"
                            ? item.flavor
                            : null;

        if (!chosenValue) return null;

        return catalog.inventoryLinks?.[group]?.[chosenValue] || null;

    };

    /*
     * Calcula TODOS los insumos que necesita el pedido.
     *
     * El resultado tiene esta forma:
     *
     * [
     *   { inventoryItemId: 1, amount: 0.5 },
     *   { inventoryItemId: 2, amount: 1.2 }
     * ]
     *
     * Si dos productos utilizan el mismo insumo, aquí se acumula
     * la cantidad para hacer una sola validación.
     */
    const calculateRequiredInventory = () => {

        const required = {};

        const addRequiredAmount = (inventoryItemId, amount) => {

            if (!inventoryItemId || amount <= 0) return;

            const id = Number(inventoryItemId);

            required[id] = (required[id] || 0) + amount;

        };

        cart.forEach((item) => {

            const product = products.find(
                product => product.id === item.id
            );

            if (!product) return;

            /*
             * RECETA DEL PRODUCTO
             */
            if (product.recipe?.length) {

                product.recipe.forEach((line) => {

                    const inventoryItemId =
                        line.type === "variable"
                            ? resolveVariableInventoryId(line.group, item)
                            : line.inventoryItemId;

                    if (!inventoryItemId) return;

                    const amountPerUnit = Number(line.amount) || 0;

                    const totalAmount =
                        amountPerUnit * item.qty;

                    addRequiredAmount(
                        inventoryItemId,
                        totalAmount
                    );

                });

            }

            /*
             * EXTRAS
             */
            if (item.extras) {

                Object.entries(item.extras).forEach(
                    ([extraId, selected]) => {

                        if (!selected) return;

                        const extraDef =
                            catalog.extras.find(
                                extra => extra.id === extraId
                            );

                        if (
                            !extraDef?.inventoryItemId ||
                            !extraDef?.amount
                        ) {
                            return;
                        }

                        const totalAmount =
                            Number(extraDef.amount) * item.qty;

                        addRequiredAmount(
                            extraDef.inventoryItemId,
                            totalAmount
                        );

                    }
                );

            }

        });

        return Object.entries(required).map(
            ([inventoryItemId, amount]) => ({
                inventoryItemId: Number(inventoryItemId),
                amount,
            })
        );

    };

    /*
     * Comprueba si TODO el pedido puede salir del inventario.
     *
     * IMPORTANTE:
     * Aquí todavía NO modificamos el inventario.
     *
     * Si falta un solo ingrediente, regresamos false.
     */
    const validateInventory = (requiredInventory) => {

        const unavailableItems = [];

        requiredInventory.forEach((required) => {

            const inventoryItem = inventory.find(
                item => item.id === required.inventoryItemId
            );

            /*
             * Si la receta apunta a un insumo que ya no existe
             * en Inventario, tampoco permitimos vender.
             */
            if (!inventoryItem) {

                unavailableItems.push({
                    name: "Insumo no encontrado",
                    required: required.amount,
                    available: 0,
                    unit: "",
                });

                return;

            }

            if (inventoryItem.stock < required.amount) {

                unavailableItems.push({
                    name: inventoryItem.name,
                    required: required.amount,
                    available: inventoryItem.stock,
                    unit: inventoryItem.unit,
                });

            }

        });

        return unavailableItems;

    };

    /*
     * PAGO
     *
     * Primero calcula.
     * Después valida.
     * SOLAMENTE si todo está disponible descuenta el inventario.
     * Y por último, registra el pedido real para el admin.
     */
    const handlePay = () => {

        /*
         * 1. Calcular todo lo que necesita el pedido.
         */
        const requiredInventory =
            calculateRequiredInventory();

        /*
         * 2. Comprobar que exista suficiente stock.
         */
        const unavailableItems =
            validateInventory(requiredInventory);

        /*
         * 3. Si falta algo, NO hacemos ningún descuento ni registramos
         * el pedido.
         */
        if (unavailableItems.length > 0) {

            const message = unavailableItems
                .map(item => {

                    const required =
                        Number(item.required).toFixed(3);

                    const available =
                        Number(item.available).toFixed(3);

                    return `${item.name}: necesitas ${required} ${item.unit}, pero solo hay ${available} ${item.unit}.`;

                })
                .join(" ");

            setStockError(message);
            setShowStockToast(true);

            setTimeout(() => {
                setShowStockToast(false);
            }, 5000);

            return;

        }

        /*
         * 4. TODO está disponible.
         *
         * Ahora sí hacemos los descuentos.
         */
        requiredInventory.forEach((required) => {

            adjustStock(
                required.inventoryItemId,
                -required.amount
            );

        });

        /*
         * 5. Registrar el pedido real, para que el admin lo vea en
         * su historial. Guarda una copia de cada item con todas sus
         * personalizaciones (no solo el id), porque el producto
         * original se podría editar o borrar después.
         */
        addOrder({
            userId: user?.id || null,
            customer: user?.name || "Invitado",
            total,
            status: "pending",
            paymentStatus: "paid",
            createdAt: new Date().toISOString(),
            items: cart.map((item) => ({
                productId: item.id,
                title: item.title,
                image: item.image,
                quantity: item.qty,
                price: item.price,
                size: item.size || null,
                coffee: item.coffee || null,
                infusion: item.infusion || null,
                milk: item.milk || null,
                flavor: item.flavor || null,
                preparation: item.preparation || null,
                extras: item.extras || {},
                note: item.note || "",
            })),
        });

        /*
         * 6. El pedido se completó correctamente.
         */
        clearCart();

        setShowPaidToast(true);

        setTimeout(() => {
            setShowPaidToast(false);
        }, 1500);

    };

    return (
        <>

            <div className="orders">

                {/* LEFT */}
                <div className="orders__items">

                    <h1>Mi Pedido</h1>

                    {cart.length === 0 && (
                        <div className="orders__empty">

                            <div className="orders__empty-icon">
                                ☕
                            </div>

                            <h2>
                                Aún no agregas bebidas
                            </h2>

                            <p>
                                Explora nuestro menú y encuentra
                                tu café favorito
                            </p>

                        </div>
                    )}

                    {cart.map((item, index) => (

                        <div
                            key={index}
                            className="orders__card"
                        >

                            <img
                                src={
                                    item.image ||
                                    FALLBACK_IMAGE
                                }
                                alt={item.title}
                                className="orders__image"
                                onError={handleImageError}
                            />

                            <div className="orders__info">

                                <h3>{item.title}</h3>

                                <p>

                                    {item.size && (
                                        <>
                                            Tamaño: {item.size}
                                            <br />
                                        </>
                                    )}

                                    {item.coffee && (
                                        <>
                                            Café: {item.coffee}
                                            <br />
                                        </>
                                    )}

                                    {item.infusion && (
                                        <>
                                            Infusión: {item.infusion}
                                            <br />
                                        </>
                                    )}

                                    {item.milk && (
                                        <>
                                            Leche: {item.milk}
                                            <br />
                                        </>
                                    )}

                                    {item.flavor && (
                                        <>
                                            Sabor: {item.flavor}
                                        </>
                                    )}

                                </p>

                                {item.preparation && (
                                    <small>
                                        Preparación:{" "}
                                        {item.preparation}
                                    </small>
                                )}

                                {getExtras(item.extras) && (
                                    <small>
                                        Extras:{" "}
                                        {getExtras(item.extras)}
                                    </small>
                                )}

                                {item.note && (
                                    <small>
                                        Nota: {item.note}
                                    </small>
                                )}

                                <h4>
                                    ${item.price * item.qty}
                                </h4>

                            </div>

                            <div className="orders__qty">

                                <button
                                    onClick={() =>
                                        decreaseQty(index)
                                    }
                                >
                                    -
                                </button>

                                <span>{item.qty}</span>

                                <button
                                    onClick={() =>
                                        increaseQty(index)
                                    }
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                {/* RIGHT */}
                <div className="orders__summary">

                    <h2>Resumen</h2>

                    {cart.length > 0 && (
                        <button
                            className="orders__clear"
                            onClick={() =>
                                setShowConfirm(true)
                            }
                        >
                            Eliminar pedido
                        </button>
                    )}

                    <div className="orders__row">

                        <span>Subtotal</span>

                        <span>
                            ${total}
                        </span>

                    </div>

                    <div className="orders__row">

                        <span>Envío</span>

                        <span>$0</span>

                    </div>

                    <div className="orders__row orders__total">

                        <span>Total</span>

                        <span>
                            ${total}
                        </span>

                    </div>

                    <button
                        className="orders__pay"
                        disabled={cart.length === 0}
                        onClick={handlePay}
                    >
                        Pagar
                    </button>

                </div>

            </div>

            {/* Modal Confirmación */}
            {showConfirm && (
                <Modal
                    title="Eliminar pedido"
                    onClose={() =>
                        setShowConfirm(false)
                    }
                >

                    <div className="orders__confirm">

                        <p>
                            ¿Seguro que deseas eliminar todos
                            los productos?
                        </p>

                        <div className="orders__confirm-buttons">

                            <button
                                className="orders__confirm-cancel"
                                onClick={() =>
                                    setShowConfirm(false)
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                className="orders__confirm-delete"
                                onClick={() => {

                                    clearCart();

                                    setShowConfirm(false);

                                    setShowToast(true);

                                    setTimeout(() => {
                                        setShowToast(false);
                                    }, 1500);

                                }}
                            >
                                Sí, eliminar
                            </button>

                        </div>

                    </div>

                </Modal>
            )}

            {/* Toast: pedido eliminado */}
            <Toast
                message="Pedido eliminado ☕"
                type="warning"
                isVisible={showToast}
            />

            {/* Toast: pago correcto */}
            <Toast
                message="¡Pedido pagado! ☕✅"
                type="success"
                isVisible={showPaidToast}
            />

            {/* Toast: inventario insuficiente */}
            <Toast
                message={
                    stockError ||
                    "No hay suficiente inventario."
                }
                type="warning"
                isVisible={showStockToast}
            />

        </>
    );
}