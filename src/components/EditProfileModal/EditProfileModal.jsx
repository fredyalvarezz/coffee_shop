import { useState } from "react";
import Modal from "../Modal/Modal";
import "./EditProfileModal.css";

export default function EditProfileModal({
    user,
    onClose,
}) {

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone || "");

    return (

        <Modal
            title="Editar Perfil"
            onClose={onClose}
        >

            <form className="edit-profile__form">

                <input
                    type="text"
                    className="edit-profile__input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre completo"
                />

                <input
                    type="email"
                    className="edit-profile__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                />

                <input
                    type="tel"
                    className="edit-profile__input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Número telefónico"
                />

                <button
                    type="submit"
                    className="edit-profile__button"
                >
                    Guardar cambios
                </button>

            </form>
        </Modal>

    )

}