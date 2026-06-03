import { 
    createContext, 
    useContext, 
    useState,
    useEffect
} from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    
    const [cart, setCart] = useState(() => {
        const saveCart = 
        localStorage.getItem("cart");

        return saveCart ? JSON.parse(saveCart) : [];
    });

    useEffect(() => {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );
    }, [cart]);

    // Agregar productos
    const addToCart = (product) => {
        setCart((prev) => {
            const index = prev.findIndex(
                (item) =>
                    item.id === product.id &&
                    item.size === product.size &&
                    item.milk === product.milk &&
                    item.flavor === product.flavor
            );

            if (index !== -1) {
                return prev.map((item, i) =>
                    i === index
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }

            return [...prev, { ...product, qty: 1 }];
        });
    };

    // Eliminar producto
    const removeFromCart = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    // Sumar
    const increaseQty = (index) => {
        setCart((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, qty: item.qty + 1 }
                    : item
            )
        );
    };

    // Restar
    const decreaseQty = (index) => {
        setCart((prev) =>
            prev
                .map((item, i) =>
                    i === index
                        ? { ...item, qty: item.qty - 1 }
                        : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    // Vaciar carrito
    const clearCart = () => {
        setCart([]);
    }

    /// Total
    const total = cart.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQty,
                decreaseQty,
                clearCart,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );

}