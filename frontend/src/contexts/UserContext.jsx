import { useState, useEffect, createContext, useContext } from "react";

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: null,
    email: "",
    firstName: "",
    lastName: "",
    csrfToken: "",
  });

  useEffect(() => {
    fetch(`/api/accounts/0`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);
  const value = [user, setUser];

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
