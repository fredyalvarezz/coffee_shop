// Menu.jsx
import "./Menu.css";
import { useSearchParams } from "react-router-dom";
import products from "../../data/products";
import Card from "../../components/Card/Card";

const CATEGORY_MAP = {
  calientes: "Calientes",
  frias: "Frías",
  frappes: "Frappés",
  temporada: "Temporada",
  postres: "Postres",
};

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCat = searchParams.get("cat") || "calientes";

  const setCategory = (cat) => {
    setSearchParams({ cat });
  };

  const filteredProducts = products.filter(
    (product) => product.menuCategory === CATEGORY_MAP[activeCat]
  );

  return (
    <div className="menu">
      <h2>Nuestro Menú</h2>

      <div className="menu__tabs">
        {Object.keys(CATEGORY_MAP).map((cat) => (
          <button
            key={cat}
            className={activeCat === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {CATEGORY_MAP[cat]}
          </button>
        ))}
      </div>

      <div className="menu__grid">
        {filteredProducts.length === 0 ? (
          <p className="menu__empty">No hay productos en esta categoría.</p>
        ) : (
          filteredProducts.map((product) => (
            <Card
              key={product.id}
              id={product.id}
              title={product.title}
              basePrice={product.basePrice}
              image={product.image}
              stock={product.stock}
            />
          ))
        )}
      </div>
    </div>
  );
}