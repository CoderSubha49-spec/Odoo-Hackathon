const TIBD_URL = process.env.TIBD_URL || 'YOUR_TIBD_CLOUD_URL';
const TIBD_API_KEY = process.env.TIBD_API_KEY || 'YOUR_TIBD_API_KEY';
const TIBD_AUTH_TOKEN = process.env.TIBD_AUTH_TOKEN || 'YOUR_TIBD_AUTH_TOKEN';
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_JWT_SECRET';
const TIBD_PATH_PREFIX = process.env.TIBD_PATH_PREFIX || '';

const useTibd = TIBD_URL !== 'YOUR_TIBD_CLOUD_URL' && TIBD_API_KEY !== 'YOUR_TIBD_API_KEY';

const sampleUsers = [
  {
    id: 1,
    employeeId: 'EMP001',
    email: 'hr@company.com',
    password: 'Admin123!',
    role: 'HR',
    verified: true,
    profile: {
      fullName: 'Alicia Brooks',
      phone: '+1-555-0101',
      address: 'New York, USA',
      jobTitle: 'HR Officer',
      salary: 7200,
      documents: ['Offer Letter', 'ID Proof'],
      profilePicture: 'https://example.com/avatar.png'
    }
  },
  {
    id: 2,
    employeeId: 'EMP002',
    email: 'employee@company.com',
    password: 'Employee123!',
    role: 'Employee',
    verified: true,
    profile: {
      fullName: 'Jordan Lee',
      phone: '+1-555-0102',
      address: 'Chicago, USA',
      jobTitle: 'Software Engineer',
      salary: 5400,
      documents: ['Contract'],
      profilePicture: 'https://example.com/avatar2.png'
    }
  }
];

const sampleAttendanceRecords = [
  { id: 1, employeeId: 'EMP002', date: '2026-07-01', status: 'Present', checkIn: '09:00', checkOut: '18:00' },
  { id: 2, employeeId: 'EMP002', date: '2026-07-02', status: 'Absent', checkIn: null, checkOut: null },
  { id: 3, employeeId: 'EMP002', date: '2026-07-03', status: 'Half-day', checkIn: '09:30', checkOut: '13:30' }
];

const sampleLeaveRequests = [
  { id: 1, employeeId: 'EMP002', type: 'Sick', startDate: '2026-07-10', endDate: '2026-07-12', remarks: 'Flu symptoms', status: 'Pending' }
];

function buildUrl(path) {
  return `${TIBD_URL.replace(/\/$/, '')}${TIBD_PATH_PREFIX}${path}`;
}

