from datetime import datetime
from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import enum

# --- ENUMS ---
class UserRole(enum.Enum):
    ADMIN = 'admin'
    STUDENT = 'student'
    WARDEN = 'warden'
    MENTOR = 'mentor'
    GATEKEEPER = 'gatekeeper'

class ComplaintStatus(enum.Enum):
    PENDING = 'pending'
    IN_PROGRESS = 'in_progress'
    RESOLVED = 'resolved'
    FLAGGED = 'flagged'  # For abusive content
    REJECTED = 'rejected'  

class Category(enum.Enum):
    ELECTRIC = 'electric'
    TOILET = 'toilet'
    WIFI = 'wifi'
    MESS = 'mess'
    PERSONAL = 'personal'
    OTHERS = 'others'

# --- MODELS ---

class Hostel(db.Model):
    __tablename__ = 'hostels'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    gender = db.Column(db.String(10), nullable=False)  # 'Boys' or 'Girls'
    total_rooms = db.Column(db.Integer, nullable=False)
    
    # Relationships
    rooms = db.relationship('Room', backref='hostel', lazy=True, cascade="all, delete-orphan")
    students = db.relationship('User', backref='hostel', lazy=True)

    def generate_rooms(self):
        """
        Auto-fills rooms based on total_rooms.
        Example: If total_rooms=50, creates '101' to '150'.
        """
        existing_rooms = Room.query.filter_by(hostel_id=self.id).count()
        if existing_rooms == 0:
            for i in range(1, self.total_rooms + 1):
                # Simple logic: Room 101, 102, etc.
                room_num = str(100 + i) 
                new_room = Room(room_number=room_num, hostel=self)
                db.session.add(new_room)
            db.session.commit()

class Room(db.Model):
    __tablename__ = 'rooms'
    
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(10), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=False)
    
    # Relationships
    students = db.relationship('User', backref='room', lazy=True)

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120))
    password_hash = db.Column(db.String(256)) # Stores hashed password
    
    # Role Management
    role = db.Column(db.Enum(UserRole), nullable=False)
    
    # OAuth Fields
    social_id = db.Column(db.String(200), unique=True, nullable=True)

    # --- Foreign Keys ---
    # Nullable because Admin/Gatekeeper might not need a Room or Mentor
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=True)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    room_number = db.Column(db.String(20), nullable=True)

    # --- Relationships ---
    # For Mentor: List of assigned students
    mentees = db.relationship('User', backref=db.backref('mentor', remote_side=[id]), lazy=True)
    # For Student: List of filed complaints
    complaints = db.relationship('Complaint', backref='author', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Complaint(db.Model):
    __tablename__ = 'complaints'
    
    id = db.Column(db.Integer, primary_key=True)
    heading = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.Enum(Category), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)
    
    # Status
    status = db.Column(db.Enum(ComplaintStatus), default=ComplaintStatus.PENDING)
    
    # Logic Flags
    is_urgent = db.Column(db.Boolean, default=False)
    is_abusive = db.Column(db.Boolean, default=False)
    
    # Comments
    mentor_comment = db.Column(db.Text, nullable=True)
    warden_comment = db.Column(db.Text, nullable=True)

    # Links
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=False)

# --- FLASK LOGIN LOADER ---
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))