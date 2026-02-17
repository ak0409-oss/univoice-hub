import React, { createContext, useContext, useState, useCallback } from "react";
import { User, Hostel, Complaint, UserRole, ComplaintStatus } from "@/types";
import { initialUsers, initialHostels, initialComplaints } from "@/data/mockData";

interface DataContextType {
  users: User[];
  hostels: Hostel[];
  complaints: Complaint[];
  addUser: (u: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addHostel: (h: Hostel) => void;
  deleteHostel: (id: string) => void;
  addComplaint: (c: Complaint) => void;
  updateComplaint: (id: string, data: Partial<Complaint>) => void;
  deleteComplaint: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getHostelById: (id: string) => Hostel | undefined;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [hostels, setHostels] = useState<Hostel[]>(initialHostels);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  const addUser = useCallback((u: User) => setUsers((p) => [...p, u]), []);
  const updateUser = useCallback((id: string, data: Partial<User>) => setUsers((p) => p.map((u) => (u.id === id ? { ...u, ...data } : u))), []);
  const deleteUser = useCallback((id: string) => setUsers((p) => p.filter((u) => u.id !== id)), []);
  const addHostel = useCallback((h: Hostel) => setHostels((p) => [...p, h]), []);
  const deleteHostel = useCallback((id: string) => {
    setHostels((p) => p.filter((h) => h.id !== id));
    setUsers((p) => p.map((u) => (u.hostelId === id ? { ...u, hostelId: undefined } : u)));
  }, []);
  const addComplaint = useCallback((c: Complaint) => setComplaints((p) => [...p, c]), []);
  const updateComplaint = useCallback((id: string, data: Partial<Complaint>) => setComplaints((p) => p.map((c) => (c.id === id ? { ...c, ...data } : c))), []);
  const deleteComplaint = useCallback((id: string) => setComplaints((p) => p.filter((c) => c.id !== id)), []);
  const getUserById = useCallback((id: string) => users.find((u) => u.id === id), [users]);
  const getHostelById = useCallback((id: string) => hostels.find((h) => h.id === id), [hostels]);

  return (
    <DataContext.Provider value={{ users, hostels, complaints, addUser, updateUser, deleteUser, addHostel, deleteHostel, addComplaint, updateComplaint, deleteComplaint, getUserById, getHostelById }}>
      {children}
    </DataContext.Provider>
  );
};
