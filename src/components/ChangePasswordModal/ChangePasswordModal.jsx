import { useState } from "react";
import Modal from "../Modal/Modal";
import Toast from "../Toast/Toast";
import { useUsers } from "../../context/UsersContext";
import eyeIcon from "../../assets/icons/eye.png";
import eyeOffIcon from "../../assets/icons/eye-off.png";
import "./ChangePasswordModal.css";

export default function ChangePasswordModal({
    user,
    onClose,
}) {

    const { users, updateUser } = useUsers();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const showError = (message) => {
        setToastMessage(message);
        setToastType("warning");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        // El objeto "user" de useAuth() no trae la contraseña (se le
        // quita a propósito al hacer login) — para validarla hay que
        // buscar el registro completo en UsersContext.
        const fullUser = users.find(u => u.id === user.id);

        if (!fullUser || fullUser.password !== currentPassword) {
            showError("La contraseña actual no es correcta.");
            return;
        }

        if (!newPassword) {
            showError("Escribe la contraseña nueva.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showError("Las contraseñas nuevas no coinciden.");
            return;
        }

        updateUser(user.id, { password: newPassword });

        setToastMessage("Contraseña actualizada ✅");
        setToastType("success");
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
            onClose();
        }, 1200);

    };

    return (

        <Modal
            title="Cambiar contraseña"
            onClose={onClose}
        >

            <form className="change-password__form" onSubmit={handleSubmit}>

                <div className="change-password__field">
                    <input
                        type={showCurrentPassword ? "text" : "password"}
                        className="change-password__input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Contraseña actual"
                    />
                    <button
                        type="button"
                        className="change-password__eye"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                        <img
                            src={showCurrentPassword ? eyeOffIcon : eyeIcon}
                            alt="toggle password"
                        />
                    </button>
                </div>

                <div className="change-password__field">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        className="change-password__input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Contraseña nueva"
                    />
                    <button
                        type="button"
                        className="change-password__eye"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        <img
                            src={showNewPassword ? eyeOffIcon : eyeIcon}
                            alt="toggle password"
                        />
                    </button>
                </div>

                <div className="change-password__field">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="change-password__input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar contraseña nueva"
                    />
                    <button
                        type="button"
                        className="change-password__eye"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <img
                            src={showConfirmPassword ? eyeOffIcon : eyeIcon}
                            alt="toggle password"
                        />
                    </button>
                </div>

                <button
                    type="submit"
                    className="change-password__button"
                >
                    Guardar
                </button>

            </form>

            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
            />

        </Modal>

    );

}