import {
  createContext,
  useContext,
  useState,
} from "react";

import { useProducts } from "./ProductsContext";
import { useInventory } from "./InventoryContext";

import usersData from "../data/users";
import ordersData from "../data/orders";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }) {

  // products viene de ProductsContext, inventory viene de InventoryContext.
  // Ninguno de los dos vive aquí directamente — así evitamos tener dos
  // copias distintas de la misma información en la app.
  //
  // IMPORTANTE: por esto, <AdminProvider> debe quedar DENTRO de
  // <ProductsProvider> Y de <InventoryProvider> en el árbol.
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const {
    inventory,
    addItem: addInventoryItem,
    updateItem: updateInventoryItem,
    deleteItem: deleteInventoryItem,
    adjustStock,
  } = useInventory();

  const [users, setUsers] = useState(usersData);

  const [orders, setOrders] = useState(ordersData);

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        adjustStock,

        users,
        setUsers,

        orders,
        setOrders,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}