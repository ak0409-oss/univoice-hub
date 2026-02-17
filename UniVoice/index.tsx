import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Plus, 
  LayoutDashboard, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Zap, 
  Wifi, 
  Utensils, 
  MoreVertical,
  Sparkles,
  ChevronRight,
  User,
  ShieldCheck,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---
type Role = 'Student' | 'Warden' | 'Teacher';
type Category = 'Plumbing' | 'Electrical' | 'Internet' | 'Mess' | 'Furniture' | 'Other';
type Priority = 'Low' | 'Medium' | 'High';
type Status = 'Pending' | 'In Progress' | 'Resolved';

interface UserProfile {
  id: string;
  name: string;
  role: Role;
  roomOrOffice: string;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  roomNumber: string;
  studentId: string;
  createdAt: string;
}

// --- Mock Data ---
const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: '1',
    title: 'Water leak in washroom',
    description: 'The tap in room 302 is constantly dripping and creating a mess.',
    category: 'Plumbing',
    priority: 'High',
    status: 'In Progress',
    roomNumber: '302',
    studentId: 'STU001',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Tube light flickering',
    description: 'The main light in the room is flickering since yesterday evening.',
    category: 'Electrical',
    priority: 'Medium',
    status: 'Pending',
    roomNumber: '105',
    studentId: 'STU002',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    title: 'Slow WiFi connection',
    description: 'Wifi speed is below 1Mbps in the B-block during peak hours.',
    category: 'Internet',
    priority: 'Low',
    status: 'Resolved',
    roomNumber: '412',
    studentId: 'STU001',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  }
];

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  Plumbing: <Wrench className="w-4 h-4" />,
  Electrical: <Zap className="w-4 h-4" />,
  Internet: <Wifi className="w-4 h-4" />,
  Mess: <Utensils className="w-4 h-4" />,
  Furniture: <AlertCircle className="w-4 h-4" />,
  Other: <MoreVertical className="w-4 h-4" />,
};

// --- Authentication Components ---

