import "./Login.css";
import { Link } from "react-router-dom";
import coffeeImage from "../../assets/images/coffeeImage.png";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/icons/eye.png";
import eyeOffIcon from "../../assets/icons/eye-off.png";

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const { authenticate } = useUsers();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        const foundUser = authenticate(email, password);

        if (!foundUser) {
            setError("Correo o contraseña incorrectos.");
            return;
        }

        login(foundUser);

        navigate("/");
    };

    return (
        <div className="login">

            <div className="login__card">

                <div className="login__left">
                    <img src={coffeeImage}
                        alt="kopi coffee"
                        className="login__image"
                    />
                </div>

                <div className="login__right">

                    <h1 className="login__title">
                        Bienvenido a Kopi Caffee
                    </h1>

                    <p className="login__subtitle">
                        Inicia sesión para continuar
                    </p>

                    <form className="login__form"
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="email"
                            autoComplete="email"
                            placeholder="Correo electrónico"
                            className="login__input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="login__password">

                            <input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Contraseña"
                                className="login__input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="login__eye"
                                onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword ? eyeOffIcon : eyeIcon}
                                    alt="toggle password" />
                            </button>

                        </div>

                        {error && (
                            <p className="login__error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="login__button"
                        >
                            Iniciar sesión
                        </button>

                    </form>

                    <p className="login__footer">
                        ¿No tienes cuenta?{" "}
                        <Link to="/register">
                            Crear cuenta
                        </Link>
                    </p>

                </div>

            </div >

        </div >
    );
}