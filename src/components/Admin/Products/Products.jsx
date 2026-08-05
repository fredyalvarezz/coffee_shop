import "./Products.css";

import { useState } from "react";

import ProductCard from "./ProductCard";
import { useAdmin } from "../../../context/AdminContext";
import Modal from "../../../components/Modal/Modal";
import Toast from "../../../components/Toast/Toast";
import {
  FaSearch,
  FaPlus
} from "react-icons/fa";



export default function Products({ onNewProduct, onEditProduct }) {

  const { products, deleteProduct } = useAdmin();

  const menuCategories = [
    "Todas",
    ...new Set(products.map(product => product.menuCategory))
  ];

  const [menuCategory, setMenuCategory] = useState("Todas");

  const [search, setSearch] = useState("");

  // Producto que se está por eliminar (null = no hay modal abierto).
  // Se guarda el producto completo (no solo el id) para poder mostrar
  // su nombre en el mensaje de confirmación.
  const [productToDelete, setProductToDelete] = useState(null);

  const [showToast, setShowToast] = useState(false);

  const filteredProducts = products.filter((product) => {

    const text = search.toLowerCase();

    const matchesSearch =
      product.title.toLowerCase().includes(text) ||
      product.productType.toLowerCase().includes(text);

    const matchesMenu =
      menuCategory === "Todas" ||
      product.menuCategory === menuCategory;

    return matchesSearch && matchesMenu;

  });

  const confirmDelete = () => {

    deleteProduct(productToDelete.id);

    setProductToDelete(null);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 1500);

  };

  return (
    <section className="products">

      <div className="products__header">

        <h1>Productos</h1>

        <div className="products__controls">
          <div className="products__search-container">
            <FaSearch className="products__search-icon" />

            <input
              type="text"
              className="products__search"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="products__select"
            value={menuCategory}
            onChange={(e) => setMenuCategory(e.target.value)}
          >
            {menuCategories.map((menu) => (
              <option
                key={menu}
                value={menu}
              >
                {menu}
              </option>
            ))}
          </select>



          <button className="products__button"
            onClick={onNewProduct}>
            <FaPlus />
            Nuevo Producto

          </button>



        </div>

      </div>
      <p className="products__count">

        {filteredProducts.length} productos encontrados

      </p>

      <div className="products__grid">

        {filteredProducts.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => onEditProduct(product)}
            onDelete={() => setProductToDelete(product)}
          />

        ))}

      </div>

      {/* Modal Confirmación de eliminar */}
      {productToDelete && (
        <Modal
          title="Eliminar producto"
          onClose={() => setProductToDelete(null)}
        >

          <div className="products__confirm">

            <p>
              ¿Seguro que deseas eliminar "{productToDelete.title}"?
              Esta acción no se puede deshacer.
            </p>

            <div className="products__confirm-buttons">

              <button
                className="products__confirm-cancel"
                onClick={() => setProductToDelete(null)}
              >
                Cancelar
              </button>

              <button
                className="products__confirm-delete"
                onClick={confirmDelete}
              >
                Sí, eliminar
              </button>

            </div>

          </div>

        </Modal>
      )}

      {/* Toast */}
      <Toast
        message="Producto eliminado 🗑️"
        type="warning"
        isVisible={showToast}
      />

    </section>
  );
}
