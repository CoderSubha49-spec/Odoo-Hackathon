// Firebase Firestore Connection Test
const admin = require('firebase-admin');
const firebaseConfig = require('./firebaseConfig');

async function testConnection() {
  console.log('🔍 Testing Firebase Firestore connection...\n');

  try {
    // Check if credentials are loaded
    console.log('✓ Project ID:', firebaseConfig.PROJECT_ID);
    console.log('✓ Client Email:', firebaseConfig.CLIENT_EMAIL);
    console.log('✓ Private Key loaded:', firebaseConfig.PRIVATE_KEY ? 'Yes' : 'No');

    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.PROJECT_ID,
          privateKey: firebaseConfig.PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: firebaseConfig.CLIENT_EMAIL
        })
      });
      console.log('✓ Firebase Admin SDK initialized\n');
    }

    // Test Firestore connection
    const db = admin.firestore();
    console.log('🔄 Attempting to create a test document...');
    
    const testRef = await db.collection('_test').doc('connection-test').set({
      timestamp: new Date(),
      message: 'Connection test successful'
    });

    console.log('✅ Firestore connection successful!\n');
    
    // Clean up test document
    await db.collection('_test').doc('connection-test').delete();
    console.log('🧹 Cleaned up test data\n');
    
    console.log('📊 Your Firestore database is ready for seeding!');
    console.log('Run: npm run seed\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Firestore database not created in Firebase Console');
    console.error('2. Firestore API not enabled (may need 5-10 minutes after enabling)');
    console.error('3. Service account permissions incorrect');
    console.error('\nFix: Go to https://console.firebase.google.com/ and ensure:');
    console.error('- Firestore Database is created');
    console.error('- Cloud Firestore API is enabled');
    console.error('\nThen try again: node testFirebase.js\n');
    process.exit(1);
  }
}

testConnection();
