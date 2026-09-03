import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider ({children}) {

    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser
        ? JSON.parse(savedUser)
        : null;
    });

    useEffect(() => {
        localStorage.setItem(
            "user", 
            JSON.stringify(user));
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        navigate("/login", { replace: true });
    };

    // Cuando se edita el perfil (nombre, correo, teléfono) desde
    // EditProfileModal, la fuente real (UsersContext) ya queda
    // actualizada — esto solo refresca la copia de la sesión activa
    // para que se refleje al instante en Header/Sidebar/Profile sin
    // tener que cerrar sesión y volver a entrar.
    const updateSessionUser = (updates) => {
        setUser(prev => (prev ? { ...prev, ...updates } : prev));
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            login,
            logout,
            updateSessionUser,
        }}
            >
            {children}

        </AuthContext.Provider>
    );
}