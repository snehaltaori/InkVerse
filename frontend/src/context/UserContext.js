import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "inklover",
    followers: 128,
    following: 67,
    profilePic: "https://placehold.co/100x100",
    library: [],
  });

  const addToLibrary = (book) => {
    setUser((prev) => {
      const exists = prev.library.some((b) => b.id === book.id);
      if (exists) return prev;
      return { ...prev, library: [...prev.library, book] };
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, addToLibrary }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
