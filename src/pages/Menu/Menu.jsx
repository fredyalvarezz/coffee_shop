import "./Menu.css";
import { useSearchParams } from "react-router-dom";

import products from "../../data/products";

import Card from "../../components/Card/Card";

export default function Menu() {

  const [searchParams, setSearchParams] = useSearchParams();

  const activeCat =
    searchParams.get("cat") || "calientes";

  const setCategory = (cat) => {
    setSearchParams({ cat });
  };

  const filteredProducts = products.filter(
    (product) => product.category === activeCat
  );

  return (

    <div className="menu">

      <h2>Nuestro Menú</h2>

      {/* Tabs */}
      <div className="menu__tabs">

        <button
          className={activeCat === "calientes" ? "active" : ""}
          onClick={() => setCategory("calientes")}
        >
          Calientes
        </button>

        <button
          className={activeCat === "frias" ? "active" : ""}
          onClick={() => setCategory("frias")}
        >
          Frías
        </button>

        <button
          className={activeCat === "frappes" ? "active" : ""}
          onClick={() => setCategory("frappes")}
        >
          Frappes
        </button>

        <button
          className={activeCat === "temporada" ? "active" : ""}
          onClick={() => setCategory("temporada")}
        >
          Temporada
        </button>

      </div>

      {/* Cards */}
      <div className="menu__grid">

        {filteredProducts.map((product) => (

          <Card
            key={product.id}
            id={product.id}
            title={product.title}
            basePrice={product.basePrice}
            image={product.image}
            stock={product.stock}
          />

        ))}

      </div>

    </div>
  );
}