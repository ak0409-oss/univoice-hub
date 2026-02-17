import random
from app import create_app, db
from app.models import User, UserRole, Hostel, Room, Complaint

app = create_app()

def seed_test_data():
    with app.app_context():
        # 1. Clear existing data and create tables
        print("--- Resetting Database ---")
        db.drop_all()
        db.create_all()

        # 2. Create Super Admin
        admin = User(email='admin@kiit.ac.in', name='Super Admin', role=UserRole.ADMIN)
        admin.set_password('12345')
        db.session.add(admin)

        # 3. Create 4 Hostels
        hostels = []
        hostel_names = ["Kings Palace", "Queens Castle", "Royal Residency", "Grand Heights"]
        for i in range(4):
            gender = 'Boys' if i % 2 == 0 else 'Girls'
            h = Hostel(name=f"{hostel_names[i]}-{i+1}", gender=gender, total_rooms=50)
            db.session.add(h)
            hostels.append(h)
        
        db.session.commit()
        # Trigger room generation defined in your model
        for h in hostels:
            h.generate_rooms()

        # 4. Create 5 Wardens
        wardens = []
        for i in range(1, 6):
            # Assign first 4 wardens to the 4 hostels, leave the 5th unassigned
            h_id = hostels[i-1].id if i <= 4 else None
            w = User(
                email=f"warden{i}@gmail.com",
                name=f"Warden Name {i}",
                role=UserRole.WARDEN,
                hostel_id=h_id
            )
            w.set_password('12345')
            db.session.add(w)
            wardens.append(w)

        # 5. Create 5 Mentors
        mentors = []
        for i in range(1, 6):
            m = User(
                email=f"mentor{i}@gmail.com",
                name=f"Mentor Name {i}",
                role=UserRole.MENTOR
            )
            m.set_password('12345')
            db.session.add(m)
            mentors.append(m)

        db.session.commit()

        # 6. Create 20 Students
        indian_names = [
            "Aarav Sharma", "Vivaan Gupta", "Aditya Patel", "Vihaan Singh", "Arjun Verma",
            "Saanvi Iyer", "Inaya Reddy", "Aarya Joshi", "Zara Khan", "Ananya Das",
            "Ishaan Malhotra", "Sai Kumar", "Krishna Murthy", "Rohan Mehra", "Aryan Bansal",
            "Pari Choudhury", "Kyra Nair", "Diya Mistri", "Anvi Saxena", "Myra Kapoor"
        ]

        for i in range(20):
            # Randomly decide if student is assigned to a hostel/mentor (approx 80% assigned)
            is_assigned = random.random() > 0.2
            h_id = random.choice(hostels).id if is_assigned else None
            m_id = random.choice(mentors).id if is_assigned else None
            r_num = f"{random.randint(101, 550)}" if h_id else None

            s = User(
                email=f"student{i+1}@gmail.com",
                name=indian_names[i],
                role=UserRole.STUDENT,
                hostel_id=h_id,
                mentor_id=m_id,
                room_number=r_num
            )
            s.set_password('12345')
            db.session.add(s)

        db.session.commit()
        print("✅ Test Data Seeded Successfully!")
        print("Logins: student1@gmail.com, warden1@gmail.com, mentor1@gmail.com")
        print("Password for all: 12345")

if __name__ == '__main__':
    seed_test_data()