import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { ComplaintStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "hsl(30 100% 50%)",
  in_progress: "hsl(220 100% 50%)",
  resolved: "hsl(120 60% 40%)",
  rejected: "hsl(0 84% 60%)",
  flagged: "hsl(0 0% 50%)",
};

const tabs: { status: ComplaintStatus; label: string }[] = [
  { status: ComplaintStatus.PENDING, label: "Pending" },
  { status: ComplaintStatus.IN_PROGRESS, label: "In Progress" },
  { status: ComplaintStatus.RESOLVED, label: "Resolved" },
  { status: ComplaintStatus.REJECTED, label: "Rejected" },
  { status: ComplaintStatus.FLAGGED, label: "Flagged" },
];

const AdminComplaints = () => {
  const { complaints, hostels, deleteComplaint, getUserById } = useData();
  const [selectedHostel, setSelectedHostel] = useState("");
  const [currentStatus, setCurrentStatus] = useState<ComplaintStatus>(ComplaintStatus.PENDING);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = complaints.filter((c) => (!selectedHostel || c.hostelId === selectedHostel) && c.status === currentStatus);
  const counts = (s: ComplaintStatus) => complaints.filter((c) => (!selectedHostel || c.hostelId === selectedHostel) && c.status === s).length;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Complaint Database Manager</h2>
        <Link to="/admin" className="text-sm text-muted-foreground hover:underline">← Back to Dashboard</Link>
      </div>
      <div className="bg-accent p-4 rounded mb-5">
        <label className="font-bold mr-3">Select Hostel:</label>
        <select className="p-1 border rounded" value={selectedHostel} onChange={(e) => setSelectedHostel(e.target.value)}>
          <option value="">-- All Hostels --</option>
          {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>
      <div className="flex border-b mb-5">
        {tabs.map((t) => (
          <button key={t.status} onClick={() => setCurrentStatus(t.status)} className="px-5 py-2 font-bold text-sm" style={{ borderBottom: `3px solid ${currentStatus === t.status ? statusColors[t.status] : "transparent"}` }}>
            {t.label} ({counts(t.status)})
          </button>
        ))}
      </div>
      {filtered.length === 0 ? <p className="text-muted-foreground p-5">No complaints found in this category.</p> : (
        <Table>
          <TableHeader><TableRow className="bg-foreground"><TableHead className="text-background">Date</TableHead><TableHead className="text-background">Student</TableHead><TableHead className="text-background">Category</TableHead><TableHead className="text-background">Issue</TableHead><TableHead className="text-background">Delete</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((c) => {
              const author = getUserById(c.userId);
              return (
                <TableRow key={c.id}>
                  <TableCell>{c.createdAt}</TableCell>
                  <TableCell>{author?.name}<br /><small className="text-muted-foreground">Room {author?.roomNumber || "N/A"}</small></TableCell>
                  <TableCell><Badge variant="secondary">{c.category.toUpperCase()}</Badge></TableCell>
                  <TableCell>
                    <button className="text-left font-bold text-primary cursor-pointer bg-transparent border-none" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>{c.heading}</button>
                    {expanded === c.id && (
                      <div className="mt-2 p-3 bg-accent border rounded text-sm">
                        <p>{c.description}</p>
                        {c.wardenComment && <><hr className="my-2" /><p className="text-primary"><strong>Warden:</strong> {c.wardenComment}</p></>}
                        {c.mentorComment && <p style={{ color: "hsl(300 100% 25%)" }}><strong>Mentor:</strong> {c.mentorComment}</p>}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive font-bold">✕</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete this complaint?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { deleteComplaint(c.id); toast.success("Complaint deleted"); }}>Delete</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default AdminComplaints;
