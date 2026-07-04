const express = require('express');
const cors = require('cors');
const { db_ops } = require('./firebaseHelper');
const firebaseConfig = require('./firebaseConfig');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==========================
// HELPER FUNCTIONS
// ==========================
function isValidPassword(password) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}

function simpleToken(user) {
  return Buffer.from(`${user.id}:${user.role}:${Date.now()}`).toString('base64');
}

// ==========================
// HEALTH CHECK
// ==========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    firebase: {
      projectId: firebaseConfig.PROJECT_ID !== 'YOUR_FIREBASE_PROJECT_ID' ? 'configured' : 'missing',
      privateKey: firebaseConfig.PRIVATE_KEY !== 'YOUR_FIREBASE_PRIVATE_KEY' ? 'configured' : 'missing',
      clientEmail: firebaseConfig.CLIENT_EMAIL !== 'YOUR_FIREBASE_CLIENT_EMAIL' ? 'configured' : 'missing'
    },
    message: 'Add Firebase credentials to firebaseConfig.js to start using the database'
  });
});

// ==========================
// AUTH ROUTES
// ==========================
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { employeeId, email, password, role } = req.body;

    if (!employeeId || !email || !password || !role) {
      return res.status(400).json({ message: 'employeeId, email, password, and role are required.' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, number, and symbol.' });
    }

    const existing = await db_ops.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const newUser = await db_ops.createUser({
      employeeId,
      email,
      password,
      role,
      verified: false,
      profile: {
        fullName: '',
        phone: '',
        address: '',
        jobTitle: '',
        salary: 0,
        documents: [],
        profilePicture: ''
      },
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Signup successful. Email verification required.',
      user: { id: newUser.id, employeeId, email, role, verified: false }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await db_ops.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'Email verification required.' });
    }

    const token = simpleToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================
// PROFILE ROUTES
// ==========================
app.get('/api/profile/:id', async (req, res) => {
  try {
    const user = await db_ops.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ user: user.profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/profile/:id', async (req, res) => {
  try {
    const user = await db_ops.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const { fullName, phone, address, jobTitle, profilePicture } = req.body;

    const updatedProfile = { ...user.profile };
    if (fullName) updatedProfile.fullName = fullName;
    if (phone) updatedProfile.phone = phone;
    if (address) updatedProfile.address = address;
    if (jobTitle) updatedProfile.jobTitle = jobTitle;
    if (profilePicture) updatedProfile.profilePicture = profilePicture;

    await db_ops.updateUser(req.params.id, { profile: updatedProfile });

    res.json({ message: 'Profile updated.', user: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================
// ATTENDANCE ROUTES
// ==========================
app.get('/api/attendance/:employeeId', async (req, res) => {
  try {
    const records = await db_ops.getAttendance(req.params.employeeId);
    res.json({ attendance: records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/attendance/checkin', async (req, res) => {
  try {
    const { employeeId, date, checkIn } = req.body;
    if (!employeeId || !date || !checkIn) {
      return res.status(400).json({ message: 'employeeId, date, and checkIn are required.' });
    }

    const attendanceRecord = await db_ops.createAttendance({
      employeeId,
      date,
      status: 'Present',
      checkIn,
      checkOut: null,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Check-in recorded.', attendance: attendanceRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/attendance/checkout', async (req, res) => {
  try {
    const { attendanceId, checkOut } = req.body;
    if (!attendanceId || !checkOut) {
      return res.status(400).json({ message: 'attendanceId and checkOut are required.' });
    }

    const updated = await db_ops.updateAttendance(attendanceId, { checkOut });
    res.json({ message: 'Check-out recorded.', attendance: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================
// LEAVE ROUTES
// ==========================
app.get('/api/leaves', async (req, res) => {
  try {
    const leaves = await db_ops.getAllLeaves();
    res.json({ leaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/leaves/:employeeId', async (req, res) => {
  try {
    const leaves = await db_ops.getLeavesByEmployee(req.params.employeeId);
    res.json({ leaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/leaves', async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, remarks } = req.body;
    if (!employeeId || !type || !startDate || !endDate) {
      return res.status(400).json({ message: 'employeeId, type, startDate, and endDate are required.' });
    }

    const leave = await db_ops.createLeave({
      employeeId,
      type,
      startDate,
      endDate,
      remarks: remarks || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Leave request submitted.', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/leaves/:id/approve', async (req, res) => {
  try {
    const leave = await db_ops.updateLeave(req.params.id, { status: 'Approved' });
    res.json({ message: 'Leave request approved.', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/leaves/:id/reject', async (req, res) => {
  try {
    const leave = await db_ops.updateLeave(req.params.id, { status: 'Rejected' });
    res.json({ message: 'Leave request rejected.', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================
// PAYROLL ROUTES
// ==========================
app.get('/api/payroll/:employeeId', async (req, res) => {
  try {
    const payroll = await db_ops.getPayroll(req.params.employeeId);
    if (!payroll) return res.status(404).json({ message: 'Payroll not found.' });

    res.json({ payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/payroll/:employeeId', async (req, res) => {
  try {
    const payroll = await db_ops.updatePayroll(req.params.employeeId, req.body);
    res.json({ message: 'Payroll updated.', payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`HRMS backend running on http://localhost:${PORT}`);
  console.log('Firebase configuration status: check /api/health');
  console.log('Add your Firebase credentials to firebaseConfig.js to start');
});
