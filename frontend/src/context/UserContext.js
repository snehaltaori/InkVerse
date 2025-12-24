import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // 🔹 Load auth from localStorage on app start
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    // 🔹 Sync user changes to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // 🔹 Sync token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // 🔹 Add to library (safe & deduped)
    const addToLibrary = (book) => {
        if (!user) return;

        setUser((prev) => {
            if (!prev) return prev;

            const exists = prev.library?.some(
                (b) => b._id === book._id
            );

            if (exists) return prev;

            return {
                ...prev,
                library: [...(prev.library || []), book],
            };
        });
    };

    // 🔹 Logout helper
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken,
                addToLibrary,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);


