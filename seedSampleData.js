// Sample Data Seeding Script for HRMS Firebase Database
// Run this after adding your Firebase credentials to firebaseConfig.js
// Usage: node seedSampleData.js

const { db } = require('./firebaseHelper');
const firebaseConfig = require('./firebaseConfig');

async function seedSampleData() {
  console.log('🌱 Starting Firebase database seeding...\n');

  // Check if Firebase is configured
  if (
    firebaseConfig.PROJECT_ID === 'YOUR_FIREBASE_PROJECT_ID' ||
    firebaseConfig.PRIVATE_KEY === 'YOUR_FIREBASE_PRIVATE_KEY'
  ) {
    console.error('❌ Firebase credentials not configured in firebaseConfig.js');
    console.error('Add your Firebase credentials first, then run this script again.');
    process.exit(1);
  }

  try {
    // ========== SEED USERS ==========
    console.log('📝 Seeding users...');
    const usersData = [
      {
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
        },
        createdAt: new Date().toISOString()
      },
      {
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
        },
        createdAt: new Date().toISOString()
      },
      {
        employeeId: 'EMP003',
        email: 'manager@company.com',
        password: 'Manager123!',
        role: 'HR',
        verified: true,
        profile: {
          fullName: 'Sarah Johnson',
          phone: '+1-555-0103',
          address: 'Boston, USA',
          jobTitle: 'HR Manager',
          salary: 6800,
          documents: ['Offer Letter'],
          profilePicture: 'https://example.com/avatar3.png'
        },
        createdAt: new Date().toISOString()
      }
    ];

    for (const user of usersData) {
      await db.collection('users').add(user);
      console.log(`  ✓ Added user: ${user.email}`);
    }

    // ========== SEED ATTENDANCE ==========
    console.log('\n📅 Seeding attendance records...');
    const attendanceData = [
      {
        employeeId: 'EMP002',
        date: '2026-07-01',
        status: 'Present',
        checkIn: '09:00',
        checkOut: '18:00',
        createdAt: new Date().toISOString()
      },
      {
        employeeId: 'EMP002',
        date: '2026-07-02',
        status: 'Absent',
        checkIn: null,
        checkOut: null,
        createdAt: new Date().toISOString()
      },
      {
        employeeId: 'EMP002',
        date: '2026-07-03',
        status: 'Half-day',
        checkIn: '09:30',
        checkOut: '13:30',
        createdAt: new Date().toISOString()
      },
      {
        employeeId: 'EMP002',
        date: '2026-07-04',
        status: 'Present',
        checkIn: '08:45',
        checkOut: '17:45',
        createdAt: new Date().toISOString()
      }
    ];

    for (const record of attendanceData) {
      await db.collection('attendance').add(record);
      console.log(`  ✓ Added attendance: ${record.employeeId} on ${record.date}`);
    }

    // ========== SEED LEAVES ==========
    console.log('\n🏖️ Seeding leave requests...');
    const leavesData = [
      {
        employeeId: 'EMP002',
        type: 'Sick',
        startDate: '2026-07-10',
        endDate: '2026-07-12',
        remarks: 'Flu symptoms',
        status: 'Pending',
        createdAt: new Date().toISOString()
      },
      {
        employeeId: 'EMP002',
        type: 'Paid',
        startDate: '2026-08-01',
        endDate: '2026-08-05',
        remarks: 'Vacation',
        status: 'Approved',
        createdAt: new Date().toISOString()
      },
      {
        employeeId: 'EMP003',
        type: 'Unpaid',
        startDate: '2026-07-20',
        endDate: '2026-07-21',
        remarks: 'Personal reasons',
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
    ];

    for (const leave of leavesData) {
      await db.collection('leaves').add(leave);
      console.log(`  ✓ Added leave: ${leave.employeeId} (${leave.type})`);
    }

    // ========== SEED PAYROLL ==========
    console.log('\n💰 Seeding payroll records...');
    const payrollData = [
      {
        employeeId: 'EMP001',
        salary: 7200,
        baseSalary: 7000,
        allowances: 200,
        deductions: 0,
        status: 'Active',
        lastUpdated: new Date().toISOString()
      },
      {
        employeeId: 'EMP002',
        salary: 5400,
        baseSalary: 5200,
        allowances: 200,
        deductions: 0,
        status: 'Active',
        lastUpdated: new Date().toISOString()
      },
      {
        employeeId: 'EMP003',
        salary: 6800,
        baseSalary: 6500,
        allowances: 300,
        deductions: 0,
        status: 'Active',
        lastUpdated: new Date().toISOString()
      }
    ];

    for (const payroll of payrollData) {
      await db.collection('payroll').doc(payroll.employeeId).set(payroll);
      console.log(`  ✓ Added payroll: ${payroll.employeeId} - $${payroll.salary}`);
    }

    console.log('\n✅ Firebase seeding completed successfully!');
    console.log('📊 Sample data is now available in your Firestore database.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding data:', error.message);
    process.exit(1);
  }
}

seedSampleData();
