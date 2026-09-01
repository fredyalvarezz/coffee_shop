import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import coffeeImage from "../../assets/images/coffeeImage.png";

import eyeIcon from "../../assets/icons/eye.png";
import eyeOffIcon from "../../assets/icons/eye-off.png";

import { useUsers } from "../../context/UsersContext";
import { useAuth } from "../../context/AuthContext";

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { registerUser } = useUsers();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {

    e.preventDefault();

    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Completa nombre, correo y contraseña.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const result = registerUser({ name, email, phone, password });

    if (!result.success) {
      setError(result.error);
      return;
    }

    // Cuenta creada — entra directo, sin pedirle que inicie sesión aparte
    login(result.user);

    navigate("/");

  };

  return (
    <div className="register">

      <div className="register__card">

        <div className="register__left">
          <img
            src={coffeeImage}
            alt="kopi coffee"
            className="register__image"
          />
        </div>

        <div className="register__right">

          <h1 className="register__title">
            Crear cuenta
          </h1>

          <p className="register__subtitle">
            Regístrate para comenzar
          </p>

          <form className="register__form" onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Nombre completo"
              className="register__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              className="register__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Número telefónico"
              className="register__input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="register__password">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="register__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="register__eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? eyeOffIcon : eyeIcon}
                  alt="toggle password"
                />
              </button>

            </div>

            <div className="register__password">

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                className="register__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="register__eye"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <img
                  src={showConfirmPassword ? eyeOffIcon : eyeIcon}
                  alt="toggle password"
                />
              </button>

            </div>

            {error && (
              <p className="register__error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="register__button"
            >
              Crear cuenta
            </button>

          </form>

          <p className="register__footer">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login">
              Iniciar sesión
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}