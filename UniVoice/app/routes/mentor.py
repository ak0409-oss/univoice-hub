from flask import render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from app import db
from app.models import UserRole, Complaint
from . import main

@main.route('/mentor/dashboard', methods=['GET', 'POST'])
@login_required
def mentor_dashboard():
    if current_user.role != UserRole.MENTOR:
        flash('Access Denied: You do not have permission to view this page.', 'danger')
        return redirect(url_for('main.logout'))

    if request.method == 'POST':
        complaint_id = request.form.get('complaint_id')
        comment = request.form.get('mentor_comment')
        is_urgent = request.form.get('is_urgent') == 'on'
        
        complaint = Complaint.query.get(complaint_id)
        
        if complaint and complaint.author.mentor_id == current_user.id:
            complaint.mentor_comment = comment
            complaint.is_urgent = is_urgent
            db.session.commit()
            flash('Complaint updated successfully!', 'success')
        else:
            flash('Permission denied: Not your mentee.', 'danger')
        return redirect(url_for('main.mentor_dashboard'))

    mentee_ids = [student.id for student in current_user.mentees]
    if mentee_ids:
        my_mentee_complaints = Complaint.query.filter(
            Complaint.user_id.in_(mentee_ids)
        ).order_by(Complaint.created_at.desc()).all()
    else:
        my_mentee_complaints = []
    
    return render_template('mentor/dashboard.html', complaints=my_mentee_complaints)