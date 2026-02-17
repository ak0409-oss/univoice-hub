import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "@/types";
import { initialUsers } from "@/data/mockData";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode; users: User[] }> = ({ children, users }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = useCallback(
    (email: string, password: string): User | null => {
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        return user;
      }
      return null;
    },
    [users]
  );

  const logout = useCallback(() => setCurrentUser(null), []);

  return <AuthContext.Provider value={{ currentUser, login, logout }}>{children}</AuthContext.Provider>;
};
