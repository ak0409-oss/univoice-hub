import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserById, updateUser, hostels, users } = useData();
  const user = getUserById(id!);
  const mentors = users.filter((u) => u.role === UserRole.MENTOR);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [mentorId, setMentorId] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setHostelId(user.hostelId || "");
      setMentorId(user.mentorId || "");
    }
  }, [user]);

  if (!user) return <Layout><p>User not found.</p></Layout>;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, { name, email, hostelId: hostelId || undefined, mentorId: mentorId || undefined });
    toast.success("User updated");
    navigate("/admin");
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-5">Edit User: {user.name}</h2>
      <div className="border p-5 max-w-lg rounded-lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="text-sm font-medium">Name</label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div><label className="text-sm font-medium">Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div>
            <label className="text-sm font-medium">Assigned Hostel</label>
            <Select value={hostelId} onValueChange={setHostelId}>
              <SelectTrigger><SelectValue placeholder="-- None --" /></SelectTrigger>
              <SelectContent><SelectItem value="none">-- None --</SelectItem>{hostels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {user.role === UserRole.STUDENT && (
            <div>
              <label className="text-sm font-medium">Assigned Mentor</label>
              <Select value={mentorId} onValueChange={setMentorId}>
                <SelectTrigger><SelectValue placeholder="-- None --" /></SelectTrigger>
                <SelectContent><SelectItem value="none">-- None --</SelectItem>{mentors.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="submit">Save Changes</Button>
            <Link to="/admin"><Button variant="outline" type="button">Cancel</Button></Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditUser;