async function tibdFetch(path, options = {}) {
  if (!useTibd) {
    throw new Error('Tibd Cloud is not configured. Set TIBD_URL and TIBD_API_KEY.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': TIBD_API_KEY,
    ...(TIBD_AUTH_TOKEN ? { Authorization: `Bearer ${TIBD_AUTH_TOKEN}` } : {}),
    ...options.headers
  };

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(data.message || response.statusText || 'Tibd Cloud request failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

function findUserByEmail(email) {
  return sampleUsers.find((user) => user.email === email);
}

function getUserById(id) {
  return sampleUsers.find((user) => user.id === Number(id));
}

function simpleToken(user) {
  return Buffer.from(`${user.id}:${user.role}:${Date.now()}`).toString('base64');
}

async function signupUser(payload) {
  if (useTibd) {
    return tibdFetch('/auth/signup', { method: 'POST', body: payload });
  }

  if (findUserByEmail(payload.email)) {
    const error = new Error('Email already registered.');
    error.status = 409;
    throw error;
  }

  const newUser = {
    id: sampleUsers.length + 1,
    employeeId: payload.employeeId,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    verified: false,
    profile: {
      fullName: '',
      phone: '',
      address: '',
      jobTitle: '',
      salary: 0,
      documents: [],
      profilePicture: ''
    }
  };

  sampleUsers.push(newUser);
  return { user: newUser, message: 'Signup successful. Email verification required.' };
}

async function signinUser(payload) {
  if (useTibd) {
    return tibdFetch('/auth/signin', { method: 'POST', body: payload });
  }

  const user = findUserByEmail(payload.email);
  if (!user || user.password !== payload.password) {
    const error = new Error('Invalid credentials.');
    error.status = 401;
    throw error;
  }
  if (!user.verified) {
    const error = new Error('Email verification required.');
    error.status = 403;
    throw error;
  }

  return { token: simpleToken(user), user: { id: user.id, employeeId: user.employeeId, email: user.email, role: user.role } };
}

async function getProfile(userId) {
  if (useTibd) {
    return tibdFetch(`/profile/${userId}`);
  }

  const user = getUserById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  return { profile: user.profile };
}

async function updateProfile(userId, payload) {
  if (useTibd) {
    return tibdFetch(`/profile/${userId}`, { method: 'PUT', body: payload });
  }

  const user = getUserById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  const fields = ['fullName', 'phone', 'address', 'jobTitle', 'profilePicture'];
  fields.forEach((field) => {
    if (payload[field] !== undefined) {
      user.profile[field] = payload[field];
    }
  });

  return { profile: user.profile };
}

async function getAttendance(employeeId) {
  if (useTibd) {
    return tibdFetch(`/attendance/${employeeId}`);
  }

  return { attendance: sampleAttendanceRecords.filter((record) => record.employeeId === employeeId) };
}

async function recordCheckIn(payload) {
  if (useTibd) {
    return tibdFetch('/attendance/checkin', { method: 'POST', body: payload });
  }

  const record = {
    id: sampleAttendanceRecords.length + 1,
    employeeId: payload.employeeId,
    date: payload.date,
    status: 'Present',
    checkIn: payload.checkIn,
    checkOut: null
  };
  sampleAttendanceRecords.push(record);
  return { record };
}

async function recordCheckOut(payload) {
  if (useTibd) {
    return tibdFetch('/attendance/checkout', { method: 'POST', body: payload });
  }

  const record = sampleAttendanceRecords.find((item) => item.employeeId === payload.employeeId && item.date === payload.date);
  if (!record) {
    const error = new Error('Attendance record not found.');
    error.status = 404;
    throw error;
  }

  record.checkOut = payload.checkOut;
  record.status = 'Present';
  return { record };
}

async function getLeaves() {
  if (useTibd) {
    return tibdFetch('/leaves');
  }

  return { leaves: sampleLeaveRequests };
}

async function createLeaveRequest(payload) {
  if (useTibd) {
    return tibdFetch('/leaves', { method: 'POST', body: payload });
  }

  const request = {
    id: sampleLeaveRequests.length + 1,
    employeeId: payload.employeeId,
    type: payload.type,
    startDate: payload.startDate,
    endDate: payload.endDate,
    remarks: payload.remarks || '',
    status: 'Pending'
  };
  sampleLeaveRequests.push(request);
  return { leave: request };
}

async function updateLeaveStatus(id, status) {
  if (useTibd) {
    return tibdFetch(`/leaves/${id}/${status.toLowerCase()}`, { method: 'PUT' });
  }

  const leave = sampleLeaveRequests.find((item) => item.id === Number(id));
  if (!leave) {
    const error = new Error('Leave request not found.');
    error.status = 404;
    throw error;
  }

  leave.status = status;
  return { leave };
}

async function getPayroll(employeeId) {
  if (useTibd) {
    return tibdFetch(`/payroll/${employeeId}`);
  }

  const user = sampleUsers.find((u) => u.employeeId === employeeId || u.id === Number(employeeId));
  if (!user) {
    const error = new Error('Employee not found.');
    error.status = 404;
    throw error;
  }

  return { payroll: { employeeId: user.employeeId, salary: user.profile.salary, role: user.role } };
}

async function updatePayroll(employeeId, payload) {
  if (useTibd) {
    return tibdFetch(`/payroll/${employeeId}`, { method: 'PUT', body: payload });
  }

  const user = sampleUsers.find((u) => u.employeeId === employeeId || u.id === Number(employeeId));
  if (!user) {
    const error = new Error('Employee not found.');
    error.status = 404;
    throw error;
  }

  if (payload.salary !== undefined) {
    user.profile.salary = payload.salary;
  }

  return { payroll: { employeeId: user.employeeId, salary: user.profile.salary } };
}

module.exports = {
  TIBD_URL,
  TIBD_API_KEY,
  TIBD_AUTH_TOKEN,
  JWT_SECRET,
  useTibd,
  signupUser,
  signinUser,
  getProfile,
  updateProfile,
  getAttendance,
  recordCheckIn,
  recordCheckOut,
  getLeaves,
  createLeaveRequest,
  updateLeaveStatus,
  getPayroll,
  updatePayroll
};
