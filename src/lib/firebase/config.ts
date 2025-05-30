
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getMessaging, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | undefined;
let messaging: Messaging | undefined;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
  messaging = getMessaging(app);
} else if (getApps().length > 0) {
  app = getApps()[0]!;
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
  messaging = getMessaging(app);
}

// Explicitly type exports for server-side usage if needed, though client-side init is primary here
const initializedApp = app!;
const initializedAuth = auth!;
const initializedDb = db!;
const initializedStorage = storage!;
const initializedAnalytics = analytics;
const initializedMessaging = messaging;


export { 
  initializedApp as firebaseApp, 
  initializedAuth as firebaseAuth, 
  initializedDb as firestoreDB, 
  initializedStorage as firebaseStorage,
  initializedAnalytics as firebaseAnalytics,
  initializedMessaging as firebaseMessaging
};
