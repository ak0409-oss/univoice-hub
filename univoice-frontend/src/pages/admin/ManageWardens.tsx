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

const ManageWardens = () => {
  const { users, hostels, addUser, deleteUser, getHostelById } = useData();
  const wardens = users.filter((u) => u.role === UserRole.WARDEN);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [hostelId, setHostelId] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ id: `w${Date.now()}`, email, name, password, role: UserRole.WARDEN, hostelId: hostelId || undefined });
    toast.success("Warden created");
    setEmail(""); setName(""); setPassword(""); setHostelId("");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Manage Wardens</h2>
        <Link to="/admin" className="text-sm text-muted-foreground hover:underline">← Back to Dashboard</Link>
      </div>
      <div className="flex gap-8">
        <div className="flex-[2]">
          <h3 className="font-semibold mb-3">Current Wardens</h3>
          {wardens.length === 0 ? <p className="text-muted-foreground">No wardens assigned.</p> : (
            <Table>
              <TableHeader><TableRow style={{ background: "hsl(30 100% 50%)" }}><TableHead className="text-white">Name</TableHead><TableHead className="text-white">Assigned Hostel</TableHead><TableHead className="text-white">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {wardens.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell><strong>{w.name}</strong><br /><small className="text-muted-foreground">{w.email}</small></TableCell>
                    <TableCell>{w.hostelId ? getHostelById(w.hostelId)?.name : "Unassigned"}</TableCell>
                    <TableCell className="space-x-2">
                      <Link to={`/admin/edit-user/${w.id}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete {w.name}?</AlertDialogTitle><AlertDialogDescription>This warden will be permanently removed.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { deleteUser(w.id); toast.success("Warden deleted"); }}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex-1 p-5 border-2 rounded-lg h-fit" style={{ borderColor: "hsl(30 100% 50%)", background: "hsl(45 100% 96%)" }}>
          <h3 className="font-semibold mb-3">Add New Warden</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Select value={hostelId} onValueChange={setHostelId}>
              <SelectTrigger><SelectValue placeholder="-- Select Hostel --" /></SelectTrigger>
              <SelectContent>{hostels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
            </Select>
            <Button type="submit" className="w-full" style={{ background: "hsl(30 100% 50%)" }}>Create Warden</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ManageWardens;
