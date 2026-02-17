import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ManageMentors = () => {
  const { users, addUser, deleteUser } = useData();
  const mentors = users.filter((u) => u.role === UserRole.MENTOR);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ id: `m${Date.now()}`, email, name, password, role: UserRole.MENTOR });
    toast.success("Mentor created");
    setEmail(""); setName(""); setPassword("");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Manage Mentors</h2>
        <Link to="/admin" className="text-sm text-muted-foreground hover:underline">← Back to Dashboard</Link>
      </div>
      <div className="flex gap-8">
        <div className="flex-[2]">
          <h3 className="font-semibold mb-3">Current Mentors</h3>
          {mentors.length === 0 ? <p className="text-muted-foreground">No mentors created yet.</p> : (
            <Table>
              <TableHeader><TableRow style={{ background: "hsl(300 100% 25%)" }}><TableHead className="text-white">Name</TableHead><TableHead className="text-white">Email</TableHead><TableHead className="text-white">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {mentors.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-bold">{m.name}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell className="space-x-2">
                      <Link to={`/admin/edit-user/${m.id}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete {m.name}?</AlertDialogTitle><AlertDialogDescription>This mentor will be permanently removed.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { deleteUser(m.id); toast.success("Mentor deleted"); }}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex-1 p-5 border-2 rounded-lg h-fit" style={{ borderColor: "hsl(300 100% 25%)", background: "hsl(300 60% 96%)" }}>
          <h3 className="font-semibold mb-3">Add New Mentor</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full" style={{ background: "hsl(300 100% 25%)" }}>Create Mentor</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ManageMentors;
