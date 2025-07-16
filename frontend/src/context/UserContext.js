import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔥 Load user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const addToLibrary = (book) => {
    setUser((prev) => {
      const exists = prev.library?.some((b) => b.id === book.id);
      if (exists) return prev;
      return { ...prev, library: [...(prev.library || []), book] };
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, addToLibrary }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
