import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">UniVoice Hostel System</span>
        {currentUser && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hello, <strong>{currentUser.name}</strong> ({currentUser.role})
            </span>
            <Button variant="destructive" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-1 h-4 w-4" /> Sign Out
            </Button>
          </div>
        )}
      </nav>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
};

export default Layout;
