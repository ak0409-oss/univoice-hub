from flask import render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from app.models import User, UserRole
from app import oauth  # <--- Import oauth
from . import main

# --- STANDARD ROUTES ---

@main.route('/', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect_based_on_role(current_user)

    # Manual Login (Backup)
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user)
            return redirect_based_on_role(user)
        else:
            flash('Invalid credentials', 'danger')
            
    return render_template('login.html')

@main.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('main.login'))

# --- GOOGLE OAUTH ROUTES ---

@main.route('/google')
def google_login():
    # Send user to Google
    redirect_uri = url_for('main.google_callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@main.route('/google/callback')
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get('userinfo')
        
        if not user_info:
            flash('Google Authentication failed.', 'danger')
            return redirect(url_for('main.login'))
            
        email = user_info['email']
        
        # --- FUTURE RESTRICTION AREA ---
        # Uncomment the lines below when you are ready to restrict to KIIT
        # if not email.endswith('@kiit.ac.in'):
        #     flash('Access Denied: Only @kiit.ac.in emails are allowed.', 'danger')
        #     return redirect(url_for('main.login'))
        # -------------------------------

        # Check Database (Does this email exist in our system?)
        user = User.query.filter_by(email=email).first()
        
        if user:
            login_user(user)
            flash(f'Welcome back, {user.name}!', 'success')
            return redirect_based_on_role(user)
        else:
            flash(f'Access Denied: The email {email} is not registered in our system.', 'danger')
            return redirect(url_for('main.login'))
            
    except Exception as e:
        print(f"OAuth Error: {e}")
        flash('Something went wrong. Please try again.', 'danger')
        return redirect(url_for('main.login'))

def redirect_based_on_role(user):
    if user.role == UserRole.ADMIN: return redirect(url_for('main.admin_dashboard'))
    elif user.role == UserRole.STUDENT: return redirect(url_for('main.student_dashboard'))
    elif user.role == UserRole.WARDEN: return redirect(url_for('main.warden_dashboard'))
    elif user.role == UserRole.MENTOR: return redirect(url_for('main.mentor_dashboard'))

    flash('Error: User role not recognized.', 'danger')
    return redirect(url_for('main.logout'))