
# UniVoice - React Frontend Build Plan

## Overview
Rebuild the UniVoice hostel complaint management system as a fully functional React SPA, translating all Flask templates into modern React pages with Tailwind CSS styling. Authentication will use hardcoded credentials for now, and all data will be managed via React state (in-memory mock data mirroring the seed data).

---

## Architecture

### Auth System
- Hardcoded login: `12345@kiit.ac.in` / `123456` logs in as Admin
- Additional demo accounts auto-seeded in mock data (student, warden, mentor) -- any of them can log in with password `12345`
- Auth context (`AuthContext`) stores current user and provides `login`/`logout`/`signOut` functions
- Protected routes redirect to `/login` if not authenticated
- Role-based redirects after login (Admin -> `/admin`, Student -> `/student`, etc.)

### Data Layer
- A `mockData.ts` file containing pre-seeded data matching `testseed.py`: 4 hostels, 5 wardens, 5 mentors, 20 students, and sample complaints
- A `DataContext` providing CRUD operations on this in-memory data (add/edit/delete users, hostels, complaints)
- "Delete" and "Sign Out" functionality (the two missing features you mentioned) will be fully implemented

### Routing Structure
```text
/login              - Login page
/admin              - Admin dashboard hub
/admin/hostels      - Manage hostels (list + create)
/admin/wardens      - Manage wardens (list + create + delete)
/admin/mentors      - Manage mentors (list + create + delete)
/admin/students     - Manage students (list + create + delete, filtered by hostel)
/admin/complaints   - Complaint database manager (filter by hostel + status)
/admin/edit-user/:id - Edit user form
/admin/student/:id  - Student deep profile
/student            - Student dashboard (file complaint + view my complaints)
/warden             - Warden dashboard (sectioned complaint tables with actions)
/mentor             - Mentor dashboard (mentee complaints with urgent flag + comments)
```

---

## Files to Create

### Core Infrastructure
1. **`src/contexts/AuthContext.tsx`** - Auth provider with hardcoded credentials, login/logout/signOut, role-based access
2. **`src/contexts/DataContext.tsx`** - In-memory data store with CRUD operations for all entities
3. **`src/data/mockData.ts`** - Seed data: users, hostels, rooms, complaints (mirrors testseed.py)
4. **`src/types/index.ts`** - TypeScript types for User, Hostel, Room, Complaint, enums (UserRole, ComplaintStatus, Category)

### Layout
5. **`src/components/Layout.tsx`** - App shell with top nav bar showing user name, role, and **Sign Out** button; wraps all authenticated pages

### Pages
6. **`src/pages/Login.tsx`** - Login form (email + password) with Google button (disabled/placeholder), styled with card layout
7. **`src/pages/admin/AdminDashboard.tsx`** - Hub with 5 icon cards linking to management sections
8. **`src/pages/admin/ManageHostels.tsx`** - Hostel list table + "Add New Hostel" form sidebar + **Delete** button per hostel
9. **`src/pages/admin/ManageWardens.tsx`** - Warden list + create form + **Delete** button per warden
10. **`src/pages/admin/ManageMentors.tsx`** - Mentor list + create form + **Delete** button per mentor
11. **`src/pages/admin/ManageStudents.tsx`** - Hostel filter dropdown, student table, create form + **Delete** button per student
12. **`src/pages/admin/AdminComplaints.tsx`** - Hostel filter + status tabs (Pending/In Progress/Resolved/Rejected/Flagged) + complaint table with expandable details + **Delete** button
13. **`src/pages/admin/EditUser.tsx`** - Edit form for name, email, hostel, mentor assignment
14. **`src/pages/admin/StudentProfile.tsx`** - Student info card + flagged complaints section + full complaint history table
15. **`src/pages/StudentDashboard.tsx`** - Split layout: file complaint form (category, heading, description) + "My Complaints" list with status colors
16. **`src/pages/WardenDashboard.tsx`** - 5 sections (Urgent/Pending/In Progress/Completed/Archived) each with complaint tables and action buttons (Resolve/Reject/In Progress) + warden comment
17. **`src/pages/MentorDashboard.tsx`** - Mentee complaints table with urgent checkbox, mentor comment textarea, update button

### Files to Modify
18. **`src/App.tsx`** - Add all routes wrapped in AuthContext and DataContext providers
19. **`src/pages/Index.tsx`** - Redirect to `/login`

---

## Key Features: Delete and Sign Out

### Delete Buttons (the missing backend feature)
- Every management table (hostels, wardens, mentors, students) gets a red "Delete" button per row
- Confirmation dialog before deletion (using AlertDialog component)
- Admin complaints page already has delete -- will be preserved
- Deleting a hostel cascades: removes associated students' hostel assignment
- Deleting a user removes them from the data store

### Sign Out Button
- Persistent in the top navigation bar (Layout component)
- Clears auth state and redirects to `/login`
- Styled as a red/outline button in the nav bar

---

## Design Approach
- Clean, modern UI using existing shadcn/ui components (Card, Table, Button, Input, Select, Badge, Tabs, Dialog, etc.)
- Color-coded role cards on Admin dashboard matching the Flask templates (dark for hostels, orange for wardens, purple for mentors, blue for students, red for complaints)
- Status badges with semantic colors: orange=pending, blue=in_progress, green=resolved, red=rejected, gray=flagged
- Responsive layout with Tailwind CSS
- Toast notifications (sonner) for success/error feedback on all actions

---

## Technical Details

### Types (`src/types/index.ts`)
```text
enum UserRole: ADMIN, STUDENT, WARDEN, MENTOR
enum ComplaintStatus: PENDING, IN_PROGRESS, RESOLVED, FLAGGED, REJECTED
enum Category: ELECTRIC, TOILET, WIFI, MESS, PERSONAL, OTHERS

interface User { id, email, name, password, role, hostelId?, roomNumber?, mentorId? }
interface Hostel { id, name, gender, totalRooms }
interface Complaint { id, heading, description, category, createdAt, resolvedAt?, status, isUrgent, isAbusive, mentorComment?, wardenComment?, userId, hostelId }
```

### Auth Flow
1. User visits `/` -> redirected to `/login`
2. Enters `12345@kiit.ac.in` / `123456` (or any seeded user email with password `12345`)
3. AuthContext validates against mock users, sets currentUser
4. Redirects based on role
5. Sign Out clears state, returns to `/login`

### Bad Words Filter
- Simple client-side check against a small word list (from `bad_words.txt`) when students file complaints
- Flagged complaints get `ComplaintStatus.FLAGGED` and `isAbusive = true`
