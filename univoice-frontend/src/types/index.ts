export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
  WARDEN = "warden",
  MENTOR = "mentor",
}

export enum ComplaintStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  FLAGGED = "flagged",
  REJECTED = "rejected",
}

export enum Category {
  ELECTRIC = "electric",
  TOILET = "toilet",
  WIFI = "wifi",
  MESS = "mess",
  PERSONAL = "personal",
  OTHERS = "others",
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  hostelId?: string;
  roomNumber?: string;
  mentorId?: string;
}

export interface Hostel {
  id: string;
  name: string;
  gender: "Boys" | "Girls";
  totalRooms: number;
}

export interface Complaint {
  id: string;
  heading: string;
  description: string;
  category: Category;
  createdAt: string;
  resolvedAt?: string;
  status: ComplaintStatus;
  isUrgent: boolean;
  isAbusive: boolean;
  mentorComment?: string;
  wardenComment?: string;
  userId: string;
  hostelId: string;
}
