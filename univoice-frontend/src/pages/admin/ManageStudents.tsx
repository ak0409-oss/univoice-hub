import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ManageStudents = () => {
  const { users, hostels, addUser, deleteUser, getHostelById, getUserById } = useData();
  const mentors = users.filter((u) => u.role === UserRole.MENTOR);
  const [selectedHostel, setSelectedHostel] = useState("");
  const students = users.filter((u) => u.role === UserRole.STUDENT && (!selectedHostel || u.hostelId === selectedHostel));

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [room, setRoom] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [mentorId, setMentorId] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ id: `s${Date.now()}`, email, name, password, role: UserRole.STUDENT, hostelId: hostelId || undefined, mentorId: mentorId || undefined, roomNumber: room || undefined });
    toast.success("Student created");
    setEmail(""); setName(""); setPassword(""); setRoom(""); setHostelId(""); setMentorId("");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">Manage Students</h2>
        <Link to="/admin" className="text-sm text-muted-foreground hover:underline">← Back</Link>
      </div>
      <div className="bg-accent p-4 rounded mb-5">
        <label className="font-bold mr-3">Select Hostel to View Students:</label>
        <select className="p-1 border rounded" value={selectedHostel} onChange={(e) => setSelectedHostel(e.target.value)}>
          <option value="">-- All Hostels --</option>
          {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>
      <div className="flex gap-5">
        <div className="flex-[2]">
          {students.length === 0 ? <p className="text-muted-foreground">No students found.</p> : (
            <Table>
              <TableHeader><TableRow className="bg-foreground"><TableHead className="text-background">Room</TableHead><TableHead className="text-background">Name</TableHead><TableHead className="text-background">Mentor</TableHead><TableHead className="text-background">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.roomNumber || "N/A"}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.mentorId ? getUserById(s.mentorId)?.name : "-"}</TableCell>
                    <TableCell className="space-x-2">
                      <Link to={`/admin/student/${s.id}`}><Button variant="outline" size="sm">View</Button></Link>
                      <Link to={`/admin/edit-user/${s.id}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete {s.name}?</AlertDialogTitle><AlertDialogDescription>This student will be permanently removed.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { deleteUser(s.id); toast.success("Student deleted"); }}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex-1 border p-4 rounded-lg bg-secondary h-fit">
          <h4 className="font-semibold mb-3">Add New Student</h4>
          <form onSubmit={handleCreate} className="space-y-2">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input placeholder="Room Number" value={room} onChange={(e) => setRoom(e.target.value)} />
            <Select value={hostelId} onValueChange={setHostelId}>
              <SelectTrigger><SelectValue placeholder="Select Hostel" /></SelectTrigger>
              <SelectContent>{hostels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={mentorId} onValueChange={setMentorId}>
              <SelectTrigger><SelectValue placeholder="-- Assign Mentor --" /></SelectTrigger>
              <SelectContent>{mentors.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
            </Select>
            <Button type="submit" className="w-full">Create Student</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ManageStudents;
