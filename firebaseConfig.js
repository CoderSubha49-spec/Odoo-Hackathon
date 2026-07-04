// Central Firebase Admin SDK config (backend)
//
// Required for real Firestore usage.
// You can also run with placeholders; endpoints will indicate missing config.

const fs = require('fs');
const path = require('path');

function loadServiceAccountFromBundledJson() {
  // Optional: allow a service account JSON to live somewhere inside the repo.
  // By default we do NOT ship secrets.
  const candidatePaths = [
    path.join(__dirname, 'firebase-key.json'),
    path.join(__dirname, 'frontend', 'src', 'components', 'odooxadamas-firebase-adminsdk-fbsvc-5f8ce09631.json')
  ];

  for (const filePath of candidatePaths) {
    try {
      if (!fs.existsSync(filePath)) continue;
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  return null;
}

const serviceAccount = loadServiceAccountFromBundledJson();

const PRIVATE_KEY = (() => {
  const pk = serviceAccount?.private_key || process.env.FIREBASE_PRIVATE_KEY;
  if (!pk) return '';
  // Firebase service account JSON often contains literal \n; convert to real newlines.
  return String(pk).replace(/\\n/g, '\n');
})();

module.exports = {
  PROJECT_ID: serviceAccount?.project_id || process.env.FIREBASE_PROJECT_ID || 'YOUR_FIREBASE_PROJECT_ID',
  PRIVATE_KEY: PRIVATE_KEY,
  CLIENT_EMAIL: serviceAccount?.client_email || process.env.FIREBASE_CLIENT_EMAIL || 'YOUR_FIREBASE_CLIENT_EMAIL',
  DATABASE_URL: process.env.FIREBASE_DATABASE_URL || 'YOUR_FIREBASE_DATABASE_URL',
  WEB_API_KEY: process.env.FIREBASE_WEB_API_KEY || 'YOUR_FIREBASE_WEB_API_KEY',
  JWT_SECRET: process.env.JWT_SECRET || 'YOUR_JWT_SECRET_KEY'
};

