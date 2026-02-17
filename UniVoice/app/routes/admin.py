from flask import render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from app import db
from app.models import User, Hostel, UserRole, Complaint, ComplaintStatus
from . import main

# 1. MAIN HUB
@main.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if current_user.role != UserRole.ADMIN: return redirect(url_for('main.login'))
    return render_template('admin/dashboard.html')

# 2. HOSTEL MANAGEMENT
@main.route('/admin/hostels', methods=['GET', 'POST'])
@login_required
def admin_hostels():
    if current_user.role != UserRole.ADMIN: return redirect(url_for('main.login'))

    # CREATE HOSTEL LOGIC
    if request.method == 'POST':
        name = request.form.get('name')
        gender = request.form.get('gender')
        total_rooms = int(request.form.get('total_rooms'))
        
        if Hostel.query.filter_by(name=name).first():
            flash('Hostel already exists!', 'danger')
        else:
            new_hostel = Hostel(name=name, gender=gender, total_rooms=total_rooms)
            db.session.add(new_hostel)
            db.session.commit()
            new_hostel.generate_rooms()
            flash(f'Hostel {name} created!', 'success')
        return redirect(url_for('main.admin_hostels'))

    hostels = Hostel.query.all()
    return render_template('admin/manage_hostels.html', hostels=hostels)

# 3. WARDEN MANAGEMENT
@main.route('/admin/wardens', methods=['GET', 'POST'])
@login_required
def admin_wardens():
    if current_user.role != UserRole.ADMIN: return redirect(url_for('main.login'))

    if request.method == 'POST':
        # Create Warden Logic
        email = request.form.get('email')
        name = request.form.get('name')
        password = request.form.get('password')
        hostel_id = request.form.get('hostel_id')

        if User.query.filter_by(email=email).first():
            flash('Email already registered!', 'danger')
        else:
            new_user = User(email=email, name=name, role=UserRole.WARDEN)
            new_user.set_password(password)
            if hostel_id: new_user.hostel_id = int(hostel_id)
            db.session.add(new_user)
            db.session.commit()
            flash(f'Warden {name} created!', 'success')
        return redirect(url_for('main.admin_wardens'))

    wardens = User.query.filter_by(role=UserRole.WARDEN).all()
    hostels = Hostel.query.all()
    return render_template('admin/manage_wardens.html', wardens=wardens, hostels=hostels)

# 4. MENTOR MANAGEMENT
@main.route('/admin/mentors', methods=['GET', 'POST'])
@login_required
def admin_mentors():
    if current_user.role != UserRole.ADMIN: return redirect(url_for('main.login'))

    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('name')
        password = request.form.get('password')

        if User.query.filter_by(email=email).first():
            flash('Email already registered!', 'danger')
        else:
            new_user = User(email=email, name=name, role=UserRole.MENTOR)
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            flash(f'Mentor {name} created!', 'success')
        return redirect(url_for('main.admin_mentors'))

    mentors = User.query.filter_by(role=UserRole.MENTOR).all()
    return render_template('admin/manage_mentors.html', mentors=mentors)

# 5. STUDENT MANAGEMENT (List & Create)
@main.route('/admin/students', methods=['GET', 'POST'])
@login_required
def admin_students():
    if current_user.role != UserRole.ADMIN: return redirect(url_for('main.login'))

    # CREATE STUDENT LOGIC
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('name')
        password = request.form.get('password')
        hostel_id = request.form.get('hostel_id')
        mentor_id = request.form.get('mentor_id')
        room_number = request.form.get('room_number') 

        if User.query.filter_by(email=email).first():
            flash('Email already registered!', 'danger')
        else:
            new_user = User(email=email, name=name, role=UserRole.STUDENT)
            new_user.set_password(password)
            if hostel_id: new_user.hostel_id = int(hostel_id)
            if mentor_id: new_user.mentor_id = int(mentor_id)
            if room_number: new_user.room_number = room_number 
            
            db.session.add(new_user)
            db.session.commit()
            flash(f'Student {name} created!', 'success')
        return redirect(url_for('main.admin_students', hostel_id=hostel_id))

    # FILTER & LIST LOGIC
    hostel_id = request.args.get('hostel_id')
    students = []
    selected_hostel = None

    if hostel_id:
        selected_hostel = Hostel.query.get(hostel_id)
        students = User.query.filter_by(role=UserRole.STUDENT, hostel_id=hostel_id).order_by(User.room_number).all()

    hostels = Hostel.query.all()
    mentors = User.query.filter_by(role=UserRole.MENTOR).all()
    
    return render_template('admin/manage_students.html', 
                           students=students, 
                           hostels=hostels, 
                           mentors=mentors, 
                           selected_hostel=selected_hostel)

