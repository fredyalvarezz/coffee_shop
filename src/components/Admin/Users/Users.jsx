import "./Users.css";

import { useState } from "react";

import { useAdmin } from "../../../context/AdminContext";
import Modal from "../../../components/Modal/Modal";
import Toast from "../../../components/Toast/Toast";
import { FaSearch } from "react-icons/fa";

export default function Users() {

    const { users, updateUser, deleteUser } = useAdmin();

    const [search, setSearch] = useState("");
    const [userToDelete, setUserToDelete] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const notify = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1500);
    };

    const filteredUsers = users.filter((u) => {
        const text = search.toLowerCase();
        return (
            u.name.toLowerCase().includes(text) ||
            u.email.toLowerCase().includes(text)
        );
    });

    const handleRoleChange = (id, role) => {
        updateUser(id, { role });
        notify();
    };

    const confirmDelete = () => {
        deleteUser(userToDelete.id);
        setUserToDelete(null);
        notify();
    };

    return (
        <section className="users">

            <div className="users__header">

                <h1>Usuarios</h1>

                <div className="users__search-container">
                    <FaSearch className="users__search-icon" />
                    <input
                        type="text"
                        className="users__search"
                        placeholder="Buscar por nombre o correo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

            </div>

            <p className="users__count">
                {filteredUsers.length} usuarios encontrados
            </p>

            <div className="users__table-wrap">

                <table className="users__table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4}>No se encontraron usuarios.</td>
                            </tr>
                        )}

                        {filteredUsers.map((u) => (
                            <tr key={u.id}>

                                <td>{u.name}</td>

                                <td>{u.email}</td>

                                <td>
                                    <select
                                        className={`users__role users__role--${u.role}`}
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    >
                                        <option value="user">Cliente</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>

                                <td>
                                    <button
                                        className="users__delete"
                                        onClick={() => setUserToDelete(u)}
                                    >
                                        Eliminar
                                    </button>
                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>

            </div>

            {/* Modal Confirmación de eliminar */}
            {userToDelete && (
                <Modal
                    title="Eliminar usuario"
                    onClose={() => setUserToDelete(null)}
                >

                    <div className="users__confirm">

                        <p>
                            ¿Seguro que deseas eliminar la cuenta de "{userToDelete.name}"?
                            Esta acción no se puede deshacer.
                        </p>

                        <div className="users__confirm-buttons">

                            <button
                                className="users__confirm-cancel"
                                onClick={() => setUserToDelete(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="users__confirm-delete"
                                onClick={confirmDelete}
                            >
                                Sí, eliminar
                            </button>

                        </div>

                    </div>

                </Modal>
            )}

            <Toast
                message="Usuarios actualizado ✅"
                type="success"
                isVisible={showToast}
            />

        </section>
    );

}