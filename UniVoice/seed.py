from app import create_app, db
from app.models import User, UserRole  # Only import what we need

app = create_app()

def seed_data():
    with app.app_context():
        # 1. Create the empty tables (Critical step)
        print("--- Creating Database Structure ---")
        db.create_all()
        
        # 2. Create the ONE Admin account required to access the system
        if not User.query.filter_by(role=UserRole.ADMIN).first():
            print("--- Seeding Super Admin ---")
            admin = User(
                email='admin@kiit.ac.in',
                name='Super Admin',
                role=UserRole.ADMIN
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("✅ Success: Database is empty. Admin created (admin@kiit.ac.in).")
        else:
            print("ℹ️ Admin already exists. Doing nothing.")

if __name__ == '__main__':
    seed_data()