# 6. STUDENT DEEP PROFILE
@main.route('/admin/student_profile/<int:user_id>')
@login_required
def admin_student_profile(user_id):
    if current_user.role != UserRole.ADMIN: return redirect(url_for('main.login'))
    
    student = User.query.get_or_404(user_id)
    all_complaints = Complaint.query.filter_by(user_id=student.id).order_by(Complaint.created_at.desc()).all()
    
    flagged_complaints = [c for c in all_complaints if c.status == ComplaintStatus.FLAGGED]
    history_complaints = [c for c in all_complaints if c.status != ComplaintStatus.FLAGGED]
    
    return render_template('admin/student_profile.html', 
                           student=student, 
                           flagged=flagged_complaints, 
                           history=history_complaints)

# 7. EDIT USER (Generic)
@main.route('/admin/edit_user/<int:user_id>', methods=['GET', 'POST'])
@login_required
def edit_user(user_id):
    if current_user.role != UserRole.ADMIN: return redirect(url_for('main.login'))
    
    user = User.query.get_or_404(user_id)
    
    if request.method == 'POST':
        user.name = request.form.get('name')
        user.email = request.form.get('email')
        
        h_id = request.form.get('hostel_id')
        user.hostel_id = int(h_id) if h_id else None
        
        m_id = request.form.get('mentor_id')
        user.mentor_id = int(m_id) if m_id else None
        
        db.session.commit()
        flash(f'Updated profile for {user.name}', 'success')
        
        # Redirect back to context
        if user.role == UserRole.STUDENT:
             return redirect(url_for('main.admin_students', hostel_id=user.hostel_id))
        elif user.role == UserRole.WARDEN:
             return redirect(url_for('main.admin_wardens'))
        elif user.role == UserRole.MENTOR:
             return redirect(url_for('main.admin_mentors'))
        return redirect(url_for('main.admin_dashboard'))
        
    hostels = Hostel.query.all()
    mentors = User.query.filter_by(role=UserRole.MENTOR).all()
    return render_template('admin/edit_user.html', user=user, hostels=hostels, mentors=mentors)

# 8. COMPLAINTS MANAGER
@main.route('/admin/complaints', methods=['GET'])
@login_required
def admin_view_complaints():
    if current_user.role != UserRole.ADMIN: return redirect(url_for('main.login'))
    
    hostel_id = request.args.get('hostel_id')
    status_filter = request.args.get('status')
    
    hostels = Hostel.query.all()
    complaints = []
    selected_hostel = None
    counts = {}

    if hostel_id:
        selected_hostel = Hostel.query.get(hostel_id)
        for s in ComplaintStatus:
            count = Complaint.query.filter_by(hostel_id=hostel_id, status=s).count()
            counts[s.value] = count
            
        query = Complaint.query.filter_by(hostel_id=hostel_id)
        if status_filter:
            query = query.filter_by(status=ComplaintStatus(status_filter))
        else:
            query = query.filter_by(status=ComplaintStatus.PENDING)
            status_filter = 'pending'
        complaints = query.order_by(Complaint.created_at.desc()).all()
    
    return render_template('admin/complaints.html', 
                           complaints=complaints, 
                           hostels=hostels, 
                           selected_hostel=selected_hostel,
                           counts=counts,
                           current_status=status_filter)

# 9. DELETE COMPLAINT
@main.route('/admin/delete_complaint/<int:complaint_id>', methods=['POST'])
@login_required
def admin_delete_complaint(complaint_id):
    if current_user.role != UserRole.ADMIN: return redirect(url_for('main.login'))
        
    complaint = Complaint.query.get_or_404(complaint_id)
    hostel_id = complaint.hostel_id 
    
    db.session.delete(complaint)
    db.session.commit()
    
    flash('Complaint deleted permanently.', 'info')
    return redirect(url_for('main.admin_view_complaints', hostel_id=hostel_id))