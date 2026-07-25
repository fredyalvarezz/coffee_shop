import "./Header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Header() {

    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    if (
        location.pathname === "/login" ||
        location.pathname === "/register"
    ) {
        return null;
    }

    return (
        <header className="header">

            <div className="header__search">

                <input type="text"
                    placeholder="Buscar bebida..."
                    className="header__input"
                />

            </div>

            <div className="header__actions">

                {!user ? (
                    <>
                        <Link
                            to="/login"
                            className="header__link"
                        >
                            Iniciar Sesión
                        </Link>

                        <Link
                            to="/register"
                            className="header__button"
                        >
                            Registrar
                        </Link>
                    </>
                ) : (
                    <div className="header__user-wrapper">

                        <button
                            className="header__user"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            👤 {user.name} ▼
                        </button>

                        {menuOpen && (

                            <div className="header__dropdown">

                                <Link
                                    to="/perfil"
                                    className="header__dropdown-link"
                                >
                                    Mi perfil
                                </Link>

                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="header__dropdown-link"
                                    >
                                        Panel Admin
                                    </Link>
                                )}

                                <button
                                    className="header__logout"
                                    onClick={logout}
                                >
                                    Cerrar sesión
                                </button>

                            </div>

                        )}

                    </div>
                )}
            </div>

        </header>
    );
}