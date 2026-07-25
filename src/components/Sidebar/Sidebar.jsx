import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useCart } from "../../context/CartContext";


export default function Sidebar({
    isOpen,
    setIsOpen,
}) {
    const location = useLocation();
    const { cart } = useCart();

    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);


    if (
        location.pathname === "/login" ||
        location.pathname === "/register"
    ) {
        return null;
    }

    return (
        <>

            <button
                className={`sidebar__toggle ${isOpen ? "active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>



            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>


                {/* Logo */}
                <div className="sidebar__logo">
                    <img src={logo} alt="logo" className="sidebar__logo-img" />
                    <h2 className="sidebar__logo-text">Kopi Coffee</h2>
                </div>

                {/* Navegación */}
                <nav className="sidebar__nav">

                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className={`sidebar__link ${location.pathname === "/" ? "active" : ""
                            }`}
                    >
                        Inicio
                    </Link>

                    <Link
                        to="/menu"
                        onClick={() => setIsOpen(false)}
                        className={`sidebar__link ${location.pathname === "/menu" ? "active" : ""
                            }`}
                    >
                        Menú
                    </Link>

                    <Link
                        to="/pedidos"
                        onClick={() => setIsOpen(false)}
                        className={`sidebar__link ${location.pathname === "/pedidos" ? "active" : ""
                            }`}
                    >
                        Pedidos

                        {totalItems > 0 && (
                            <span className="sidebar__badge">{totalItems}</span>
                        )}
                    </Link>

                    <Link
                        to="/cartera"
                        onClick={() => setIsOpen(false)}
                        className={`sidebar__link ${location.pathname === "/cartera" ? "active" : ""
                            }`}
                    >
                        Cartera
                    </Link>
            
                    <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className={`sidebar__link ${location.pathname === "/login" ? "active" : ""
                            }`}
                    >
                        Iniciar Sesion
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className={`sidebar__link ${location.pathname === "/register" ? "active" : ""
                            }`}
                    >
                        Registrarse
                    </Link>
                </nav>
            </aside>
        </>
    );

}