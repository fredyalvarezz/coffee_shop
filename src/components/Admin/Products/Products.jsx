import "./Products.css";

import { useState } from "react";

import ProductCard from "./ProductCard";
import { useAdmin } from "../../../context/AdminContext";
import {
  FaSearch,
  FaPlus
} from "react-icons/fa";



export default function Products({ setPage }) {

  const { products } = useAdmin();

  const menuCategories = [
    "Todas",
    ...new Set(products.map(product => product.menuCategory))
  ];

  const [menuCategory, setMenuCategory] = useState("Todas");

  const [search, setSearch] = useState("");

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




const categoryLabels = {
  calientes: "Calientes",
  frias: "Frías",
  frappes: "Frappés",
  temporada: "Temporada",
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
          onClick={() => setPage("new-product")}>
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
        />

      ))}

    </div>

  </section>
);
}