const LoginPage = ({ onLogin }: { onLogin: (role: Role) => void }) => {
  const roles: { type: Role; icon: React.ReactNode; desc: string; color: string }[] = [
    { 
      type: 'Student', 
      icon: <User size={28} />, 
      desc: 'Lodge complaints & track status', 
      color: 'bg-indigo-50 text-indigo-600' 
    },
    { 
      type: 'Warden', 
      icon: <ShieldCheck size={28} />, 
      desc: 'Manage hostel operations & resolve issues', 
      color: 'bg-emerald-50 text-emerald-600' 
    },
    { 
      type: 'Teacher', 
      icon: <GraduationCap size={28} />, 
      desc: 'Oversight & general welfare monitoring', 
      color: 'bg-amber-50 text-amber-600' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-900 p-12 text-white flex flex-col justify-center">
          <div className="bg-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <ClipboardList className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">HostelCare</h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            A unified portal for students, administration, and faculty to ensure a better hostel living experience.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-medium">Real-time tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium">AI-powered categorization</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <span className="text-sm font-medium">Direct Warden access</span>
            </div>
          </div>
        </div>
        
        <div className="p-10 md:p-14 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-10 text-sm">Please select your portal to continue</p>
          
          <div className="space-y-4">
            {roles.map((role) => (
              <button
                key={role.type}
                onClick={() => onLogin(role.type)}
                className="w-full flex items-center gap-5 p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group text-left"
              >
                <div className={`p-3 rounded-xl transition-colors ${role.color}`}>
                  {role.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{role.type} Portal</h3>
                  <p className="text-xs text-gray-400 font-medium">{role.desc}</p>
                </div>
                <ArrowRight className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={20} />
              </button>
            ))}
          </div>
          
          <div className="mt-10 pt-10 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400">Secure SSO Login • System v2.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard Components ---

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }: { 
  user: UserProfile, 
  activeTab: string, 
  setActiveTab: (t: string) => void,
  onLogout: () => void
}) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { 
      id: 'complaints', 
      icon: <ClipboardList size={20} />, 
      label: user.role === 'Student' ? 'My Complaints' : 'All Complaints' 
    },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white min-h-screen p-6 hidden md:flex flex-col">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">HostelCare</h1>
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
              ? 'bg-indigo-800 text-white shadow-lg shadow-indigo-950/20' 
              : 'text-indigo-300 hover:bg-indigo-800/50 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-indigo-800">
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3 text-indigo-300 hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const Header = ({ title, user }: { title: string, user: UserProfile }) => (
  <header className="flex items-center justify-between mb-8 px-2 md:px-0">
    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-sm font-semibold text-gray-900">{user.name}</span>
        <span className="text-xs text-gray-500">{user.role} • {user.roomOrOffice}</span>
      </div>
      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
        user.role === 'Student' ? 'bg-indigo-100 border-indigo-500 text-indigo-600' :
        user.role === 'Warden' ? 'bg-emerald-100 border-emerald-500 text-emerald-600' :
        'bg-amber-100 border-amber-500 text-amber-600'
      }`}>
        {user.name.split(' ').map(n => n[0]).join('')}
      </div>
    </div>
  </header>
);

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ComplaintForm = ({ onAdd, onCancel }: { onAdd: (c: Partial<Complaint>) => void, onCancel: () => void }) => {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const analyzeComplaint = async () => {
    if (description.length < 10) return;
    
    setIsAiAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this hostel complaint and suggest a category and priority level. Complaint: "${description}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { 
                type: Type.STRING, 
                enum: ['Plumbing', 'Electrical', 'Internet', 'Mess', 'Furniture', 'Other'] 
              },
              priority: { 
                type: Type.STRING, 
                enum: ['Low', 'Medium', 'High'] 
              },
              suggestedTitle: { type: Type.STRING }
            },
            required: ['category', 'priority', 'suggestedTitle']
          }
        }
      });

      const result = JSON.parse(response.text);
      setCategory(result.category);
      setPriority(result.priority);
      if (!title) setTitle(result.suggestedTitle);
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title: title || 'Untitled Complaint',
      description,
      category,
      priority,
      status: 'Pending',
      roomNumber: '302', // Simulated
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
          <h3 className="text-xl font-bold">Lodge a New Complaint</h3>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Plus className="rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Problem Description</label>
            <textarea
              required
              rows={4}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={analyzeComplaint}
            />
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
              <Sparkles size={12} className="text-indigo-500" /> 
              Gemini AI will analyze your description to help categorize it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Internet">Internet</option>
                <option value="Mess">Mess</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Subject/Title</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Broken Fan in Room 302"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAiAnalyzing}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Analyzing...
                </>
              ) : (
                <>Submit Complaint</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ user, complaints, onOpenNew, onUpdateStatus }: { 
  user: UserProfile, 
  complaints: Complaint[], 
  onOpenNew: () => void,
  onUpdateStatus: (id: string, s: Status) => void
}) => {
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label={user.role === 'Student' ? "My Total Lodged" : "Total Hostel Issues"} 
          value={stats.total} 
          icon={<ClipboardList className="text-indigo-600" />} 
          color="bg-indigo-50" 
        />
        <StatCard 
          label="Awaiting Action" 
          value={stats.pending} 
          icon={<Clock className="text-amber-600" />} 
          color="bg-amber-50" 
        />
        <StatCard 
          label="Resolved Cases" 
          value={stats.resolved} 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          color="bg-emerald-50" 
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {user.role === 'Student' ? 'Your Recent Complaints' : 'Live Complaint Stream'}
          </h3>
          <p className="text-sm text-gray-500">
            {user.role === 'Student' ? 'Manage and track your issues' : 'Overview of all active hostel issues'}
          </p>
        </div>
        {user.role === 'Student' && (
          <button 
            onClick={onOpenNew}
            className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            New Complaint
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {complaints.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No complaints found. Systems clear.</p>
          </div>
        ) : (
          complaints.slice(0, 4).map((complaint) => (
            <div key={complaint.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                    {CATEGORY_ICONS[complaint.category]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{complaint.title}</h4>
                    <p className="text-xs text-gray-400">
                      #{complaint.id} • Room {complaint.roomNumber} • {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                  complaint.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {complaint.status}
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                {complaint.description}
              </p>
              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  complaint.priority === 'High' ? 'text-red-600 bg-red-50' :
                  complaint.priority === 'Medium' ? 'text-orange-600 bg-orange-50' :
                  'text-blue-600 bg-blue-50'
                }`}>
                  {complaint.priority} Priority
                </span>
                {user.role === 'Warden' && complaint.status !== 'Resolved' && (
                  <div className="flex gap-2">
                    {complaint.status === 'Pending' && (
                      <button 
                        onClick={() => onUpdateStatus(complaint.id, 'In Progress')}
                        className="text-indigo-600 text-xs font-bold bg-indigo-50 px-3 py-1 rounded hover:bg-indigo-100"
                      >
                        Accept
                      </button>
                    )}
                    <button 
                      onClick={() => onUpdateStatus(complaint.id, 'Resolved')}
                      className="text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded hover:bg-emerald-100"
                    >
                      Resolve
                    </button>
                  </div>
                )}
                {(user.role === 'Student' || user.role === 'Teacher') && (
                  <button className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
                    View Full Details <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-amber-400" /> Administrative Insight
            </h4>
            <p className="text-indigo-200 max-w-md">
              {user.role === 'Student' 
                ? "Our AI analyzes response times to ensure your complaints are handled promptly by the Warden team."
                : "Analyze trends across the hostel blocks to identify recurring maintenance issues before they become critical."}
            </p>
          </div>
          <button className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-black/20 hover:bg-indigo-50 transition-colors whitespace-nowrap">
            {user.role === 'Student' ? 'Ask AI Assistant' : 'View Analytics Report'}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-300/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter complaints based on role
  const filteredComplaints = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'Student') {
      return complaints.filter(c => c.studentId === currentUser.id);
    }
    return complaints; // Warden and Teacher see everything
  }, [complaints, currentUser]);

  const handleLogin = (role: Role) => {
    // Mock user profiles
    const profiles: Record<Role, UserProfile> = {
      Student: { id: 'STU001', name: 'John Doe', role: 'Student', roomOrOffice: 'Room 302 • B-Block' },
      Warden: { id: 'WAR001', name: 'Mr. Richard Smith', role: 'Warden', roomOrOffice: 'Admin Office • Ground Floor' },
      Teacher: { id: 'TEA001', name: 'Dr. Sarah Connor', role: 'Teacher', roomOrOffice: 'Faculty Wing • Room 12' },
    };
    setCurrentUser(profiles[role]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const addComplaint = (newComplaint: Partial<Complaint>) => {
    if (!currentUser) return;
    const complaint: Complaint = {
      ...newComplaint as Complaint,
      id: (complaints.length + 1).toString(),
      studentId: currentUser.id,
      roomNumber: currentUser.roomOrOffice.split(' • ')[0].replace('Room ', ''),
    };
    setComplaints([complaint, ...complaints]);
    setIsFormOpen(false);
  };

  const updateComplaintStatus = (id: string, newStatus: Status) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        user={currentUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <>
            <Header 
              title={currentUser.role === 'Student' ? `Welcome back, ${currentUser.name.split(' ')[0]}!` : `${currentUser.role} Control Panel`} 
              user={currentUser} 
            />
            <Dashboard 
              user={currentUser}
              complaints={filteredComplaints} 
              onOpenNew={() => setIsFormOpen(true)} 
              onUpdateStatus={updateComplaintStatus}
            />
          </>
        )}

        {activeTab === 'complaints' && (
          <>
            <Header title={currentUser.role === 'Student' ? "My Complaint Log" : "Hostel Complaint Records"} user={currentUser} />
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search by room, category or title..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50">
                    <Filter size={18} /> Filter
                  </button>
                  {currentUser.role === 'Student' && (
                    <button 
                      onClick={() => setIsFormOpen(true)}
                      className="flex-1 sm:flex-none bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> New
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Complaint</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{c.title}</p>
                          <p className="text-xs text-gray-400">Room {c.roomNumber} • ID: {c.studentId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="p-1 bg-gray-50 rounded">
                              {CATEGORY_ICONS[c.category]}
                            </div>
                            {c.category}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                            c.priority === 'High' ? 'text-red-700 bg-red-100' :
                            c.priority === 'Medium' ? 'text-orange-700 bg-orange-100' :
                            'text-blue-700 bg-blue-100'
                          }`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${
                            c.status === 'Resolved' ? 'text-emerald-600' :
                            c.status === 'In Progress' ? 'text-indigo-600' :
                            'text-amber-600'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              c.status === 'Resolved' ? 'bg-emerald-600' :
                              c.status === 'In Progress' ? 'bg-indigo-600' :
                              'bg-amber-600'
                            }`}></div>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {currentUser.role === 'Warden' && c.status !== 'Resolved' ? (
                              <>
                                <button 
                                  onClick={() => updateComplaintStatus(c.id, 'In Progress')}
                                  title="Mark In Progress"
                                  className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  <Clock size={16} />
                                </button>
                                <button 
                                  onClick={() => updateComplaintStatus(c.id, 'Resolved')}
                                  title="Mark Resolved"
                                  className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              </>
                            ) : (
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                                <MoreVertical size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            <Header title="Preferences" user={currentUser} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h4 className="text-xl font-bold mb-6">User Profile</h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ${
                      currentUser.role === 'Student' ? 'bg-indigo-600' :
                      currentUser.role === 'Warden' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
                        Change Photo
                      </button>
                      <p className="text-xs text-gray-400 mt-2">Update your avatar for better identification.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                      <input disabled value={currentUser.name} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">System ID</label>
                      <input disabled value={currentUser.id} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Portal Role</label>
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold flex items-center gap-2">
                      <ShieldCheck size={16} /> {currentUser.role} Account
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h4 className="text-lg font-bold mb-4">Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">App alerts</span>
                      <div className="w-10 h-6 bg-indigo-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Email digest</span>
                      <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100 shadow-sm">
                  <h4 className="text-lg font-bold text-rose-800 mb-2">Emergency?</h4>
                  <p className="text-xs text-rose-600 mb-4">For medical or security emergencies, contact the main gate directly.</p>
                  <button className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700">
                    Call Gate Security
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {isFormOpen && (
        <ComplaintForm 
          onAdd={addComplaint} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-xl ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setActiveTab('complaints')} className={`p-3 rounded-xl ${activeTab === 'complaints' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}>
          <ClipboardList size={24} />
        </button>
        {currentUser.role === 'Student' && (
          <button onClick={() => setIsFormOpen(true)} className="p-4 rounded-full bg-indigo-600 text-white -mt-10 shadow-lg shadow-indigo-200">
            <Plus size={24} />
          </button>
        )}
        <button onClick={() => setActiveTab('settings')} className={`p-3 rounded-xl ${activeTab === 'settings' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}>
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);