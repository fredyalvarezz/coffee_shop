import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function Home() {

 const navigate = useNavigate();
 const { user } = useAuth();

 console.log(user);

  return (
    <div className="home">
      {/* Header */}
      <header className="home__header">
        <div>
          <h2>Buenos días!</h2>
          <p>¿Qué te gustaría tomar hoy?</p>
        </div>

      </header>

      {/* Banner */}
      <section className="home__banner">
        <div className="home__banner-card">
          <h2 className="home__banner-card-text">Caramel Cloud</h2>
          <button className="home__banner-card-button">Pedir ahora</button>
        </div>
      </section>

      {/* Categorías */}
      <section className="home__section">
        <h3>Categorías</h3>
        <div className="home__section-categorias">
          <button className="home__section-categorias-button" onClick={() => navigate("/menu?cat=calientes")}>
            Calientes
            </button>
          <button className="home__section-categorias-button" onClick={() => navigate("/menu?cat=frias")}>
            Frias
            </button>
          <button className="home__section-categorias-button" onClick={() => navigate("/menu?cat=frappes")}>
            Frappes
            </button>
          <button className="home__section-categorias-button" onClick={() => navigate("/menu?cat=temporada")}>
            Temporada
            </button>
        </div>
      </section>
    </div>
  );
}