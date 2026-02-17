import os

class Config:
    # Security Key for Sessions (Keep this secret in production)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev_secret_key_12345'
    
    # Database Connection
    # 'postgresql://user:password@service_name:port/db_name'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://hello_hostel:secure_pass@db:5432/hostel_db'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # OAuth Keys (We will fill these later from Google Console)
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')