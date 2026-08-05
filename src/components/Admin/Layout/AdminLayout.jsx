import "./AdminLayout.css";

import { useState } from "react";

import SidebarAdmin from "./SidebarAdmin";
import AdminHeader from "./AdminHeader";

import Dashboard from "../Dashboard/Dashboard";
import Products from "../Products/Products";
import Inventory from "../Inventory/Inventory";
import Orders from "../Orders/Orders";
import Users from "../Users/Users";
import Reports from "../Reports/Reports";
import Settings from "../Settings/Settings";
import NewProduct from "../NewProduct/NewProduct";

export default function AdminLayout() {

    const [page, setPage] = useState("dashboard");

    // Cuál producto se está editando (null = se va a crear uno nuevo).
    // Vive aquí porque tanto Products (que dispara el "Editar") como
    // NewProduct (que renderiza el formulario) lo necesitan.
    const [editingProduct, setEditingProduct] = useState(null);

    const goToNewProduct = () => {
        setEditingProduct(null);
        setPage("new-product");
    };

    const goToEditProduct = (product) => {
        setEditingProduct(product);
        setPage("new-product");
    };

    const backToProducts = () => {
        setEditingProduct(null);
        setPage("products");
    };

    return (

        <section className="admin-layout">

            <SidebarAdmin
                page={page}
                setPage={setPage}
            />

            <div className="admin-layout__content">

                <AdminHeader />

                <main className="admin-layout__page">

                    {page === "dashboard" && <Dashboard />}

                    {page === "products" && (
                        <Products
                            onNewProduct={goToNewProduct}
                            onEditProduct={goToEditProduct}
                        />
                    )}

                    {page === "new-product" && (
                        <NewProduct
                            product={editingProduct}
                            onDone={backToProducts}
                        />
                    )}

                    {page === "inventory" && <Inventory />}

                    {page === "orders" && <Orders />}

                    {page === "users" && <Users />}

                    {page === "reports" && <Reports />}

                    {page === "settings" && <Settings />}

                </main>

            </div>

        </section>

    );

}
