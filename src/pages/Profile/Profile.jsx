import "./Profile.css";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png"
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaEdit,
  FaLock,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

import { useState } from "react";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";

export default function Profile() {

  const { user, logout } = useAuth();

  const roleLabel = {
    admin: "Administrador de Kopi Coffee",
    user: "Cliente de Kopi Coffee",
  };

  const [showEditModal, setShowEditModal] = useState(false);


  if (!user) {
    return (
      <div className="profile">
        <h2>Debes iniciar sesión.</h2>
      </div>
    );
  }

  return (

    <section className="profile">

      <div className="profile__card">

        <div className="profile__avatar">

          <img
            src={logo}
            alt="Kopi Coffee"
            className="profile__avatar-image"
          />

        </div>

        <h1 className="profile__name">
          {user?.name}

        </h1>


        <p className="profile__subtitle">
          {roleLabel[user.role] || "Usuario de Kopi Coffee"}
        </p>

        <div className="profile__info">

          <div className="profile__item">

            <FaUserCircle className="profile__icon" />

            <p>{user?.name}</p>

          </div>

          <div className="profile__item">

            <FaEnvelope className="profile__icon" />
            <p>{user?.email}</p>

          </div>

          <div className="profile__item">

            <FaPhone className="profile__icon" />
            <p>{user?.phone || "Sin teléfono"}</p>

          </div>

          <div className="profile__item">

            <FaUserShield className="profile__icon" />

            <span
              className={
                user?.role === "admin"
                  ? "profile__badge profile__badge--admin"
                  : "profile__badge"
              }
            >
              {user?.role}
            </span>

          </div>

        </div>

        <div className="profile__actions">

          <button className="profile__button"
            onClick={() => setShowEditModal(true)}>
            <FaEdit />
            Editar Perfil

          </button>

          <button className="profile__button">
            <FaLock />
            Cambiar contraseña

          </button>

          <button className="profile__button">
            <FaClipboardList />
            Mis pedidos

          </button>

          <button
            className="profile__logout"
            onClick={logout}
          >
            <FaSignOutAlt />
            Cerrar sesión
          </button>

        </div>

      </div>
      {
        showEditModal && (

          <EditProfileModal

            user={user}

            onClose={() => setShowEditModal(false)}

          />

        )
      }

    </section>


  );

}