import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { ComplaintStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusColor = (s: ComplaintStatus) => {
  if (s === ComplaintStatus.RESOLVED) return "hsl(120 60% 40%)";
  if (s === ComplaintStatus.PENDING) return "hsl(30 100% 50%)";
  if (s === ComplaintStatus.REJECTED) return "hsl(0 84% 60%)";
  if (s === ComplaintStatus.IN_PROGRESS) return "hsl(220 100% 50%)";
  return "hsl(0 0% 50%)";
};

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { getUserById, getHostelById, complaints } = useData();
  const student = getUserById(id!);

  if (!student) return <Layout><p>Student not found.</p></Layout>;

  const studentComplaints = complaints.filter((c) => c.userId === student.id);
  const flagged = studentComplaints.filter((c) => c.isAbusive);
  const history = studentComplaints.filter((c) => !c.isAbusive);
  const mentor = student.mentorId ? getUserById(student.mentorId) : null;

  return (
    <Layout>
      <Link to={`/admin/students${student.hostelId ? `?hostel=${student.hostelId}` : ""}`} className="text-sm text-muted-foreground hover:underline">← Back to List</Link>
      <div className="border p-5 bg-card rounded-lg mt-3 mb-8">
        <h2 className="text-xl font-bold">{student.name}</h2>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Hostel:</strong> {student.hostelId ? getHostelById(student.hostelId)?.name : "Unassigned"}</p>
        <p><strong>Room:</strong> {student.roomNumber || "N/A"}</p>
        <p><strong>Mentor:</strong> {mentor?.name || "None"}</p>
      </div>

      <h3 className="text-lg font-bold text-destructive border-b-2 border-destructive pb-1 mb-3">⚠️ Flagged / Abusive History</h3>
      {flagged.length === 0 ? <p className="text-muted-foreground mb-6">No flagged complaints.</p> : flagged.map((c) => (
        <div key={c.id} className="bg-destructive/10 border border-destructive p-3 rounded mb-2">
          <strong>{c.heading}</strong> ({c.createdAt})<br />{c.description}
        </div>
      ))}

      <h3 className="text-lg font-bold border-b-2 pb-1 mb-3 mt-8">📄 Complete Complaint History</h3>
      {history.length === 0 ? <p className="text-muted-foreground">No other complaints filed.</p> : (
        <Table>
          <TableHeader><TableRow className="bg-muted"><TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead>Issue</TableHead><TableHead>Status</TableHead><TableHead>Comments</TableHead></TableRow></TableHeader>
          <TableBody>
            {history.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.createdAt}</TableCell>
                <TableCell>{c.category}</TableCell>
                <TableCell><strong>{c.heading}</strong><br /><small>{c.description}</small></TableCell>
                <TableCell><Badge style={{ background: statusColor(c.status), color: "white" }}>{c.status.toUpperCase()}</Badge></TableCell>
                <TableCell className="text-sm">
                  {c.mentorComment && <div style={{ color: "hsl(300 100% 25%)" }}><strong>Mentor:</strong> {c.mentorComment}</div>}
                  {c.wardenComment && <div className="text-primary"><strong>Warden:</strong> {c.wardenComment}</div>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Layout>
  );
};

export default StudentProfile;
