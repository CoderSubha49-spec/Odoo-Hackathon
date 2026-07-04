const admin = require('firebase-admin');
const firebaseConfig = require('./firebaseConfig');

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseConfig.PROJECT_ID,
      privateKey: firebaseConfig.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: firebaseConfig.CLIENT_EMAIL
    })
  });
} catch (error) {
  console.warn('Firebase initialization warning:', error.message);
  console.warn('Make sure to add your Firebase credentials to firebaseConfig.js');
}

const db = admin.firestore();

// Helper functions for database operations
const db_ops = {
  // User operations
  async getUserByEmail(email) {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    return snapshot.docs[0]?.data();
  },

  async getUserById(id) {
    const doc = await db.collection('users').doc(id).get();
    return doc.data();
  },

  async createUser(userData) {
    const docRef = await db.collection('users').add(userData);
    return { id: docRef.id, ...userData };
  },

  async updateUser(userId, userData) {
    await db.collection('users').doc(userId).update(userData);
    return { id: userId, ...userData };
  },

  // Attendance operations
  async getAttendance(employeeId) {
    const snapshot = await db.collection('attendance').where('employeeId', '==', employeeId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async createAttendance(attendanceData) {
    const docRef = await db.collection('attendance').add(attendanceData);
    return { id: docRef.id, ...attendanceData };
  },

  async updateAttendance(attendanceId, attendanceData) {
    await db.collection('attendance').doc(attendanceId).update(attendanceData);
    return { id: attendanceId, ...attendanceData };
  },

  // Leave operations
  async getAllLeaves() {
    const snapshot = await db.collection('leaves').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getLeavesByEmployee(employeeId) {
    const snapshot = await db.collection('leaves').where('employeeId', '==', employeeId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async createLeave(leaveData) {
    const docRef = await db.collection('leaves').add(leaveData);
    return { id: docRef.id, ...leaveData };
  },

  async updateLeave(leaveId, leaveData) {
    await db.collection('leaves').doc(leaveId).update(leaveData);
    return { id: leaveId, ...leaveData };
  },

  // Payroll operations
  async getPayroll(employeeId) {
    const doc = await db.collection('payroll').doc(employeeId).get();
    return doc.data();
  },

  async updatePayroll(employeeId, payrollData) {
    await db.collection('payroll').doc(employeeId).update(payrollData);
    return { employeeId, ...payrollData };
  }
};

module.exports = { db, db_ops };
