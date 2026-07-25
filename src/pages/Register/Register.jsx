import "./Register.css";
import { Link } from "react-router-dom";
import { useState } from "react";

import coffeeImage from "../../assets/images/coffeeImage.png";

import eyeIcon from "../../assets/icons/eye.png";
import eyeOffIcon from "../../assets/icons/eye-off.png";

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

          <form className="register__form">

            <input
              type="text"
              placeholder="Nombre completo"
              className="register__input"
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              className="register__input"
            />

            <input
              type="tel"
              placeholder="Número telefónico"
              className="register__input"
            />

            <div className="register__password">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="register__input"
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