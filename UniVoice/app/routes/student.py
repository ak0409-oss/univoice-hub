from flask import render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from app import db
from app.models import UserRole, Complaint, Category, ComplaintStatus
from . import main
from .utils import contains_bad_words

@main.route('/student/dashboard', methods=['GET', 'POST'])
@login_required
def student_dashboard():
    if current_user.role != UserRole.STUDENT:
        return redirect(url_for('main.login'))

    if request.method == 'POST':
        heading = request.form.get('heading')
        description = request.form.get('description')
        category = request.form.get('category')
        
        is_abusive = contains_bad_words(heading) or contains_bad_words(description)
        initial_status = ComplaintStatus.FLAGGED if is_abusive else ComplaintStatus.PENDING
        
        new_complaint = Complaint(
            heading=heading,
            description=description,
            category=Category(category),
            user_id=current_user.id,
            hostel_id=current_user.hostel_id,
            status=initial_status,
            is_abusive=is_abusive
        )
        
        db.session.add(new_complaint)
        db.session.commit()
        
        if is_abusive:
            flash('Your complaint was flagged for inappropriate language and sent for review.', 'warning')
        else:
            flash('Complaint filed successfully!', 'success')
            
        return redirect(url_for('main.student_dashboard'))

    my_complaints = Complaint.query.filter_by(user_id=current_user.id).order_by(Complaint.created_at.desc()).all()
    return render_template('student/dashboard.html', complaints=my_complaints, Category=Category)