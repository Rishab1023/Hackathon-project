"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define the list of admin emails
const adminEmails = ["admin@example.com"];

// This is a mock User object
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  // Add other fields you might use
}

interface AuthContextType {
  user: MockUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser: MockUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.email ? adminEmails.includes(parsedUser.email) : false);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string) => {
    const newUser: MockUser = {
      uid: "user_" + Math.random().toString(36).substr(2, 9),
      email: email,
      displayName: email.split('@')[0],
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setIsAdmin(adminEmails.includes(email));
    setLoading(false);
  };
  
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAdmin(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
