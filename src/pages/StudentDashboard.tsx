import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Category, ComplaintStatus } from "@/types";
import { BAD_WORDS } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const statusColor = (s: ComplaintStatus) => {
  if (s === ComplaintStatus.PENDING) return "hsl(30 100% 50%)";
  if (s === ComplaintStatus.RESOLVED) return "hsl(120 60% 40%)";
  if (s === ComplaintStatus.REJECTED) return "hsl(0 84% 60%)";
  if (s === ComplaintStatus.IN_PROGRESS) return "hsl(220 100% 50%)";
  return "hsl(0 0% 50%)";
};

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { complaints, addComplaint, getHostelById } = useData();
  const [category, setCategory] = useState<Category>(Category.ELECTRIC);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");

  if (!currentUser) return null;
  const myComplaints = complaints.filter((c) => c.userId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `${heading} ${description}`.toLowerCase();
    const isAbusive = BAD_WORDS.some((w) => text.includes(w));
    addComplaint({
      id: `c${Date.now()}`,
      heading, description, category,
      createdAt: new Date().toISOString().split("T")[0],
      status: isAbusive ? ComplaintStatus.FLAGGED : ComplaintStatus.PENDING,
      isUrgent: false, isAbusive,
      userId: currentUser.id,
      hostelId: currentUser.hostelId || "",
    });
    toast.success(isAbusive ? "Complaint filed but flagged for review" : "Complaint filed successfully");
    setHeading(""); setDescription("");
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold">Student Dashboard</h2>
      <p className="text-muted-foreground mb-6">
        Room: {currentUser.roomNumber || "Not Assigned"} | Hostel: {currentUser.hostelId ? getHostelById(currentUser.hostelId)?.name : "Not Assigned"}
      </p>
      <div className="flex gap-8">
        <div className="flex-1 border p-5 rounded-lg">
          <h3 className="font-semibold mb-3">File a Complaint</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Category:</label>
              <select className="w-full p-2 border rounded mt-1" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {Object.values(Category).map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>
            <Input placeholder="e.g., Fan not working" value={heading} onChange={(e) => setHeading(e.target.value)} required />
            <Textarea placeholder="Describe your issue..." rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Button type="submit">Submit Complaint</Button>
          </form>
        </div>
        <div className="flex-1 border p-5 rounded-lg">
          <h3 className="font-semibold mb-3">My Complaints</h3>
          {myComplaints.length === 0 ? <p className="text-muted-foreground">No complaints filed yet.</p> : (
            <ul className="space-y-4">
              {myComplaints.map((c) => (
                <li key={c.id} className="border-b pb-3">
                  <strong>{c.heading}</strong> <small className="text-muted-foreground">({c.createdAt})</small><br />
                  Status: <Badge style={{ background: statusColor(c.status), color: "white" }}>{c.status.toUpperCase()}</Badge><br />
                  <small>{c.description}</small>
                  {c.wardenComment && <p className="text-sm text-primary mt-1">Warden: {c.wardenComment}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
