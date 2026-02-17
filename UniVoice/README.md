# 📢 UniVoice: Hostel Complaint Management System

**UniVoice** is a streamlined Flask-based web application designed to bridge the gap between students and hostel administration. It features role-based access (Student, Warden, Mentor, Admin), Google OAuth integration, and a complete ticketing lifecycle for hostel grievances.

## 🚀 Features
* **🔐 Secure Authentication:** Google OAuth 2.0 & Role-Based Access Control (RBAC).
* **👥 Multi-Role Dashboards:**
    * **Students:** File complaints, track status, and view history.
    * **Wardens:** Manage hostel-specific issues and update statuses.
    * **Mentors:** Oversee assigned mentees and escalate urgent issues.
    * **Admins:** Full control over users, hostels, and system logs.
* **🏢 Smart Hostel Management:** Automated room generation and gender-segregated hostel logic.
* **🐳 Dockerized:** Fully containerized with Docker & PostgreSQL for easy deployment.

## 🛠️ Tech Stack
* **Backend:** Python (Flask), SQLAlchemy
* **Database:** PostgreSQL
* **Frontend:** HTML5, Bootstrap, Jinja2
* **Containerization:** Docker & Docker Compose

## ⚙️ Quick Start Guide

Follow these steps to get the project running locally in minutes.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/univoice.git

cd univoice 
```


### 2. Configure Google OAuth
To enable login, you need a **Google Cloud Project**:
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project and configure the **OAuth Consent Screen** (User Type: External).
3.  Create credentials (**OAuth Client ID** -> Application Type: **Web Application**).
4.  Set **Authorized Redirect URI** to:
    http://localhost:5000/google/callback
5.  Copy your **Client ID** and **Client Secret**.

### 3. Set Environment Variables
Create a `.env` file in the root directory and paste your credentials:
```bash
GOOGLE_CLIENT_ID=your-copied-client-id.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=your-copied-client-secret
```

### 4. Run with Docker
Build and start the services:
```bash
docker-compose up --build
```

*Wait for the logs to say `Running on http://0.0.0.0:5000`.*

### 5. Seed the Database
Open a **new terminal** window and run the seed script to create the tables and a Super Admin account:
```bash
docker-compose exec web python seed.py
```

*(This will create an Admin user: `admin@kiit.ac.in` / Password: `admin123`)*

## 🖥️ Usage
1.  Open your browser and go to **`http://localhost:5000`**.
2.  Login with **Google** (if your email is registered) or use the **Admin Credentials** above.
3.  **For Testing:** You can modify `seed.py` to generate dummy data for Students, Wardens, and Mentors to test different dashboards.

## 🤝 Contributing
Feel free to fork this repo and submit Pull Requests. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
This project is licensed under the MIT License.