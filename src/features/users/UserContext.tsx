import React, { createContext, useContext, useState, useEffect } from "react";

type UserContextType = {
  activeUserId: number | null;
  activeUsername: string | null;
  setActiveUser: (id: number, username: string) => void;
  clearActiveUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [activeUserId, setActiveUserIdState] = useState<number | null>(null);
  const [activeUsername, setActiveUsernameState] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("recoforge_active_user_id");
    const name = localStorage.getItem("recoforge_active_username");
    if (id && name) {
      setActiveUserIdState(Number(id));
      setActiveUsernameState(name);
    }
  }, []);

  const setActiveUser = (id: number, username: string) => {
    localStorage.setItem("recoforge_active_user_id", String(id));
    localStorage.setItem("recoforge_active_username", username);
    setActiveUserIdState(id);
    setActiveUsernameState(username);
  };

  const clearActiveUser = () => {
    localStorage.removeItem("recoforge_active_user_id");
    localStorage.removeItem("recoforge_active_username");
    setActiveUserIdState(null);
    setActiveUsernameState(null);
  };

  return (
    <UserContext.Provider
      value={{ activeUserId, activeUsername, setActiveUser, clearActiveUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useActiveUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useActiveUser must be used within a UserProvider");
  }
  return context;
}
