import { createContext, useContext, useState, useEffect } from "react";
import seedUsers from "../data/users";

const STORAGE_KEY = "cafeteria_users";

const UsersContext = createContext(null);

// Los usuarios de la semilla (data/users.js) no traen contraseña, porque
// eran solo datos de prueba para la lista del admin. Les ponemos una por
// default ("1234") para que también puedan entrar por el login real, si
// quieres seguir probando con ellos (ej. fredy@kopi.com / 1234).
function withDefaultPassword(user) {
    return { password: "1234", ...user };
}

function loadInitialUsers() {

    try {

        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            return JSON.parse(stored);
        }

    } catch (err) {
        console.error("No se pudieron leer los usuarios guardados:", err);
    }

    return seedUsers.map(withDefaultPassword);

}

export function UsersProvider({ children }) {

    const [users, setUsers] = useState(loadInitialUsers);

    useEffect(() => {

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        } catch (err) {
            console.error("No se pudieron guardar los usuarios:", err);
        }

    }, [users]);

    // Registro real: valida que el correo no esté repetido.
    // Regresa { success, user } o { success: false, error }.
    const registerUser = ({ name, email, phone, password }) => {

        const normalizedEmail = email.trim().toLowerCase();

        const exists = users.some(
            u => u.email.toLowerCase() === normalizedEmail
        );

        if (exists) {
            return { success: false, error: "Ya existe una cuenta con ese correo." };
        }

        const nextId = users.length > 0
            ? Math.max(...users.map(u => u.id)) + 1
            : 1;

        const newUser = {
            id: nextId,
            name: name.trim(),
            email: normalizedEmail,
            phone: phone?.trim() || "",
            password,
            role: "user",
        };

        setUsers(prev => [...prev, newUser]);

        return { success: true, user: newUser };

    };

    // Login real: busca coincidencia exacta de correo + contraseña.
    // Regresa el usuario (sin la contraseña) o null si no coincide.
    const authenticate = (email, password) => {

        const normalizedEmail = email.trim().toLowerCase();

        const found = users.find(
            u => u.email.toLowerCase() === normalizedEmail && u.password === password
        );

        if (!found) return null;

        const { password: _password, ...safeUser } = found;

        return safeUser;

    };

    const updateUser = (id, updates) => {
        setUsers(prev =>
            prev.map(u => (u.id === id ? { ...u, ...updates } : u))
        );
    };

    const deleteUser = (id) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    return (
        <UsersContext.Provider
            value={{ users, registerUser, authenticate, updateUser, deleteUser }}
        >
            {children}
        </UsersContext.Provider>
    );

}

export function useUsers() {

    const context = useContext(UsersContext);

    if (!context) {
        throw new Error("useUsers debe usarse dentro de un <UsersProvider>");
    }

    return context;

}