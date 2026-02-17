import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (!user) {
      toast.error("Invalid credentials");
      return;
    }
    toast.success(`Welcome, ${user.name}!`);
    const routes: Record<UserRole, string> = {
      [UserRole.ADMIN]: "/admin",
      [UserRole.STUDENT]: "/student",
      [UserRole.WARDEN]: "/warden",
      [UserRole.MENTOR]: "/mentor",
    };
    navigate(routes[user.role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">UniVoice Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full">Login Manually</Button>
          </form>
          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">Or sign in with:</p>
            <Button variant="outline" className="w-full" disabled>
              G &nbsp; Sign in with Google (Coming Soon)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Admin: 12345@kiit.ac.in / 123456 · Others: studentX@gmail.com / 12345
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
