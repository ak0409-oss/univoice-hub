import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const cards = [
  { to: "/admin/hostels", emoji: "🏢", label: "Manage Hostels", border: "hsl(var(--foreground))", bg: "hsl(var(--secondary))" },
  { to: "/admin/wardens", emoji: "👮‍♂️", label: "Manage Wardens", border: "hsl(30 100% 50%)", bg: "hsl(45 100% 96%)" },
  { to: "/admin/mentors", emoji: "🎓", label: "Manage Mentors", border: "hsl(300 100% 25%)", bg: "hsl(300 60% 96%)" },
  { to: "/admin/students", emoji: "👨‍🎓", label: "Manage Students", border: "hsl(220 100% 50%)", bg: "hsl(210 100% 97%)" },
  { to: "/admin/complaints", emoji: "🚨", label: "All Complaints", border: "hsl(var(--destructive))", bg: "hsl(0 100% 97%)" },
];

const AdminDashboard = () => (
  <Layout>
    <h2 className="text-center text-2xl font-bold mb-8">Admin Control Center</h2>
    <div className="flex flex-wrap gap-5 justify-center">
      {cards.map((c) => (
        <Link key={c.to} to={c.to} className="no-underline text-inherit">
          <div
            className="w-52 p-8 text-center rounded-xl transition-transform hover:scale-105 border-2"
            style={{ borderColor: c.border, background: c.bg }}
          >
            <span className="text-5xl">{c.emoji}</span>
            <h3 className="mt-3 font-semibold">{c.label}</h3>
          </div>
        </Link>
      ))}
    </div>
  </Layout>
);

export default AdminDashboard;
