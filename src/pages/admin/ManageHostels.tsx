import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ManageHostels = () => {
  const { hostels, addHostel, deleteHostel } = useData();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"Boys" | "Girls">("Boys");
  const [rooms, setRooms] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addHostel({ id: `h${Date.now()}`, name, gender, totalRooms: parseInt(rooms) || 50 });
    toast.success("Hostel created");
    setName(""); setRooms("");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Manage Hostels</h2>
        <Link to="/admin" className="text-sm text-muted-foreground hover:underline">← Back to Dashboard</Link>
      </div>
      <div className="flex gap-8">
        <div className="flex-[2]">
          <h3 className="font-semibold mb-3">Existing Hostels</h3>
          {hostels.length === 0 ? <p className="text-muted-foreground">No hostels created yet.</p> : (
            <Table>
              <TableHeader><TableRow className="bg-foreground text-background"><TableHead className="text-background">Hostel Name</TableHead><TableHead className="text-background">Type</TableHead><TableHead className="text-background">Capacity</TableHead><TableHead className="text-background">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {hostels.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="font-bold">{h.name}</TableCell>
                    <TableCell>{h.gender}</TableCell>
                    <TableCell>{h.totalRooms} Rooms</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete {h.name}?</AlertDialogTitle><AlertDialogDescription>This will unassign all students from this hostel.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { deleteHostel(h.id); toast.success("Hostel deleted"); }}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex-1 p-5 border-2 rounded-lg bg-secondary h-fit">
          <h3 className="font-semibold mb-3">Add New Hostel</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <Input placeholder="Hostel Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Select value={gender} onValueChange={(v) => setGender(v as "Boys" | "Girls")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Boys">Boys Hostel</SelectItem><SelectItem value="Girls">Girls Hostel</SelectItem></SelectContent>
            </Select>
            <Input type="number" placeholder="Total Rooms" value={rooms} onChange={(e) => setRooms(e.target.value)} required />
            <Button type="submit" className="w-full">Create Hostel</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ManageHostels;
