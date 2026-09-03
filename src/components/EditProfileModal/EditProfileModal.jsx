import { useState } from "react";
import Modal from "../Modal/Modal";
import Toast from "../Toast/Toast";
import { useUsers } from "../../context/UsersContext";
import { useAuth } from "../../context/AuthContext";
import "./EditProfileModal.css";

export default function EditProfileModal({
    user,
    onClose,
}) {

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone || "");

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const { users, updateUser } = useUsers();
    const { updateSessionUser } = useAuth();

    const showError = (message) => {
        setToastMessage(message);
        setToastType("warning");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!name.trim() || !email.trim()) {
            showError("El nombre y el correo no pueden quedar vacíos.");
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Si cambió el correo, hay que asegurarse de que no choque con
        // el de otra cuenta ya existente.
        const emailTaken = users.some(
            u => u.id !== user.id && u.email.toLowerCase() === normalizedEmail
        );

        if (emailTaken) {
            showError("Ya existe otra cuenta con ese correo.");
            return;
        }

        const updates = {
            name: name.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
        };

        updateUser(user.id, updates);

        updateSessionUser(updates);

        setToastMessage("Perfil actualizado ✅");
        setToastType("success");
        setShowToast(true);

        // Se deja ver el toast un momento antes de cerrar el modal.
        setTimeout(() => {
            setShowToast(false);
            onClose();
        }, 1200);

    };

    return (

        <Modal
            title="Editar Perfil"
            onClose={onClose}
        >

            <form className="edit-profile__form" onSubmit={handleSubmit}>

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

            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
            />

        </Modal>

    )

}