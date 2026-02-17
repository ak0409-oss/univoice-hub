import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { ComplaintStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const WardenDashboard = () => {
  const { currentUser } = useAuth();
  const { complaints, updateComplaint, getUserById, getHostelById } = useData();
  const [comments, setComments] = useState<Record<string, string>>({});

  if (!currentUser) return null;
  const hostelComplaints = complaints.filter((c) => c.hostelId === currentUser.hostelId);

  const urgent = hostelComplaints.filter((c) => c.isUrgent && c.status !== ComplaintStatus.RESOLVED && c.status !== ComplaintStatus.REJECTED);
  const pending = hostelComplaints.filter((c) => c.status === ComplaintStatus.PENDING && !c.isUrgent);
  const inProgress = hostelComplaints.filter((c) => c.status === ComplaintStatus.IN_PROGRESS && !c.isUrgent);
  const completed = hostelComplaints.filter((c) => c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.REJECTED);
  const archived = hostelComplaints.filter((c) => c.status === ComplaintStatus.FLAGGED);

  const handleAction = (id: string, status: ComplaintStatus) => {
    updateComplaint(id, {
      status,
      wardenComment: comments[id] || undefined,
      resolvedAt: status === ComplaintStatus.RESOLVED ? new Date().toISOString().split("T")[0] : undefined,
    });
    toast.success(`Complaint ${status}`);
  };

  const sections = [
    { title: "1. Mentor Forwarded (URGENT)", items: urgent, color: "hsl(0 84% 60%)", section: "urgent" },
    { title: "2. Pending Complaints", items: pending, color: "hsl(30 100% 50%)", section: "pending" },
    { title: "3. In Progress", items: inProgress, color: "hsl(220 100% 50%)", section: "progress" },
    { title: "4. Completed History", items: completed, color: "hsl(120 60% 40%)", section: "completed" },
    { title: "5. Archived / Flagged", items: archived, color: "hsl(0 0% 50%)", section: "archived" },
  ];

  return (
    <Layout>
      <h2 className="text-2xl font-bold">Warden Dashboard</h2>
      <p className="text-muted-foreground mb-4">Hostel: <strong>{currentUser.hostelId ? getHostelById(currentUser.hostelId)?.name : "Unassigned"}</strong></p>
      {sections.map(({ title, items, color, section }) => (
        <div key={section} className="mb-8">
          <h3 className="p-3 bg-muted font-bold mb-2" style={{ borderLeft: `5px solid ${color}` }}>{title}</h3>
          {items.length === 0 ? <p className="text-muted-foreground italic ml-2">No complaints in this section.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Category</TableHead><TableHead>Issue</TableHead><TableHead>Warden Comment</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {items.map((c) => {
                  const author = getUserById(c.userId);
                  return (
                    <TableRow key={c.id}>
                      <TableCell>{author?.name}<br /><small>Room: {author?.roomNumber}</small></TableCell>
                      <TableCell><Badge variant="secondary">{c.category.toUpperCase()}</Badge></TableCell>
                      <TableCell><strong>{c.heading}</strong><br />{c.description}{c.mentorComment && <p className="text-sm text-primary mt-1">Mentor: {c.mentorComment}</p>}</TableCell>
                      <TableCell>
                        {section === "completed" ? c.wardenComment : (
                          <Textarea rows={2} value={comments[c.id] ?? c.wardenComment ?? ""} onChange={(e) => setComments({ ...comments, [c.id]: e.target.value })} />
                        )}
                      </TableCell>
                      <TableCell>
                        {section === "completed" ? (
                          <><Badge style={{ background: c.status === ComplaintStatus.RESOLVED ? "hsl(120 60% 40%)" : "hsl(0 84% 60%)", color: "white" }}>{c.status.toUpperCase()}</Badge>{c.resolvedAt && <br />}{c.resolvedAt && <small>{c.resolvedAt}</small>}</>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <Button size="sm" onClick={() => handleAction(c.id, ComplaintStatus.RESOLVED)} className="bg-green-600 hover:bg-green-700 text-white">Resolve</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleAction(c.id, ComplaintStatus.REJECTED)}>Reject</Button>
                            {section !== "progress" && <Button size="sm" onClick={() => handleAction(c.id, ComplaintStatus.IN_PROGRESS)} style={{ background: "hsl(30 100% 50%)" }} className="text-white">Progress</Button>}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      ))}
    </Layout>
  );
};

export default WardenDashboard;
