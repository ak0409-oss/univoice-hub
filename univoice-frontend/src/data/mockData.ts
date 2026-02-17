import { User, Hostel, Complaint, UserRole, ComplaintStatus, Category } from "@/types";

export const BAD_WORDS = ["stupid", "idiot", "useless", "trash", "hell", "damn", "rubbish", "fucked", "lazy"];

export const initialHostels: Hostel[] = [
  { id: "h1", name: "Kings Palace-1", gender: "Boys", totalRooms: 50 },
  { id: "h2", name: "Queens Castle-2", gender: "Girls", totalRooms: 50 },
  { id: "h3", name: "Royal Residency-3", gender: "Boys", totalRooms: 50 },
  { id: "h4", name: "Grand Heights-4", gender: "Girls", totalRooms: 50 },
];

export const initialUsers: User[] = [
  // Admin
  { id: "u0", email: "admin@kiit.ac.in", name: "Super Admin", password: "12345", role: UserRole.ADMIN },

  // Wardens
  { id: "w1", email: "warden@kiit.ac.in", name: "Warden", password: "12345", role: UserRole.WARDEN, hostelId: "h1" },
  { id: "w2", email: "warden2@gmail.com", name: "Warden Name 2", password: "12345", role: UserRole.WARDEN, hostelId: "h2" },
  { id: "w3", email: "warden3@gmail.com", name: "Warden Name 3", password: "12345", role: UserRole.WARDEN, hostelId: "h3" },
  { id: "w4", email: "warden4@gmail.com", name: "Warden Name 4", password: "12345", role: UserRole.WARDEN, hostelId: "h4" },
  { id: "w5", email: "warden5@gmail.com", name: "Warden Name 5", password: "12345", role: UserRole.WARDEN },

  // Mentors
  { id: "m1", email: "mentor@kiit.ac.in", name: "Mentor", password: "12345", role: UserRole.MENTOR },
  { id: "m2", email: "mentor2@gmail.com", name: "Mentor Name 2", password: "12345", role: UserRole.MENTOR },
  { id: "m3", email: "mentor3@gmail.com", name: "Mentor Name 3", password: "12345", role: UserRole.MENTOR },
  { id: "m4", email: "mentor4@gmail.com", name: "Mentor Name 4", password: "12345", role: UserRole.MENTOR },
  { id: "m5", email: "mentor5@gmail.com", name: "Mentor Name 5", password: "12345", role: UserRole.MENTOR },

  // Students
  { id: "s0", email: "student@kiit.ac.in", name: "Student", password: "12345", role: UserRole.STUDENT, hostelId: "h1", mentorId: "m1", roomNumber: "101" },
  ...Array.from({ length: 20 }, (_, i) => {
    const names = [
      "Aarav Sharma", "Vivaan Gupta", "Aditya Patel", "Vihaan Singh", "Arjun Verma",
      "Saanvi Iyer", "Inaya Reddy", "Aarya Joshi", "Zara Khan", "Ananya Das",
      "Ishaan Malhotra", "Sai Kumar", "Krishna Murthy", "Rohan Mehra", "Aryan Bansal",
      "Pari Choudhury", "Kyra Nair", "Diya Mistri", "Anvi Saxena", "Myra Kapoor",
    ];
    const hostelIds = ["h1", "h2", "h3", "h4"];
    const mentorIds = ["m1", "m2", "m3", "m4", "m5"];
    const isAssigned = i < 16; // 80% assigned
    return {
      id: `s${i + 1}`,
      email: `student${i + 1}@gmail.com`,
      name: names[i],
      password: "12345",
      role: UserRole.STUDENT,
      hostelId: isAssigned ? hostelIds[i % 4] : undefined,
      mentorId: isAssigned ? mentorIds[i % 5] : undefined,
      roomNumber: isAssigned ? `${101 + i * 7}` : undefined,
    } as User;
  }),
];

export const initialComplaints: Complaint[] = [
  { id: "c1", heading: "Fan not working", description: "Ceiling fan in room is completely broken and makes noise.", category: Category.ELECTRIC, createdAt: "2025-01-15", status: ComplaintStatus.PENDING, isUrgent: false, isAbusive: false, userId: "s1", hostelId: "h1" },
  { id: "c2", heading: "WiFi very slow", description: "Internet speed drops to 0 after 10pm every night.", category: Category.WIFI, createdAt: "2025-01-16", status: ComplaintStatus.IN_PROGRESS, isUrgent: false, isAbusive: false, wardenComment: "Checking with ISP", userId: "s2", hostelId: "h2" },
  { id: "c3", heading: "Toilet leak", description: "Water leaking from the flush tank continuously.", category: Category.TOILET, createdAt: "2025-01-17", status: ComplaintStatus.RESOLVED, isUrgent: false, isAbusive: false, wardenComment: "Plumber fixed it", resolvedAt: "2025-01-19", userId: "s3", hostelId: "h3" },
  { id: "c4", heading: "Mess food quality", description: "Food served is cold and stale regularly.", category: Category.MESS, createdAt: "2025-01-18", status: ComplaintStatus.PENDING, isUrgent: true, isAbusive: false, mentorComment: "This needs urgent attention", userId: "s4", hostelId: "h4" },
  { id: "c5", heading: "This is stupid management", description: "You idiots don't fix anything around here.", category: Category.OTHERS, createdAt: "2025-01-20", status: ComplaintStatus.FLAGGED, isUrgent: false, isAbusive: true, userId: "s5", hostelId: "h1" },
  { id: "c6", heading: "Light not working", description: "Tubelight in corridor has been off for a week.", category: Category.ELECTRIC, createdAt: "2025-01-22", status: ComplaintStatus.REJECTED, isUrgent: false, isAbusive: false, wardenComment: "Not hostel responsibility", userId: "s6", hostelId: "h2" },
  { id: "c7", heading: "Personal belongings stolen", description: "My laptop charger was taken from common room.", category: Category.PERSONAL, createdAt: "2025-02-01", status: ComplaintStatus.PENDING, isUrgent: true, isAbusive: false, mentorComment: "Please escalate immediately", userId: "s1", hostelId: "h1" },
  { id: "c8", heading: "Water heater broken", description: "No hot water in bathrooms for 3 days.", category: Category.OTHERS, createdAt: "2025-02-05", status: ComplaintStatus.IN_PROGRESS, isUrgent: false, isAbusive: false, userId: "s9", hostelId: "h1" },
];
