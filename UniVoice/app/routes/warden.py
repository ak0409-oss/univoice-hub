from flask import render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from app import db
from app.models import UserRole, Complaint, ComplaintStatus
from datetime import datetime
from . import main

@main.route('/warden/dashboard', methods=['GET', 'POST'])
@login_required
def warden_dashboard():
    if current_user.role != UserRole.WARDEN:
        flash('Access Denied: You do not have permission to view this page.', 'danger')
        return redirect(url_for('main.logout'))
    
    if request.method == 'POST':
        complaint_id = request.form.get('complaint_id')
        new_status = request.form.get('status')
        comment = request.form.get('warden_comment')
        
        complaint = Complaint.query.get(complaint_id)
        
        if complaint and complaint.hostel_id == current_user.hostel_id:

            try:
                complaint.status = ComplaintStatus(new_status)
            except ValueError:
                flash('Invalid status update.', 'danger')
                return redirect(url_for('main.warden_dashboard'))
            
            complaint.warden_comment = comment
            if complaint.status == ComplaintStatus.RESOLVED:
                complaint.resolved_at = datetime.utcnow()
                
            db.session.commit()
            flash('Complaint updated!', 'success')
        else:
            flash('Permission Denied', 'danger')
        return redirect(url_for('main.warden_dashboard'))

    all_complaints = Complaint.query.filter_by(
        hostel_id=current_user.hostel_id
    ).order_by(Complaint.created_at.desc()).all()
    
    pending = []
    mentor_forwarded = []
    in_progress = []
    archived = []
    completed = []

    for c in all_complaints:
        if c.status == ComplaintStatus.FLAGGED: archived.append(c)
        elif c.status in [ComplaintStatus.RESOLVED, ComplaintStatus.REJECTED]: completed.append(c)
        elif c.is_urgent: mentor_forwarded.append(c)
        elif c.status == ComplaintStatus.IN_PROGRESS: in_progress.append(c)
        elif c.status == ComplaintStatus.PENDING: pending.append(c)

    return render_template('warden/dashboard.html', 
                           pending=pending,
                           mentor_forwarded=mentor_forwarded,
                           in_progress=in_progress,
                           archived=archived,
                           completed=completed,
                           ComplaintStatus=ComplaintStatus)