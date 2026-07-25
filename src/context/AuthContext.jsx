import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider ({children}) {

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
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            login,
            logout,
        }}
            >
            {children}

        </AuthContext.Provider>
    );
}