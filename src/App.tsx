import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { initialUsers } from "@/data/mockData";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageHostels from "./pages/admin/ManageHostels";
import ManageWardens from "./pages/admin/ManageWardens";
import ManageMentors from "./pages/admin/ManageMentors";
import ManageStudents from "./pages/admin/ManageStudents";
import AdminComplaints from "./pages/admin/AdminComplaints";
import EditUser from "./pages/admin/EditUser";
import StudentProfile from "./pages/admin/StudentProfile";
import StudentDashboard from "./pages/StudentDashboard";
import WardenDashboard from "./pages/WardenDashboard";
import MentorDashboard from "./pages/MentorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DataProvider>
        <BrowserRouter>
          <AuthProvider users={initialUsers}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/hostels" element={<ManageHostels />} />
              <Route path="/admin/wardens" element={<ManageWardens />} />
              <Route path="/admin/mentors" element={<ManageMentors />} />
              <Route path="/admin/students" element={<ManageStudents />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/edit-user/:id" element={<EditUser />} />
              <Route path="/admin/student/:id" element={<StudentProfile />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/warden" element={<WardenDashboard />} />
              <Route path="/mentor" element={<MentorDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
