import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { ComplaintStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const MentorDashboard = () => {
  const { currentUser } = useAuth();
  const { users, complaints, updateComplaint, getUserById } = useData();
  const [mentorComments, setMentorComments] = useState<Record<string, string>>({});
  const [urgentFlags, setUrgentFlags] = useState<Record<string, boolean>>({});

  if (!currentUser) return null;
  const menteeIds = users.filter((u) => u.mentorId === currentUser.id).map((u) => u.id);
  const menteeComplaints = complaints.filter((c) => menteeIds.includes(c.userId));

  const handleUpdate = (id: string) => {
    updateComplaint(id, {
      mentorComment: mentorComments[id] ?? undefined,
      isUrgent: urgentFlags[id] ?? false,
    });
    toast.success("Complaint updated");
  };

  const statusColor = (s: ComplaintStatus) => {
    if (s === ComplaintStatus.RESOLVED) return "hsl(120 60% 40%)";
    if (s === ComplaintStatus.PENDING) return "hsl(30 100% 50%)";
    if (s === ComplaintStatus.REJECTED) return "hsl(0 84% 60%)";
    return "hsl(220 100% 50%)";
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold">Mentor Dashboard</h2>
      <p className="text-muted-foreground mb-6">Welcome, Mentor {currentUser.name}</p>
      <h3 className="font-semibold mb-3">My Mentees' Complaints</h3>
      {menteeComplaints.length === 0 ? <p className="text-muted-foreground">Your mentees have not filed any complaints yet.</p> : (
        <Table>
          <TableHeader><TableRow className="bg-accent"><TableHead>Student</TableHead><TableHead>Issue</TableHead><TableHead>Current Status</TableHead><TableHead>Mentor Action</TableHead></TableRow></TableHeader>
          <TableBody>
            {menteeComplaints.map((c) => {
              const author = getUserById(c.userId);
              return (
                <TableRow key={c.id}>
                  <TableCell><strong>{author?.name}</strong><br />Room: {author?.roomNumber || "N/A"}</TableCell>
                  <TableCell><Badge variant="secondary" className="mb-1">{c.category.toUpperCase()}</Badge><br /><strong>{c.heading}</strong><br />{c.description}</TableCell>
                  <TableCell>
                    <Badge style={{ background: statusColor(c.status), color: "white" }}>{c.status.toUpperCase()}</Badge>
                    {c.wardenComment && <p className="text-sm mt-1">Warden: {c.wardenComment}</p>}
                  </TableCell>
                  <TableCell className="bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox checked={urgentFlags[c.id] ?? c.isUrgent} onCheckedChange={(v) => setUrgentFlags({ ...urgentFlags, [c.id]: !!v })} />
                      <label className="text-sm font-bold text-destructive">Mark as URGENT (Escalate)</label>
                    </div>
                    <Textarea rows={2} placeholder="Add your advice..." value={mentorComments[c.id] ?? c.mentorComment ?? ""} onChange={(e) => setMentorComments({ ...mentorComments, [c.id]: e.target.value })} />
                    <Button size="sm" className="mt-2" onClick={() => handleUpdate(c.id)}>Update</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Layout>
  );
};

export default MentorDashboard;
