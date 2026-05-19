import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useCart } from "../../context/CartContext";

export default function Sidebar({ onOpenCart }) {
    const location = useLocation();
    const { cart } =  useCart();

    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar__logo">
                <img src={logo} alt="logo" className="sidebar__logo-img" />
                <h2 className="sidebar__logo-text">Kopi Coffee</h2>
            </div>

            {/* Navegación */}
            <nav className="sidebar__nav">
                
                <Link
                    to="/"
                    className={`sidebar__link ${location.pathname === "/" ? "active" : ""
                        }`}
                >
                    Inicio
                </Link>

                <Link
                    to="/menu"
                    className={`sidebar__link ${location.pathname === "/menu" ? "active" : ""
                        }`}
                >
                    Menú
                </Link>

                <Link
                    to="/pedidos"
                    className={`sidebar__link ${location.pathname === "/pedidos" ? "active" : ""
                        }`}
                >
                    Pedidos

                    {totalItems >0 && (
                        <span className="sidebar__badge">{totalItems}</span>
                    )}
                </Link>

                <Link
                    to="/cartera"
                    className={`sidebar__link ${location.pathname === "/cartera" ? "active" : ""
                        }`}
                >
                    Cartera
                </Link>
                <Link
                    to="/perfil"
                    className={`sidebar__link ${location.pathname === "/perfil" ? "active" : ""
                        }`}
                >
                    Perfil</Link>
            </nav>
        </aside>
    );
}