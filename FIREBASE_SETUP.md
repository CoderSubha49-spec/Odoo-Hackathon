# HRMS Backend - Firebase Setup Guide

## 📋 Files Created

- `server.js` - Main Express backend server
- `firebaseConfig.js` - Firebase configuration with placeholders
- `firebaseHelper.js` - Firebase database operations helper
- `seedSampleData.js` - Script to populate sample data
- `package.json` - Dependencies

## 🔑 Firebase Setup Steps

### 1. Create a Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Create a project"
- Follow the setup wizard

### 2. Enable Firestore Database
- In Firebase Console, go to **Firestore Database**
- Click **Create Database**
- Select **Production mode**
- Choose a region close to you

### 3. Get Service Account Credentials
- Go to **Project Settings** (gear icon)
- Click **Service Accounts** tab
- Click **Generate New Private Key**
- Save the JSON file (keep it safe!)

### 4. Add Credentials to `firebaseConfig.js`

From the downloaded JSON file, find these values and add them to `firebaseConfig.js`:

```javascript
PROJECT_ID: "your-project-id",
PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\n...your-key...\n-----END PRIVATE KEY-----\n",
CLIENT_EMAIL: "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
DATABASE_URL: "https://your-project-id.firebaseio.com"
```

### 5. Get Web API Key (Optional, for frontend)
- Go to **Project Settings** > **General** tab
- Find **Web API Key** under "Your apps"
- Add it to `firebaseConfig.js` as `WEB_API_KEY`

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Verify Firebase Connection
```bash
npm start
```

Then check: `http://localhost:5000/api/health`

You should see Firebase configuration status.

### Seed Sample Data
Once Firebase is connected, populate the database with sample data:

```bash
npm run seed
```

This adds:
- 3 sample users (1 HR, 1 Employee, 1 Manager)
- 4 attendance records
- 3 leave requests
- 3 payroll records

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### Profile
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile/:id` - Update user profile

### Attendance
- `GET /api/attendance/:employeeId` - Get employee attendance
- `POST /api/attendance/checkin` - Record check-in
- `POST /api/attendance/checkout` - Record check-out

### Leave
- `GET /api/leaves` - Get all leave requests
- `GET /api/leaves/:employeeId` - Get employee leaves
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id/approve` - Approve leave
- `PUT /api/leaves/:id/reject` - Reject leave

### Payroll
- `GET /api/payroll/:employeeId` - Get employee payroll
- `PUT /api/payroll/:employeeId` - Update payroll

## 🔒 Security Note

**Never commit your Firebase credentials to Git!**

Add to `.gitignore`:
```
firebaseConfig.js
firebase-key.json
.env
```

## 🆘 Troubleshooting

**Firebase not connecting?**
- Check `firebaseConfig.js` has all required credentials
- Check `/api/health` endpoint for configuration status
- Verify Firestore Database is enabled in Firebase Console

**Private Key error?**
- Make sure newlines in private key are properly escaped as `\n`
- Use the exact value from the JSON file

---

All sample data will be stored in your Firebase Firestore database. No local files needed!
