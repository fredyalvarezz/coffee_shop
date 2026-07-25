import {
  createContext,
  useContext,
  useState,
} from "react";

import productsData from "../data/products";
import usersData from "../data/users";
import ordersData from "../data/orders";
import inventoryData from "../data/inventory";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }) {

  const [products, setProducts] = useState(productsData);

  const [users, setUsers] = useState(usersData);

  const [orders, setOrders] = useState(ordersData);

  const [inventory, setInventory] = useState(inventoryData);

  return (
    <AdminContext.Provider
      value={{
        products,
        setProducts,

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