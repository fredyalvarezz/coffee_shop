import {
  createContext,
  useContext,
  useState,
} from "react";

import { useProducts } from "./ProductsContext";

import usersData from "../data/users";
import ordersData from "../data/orders";
import inventoryData from "../data/inventory";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }) {

  // products ya NO vive aquí — se lee directo de ProductsContext, que es
  // la misma fuente que usan ProductForm, Menu y ProductDetail. Así, un
  // producto que se agrega desde el formulario aparece también aquí sin
  // necesidad de sincronizar dos copias por separado.
  //
  // IMPORTANTE: por esto, <AdminProvider> debe quedar DENTRO de
  // <ProductsProvider> en el árbol de componentes (ej. en App.jsx, o
  // envolviendo <AdminLayout /> ya que eso vive dentro de ProductsProvider).
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [users, setUsers] = useState(usersData);

  const [orders, setOrders] = useState(ordersData);

  const [inventory, setInventory] = useState(inventoryData);

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        users,
        setUsers,

        orders,
        setOrders,

        inventory,
        setInventory,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
