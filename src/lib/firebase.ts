/// <reference types="vite/client" />

/**
 * Firebase Firestore & Authentication Client Setup
 * Initialized with lazy loading and fallback guards for high availability.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Standard Firebase Applet & Project Configuration
const defaultFirebaseConfig = {
  projectId: "hardy-diorama-njlsj",
  appId: "1:445494552671:web:577c81c63b3575f41153ea",
  apiKey: "AIzaSyAvjyq5UfqqQ2bf6S3MMcGQzN7YeAnjIq0",
  authDomain: "hardy-diorama-njlsj.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-astroerpastrolog-9a03641e-8c08-4e79-b1c5-e61b99c8a2ae",
  storageBucket: "hardy-diorama-njlsj.firebasestorage.app",
  messagingSenderId: "445494552671",
  measurementId: "",
  oAuthClientId: "445494552671-ogo7o4unjsfeajfprfm2q1g4bgav0a4l.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

const firebaseConfig = {
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || defaultFirebaseConfig.projectId,
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || defaultFirebaseConfig.appId,
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || defaultFirebaseConfig.apiKey,
  authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || defaultFirebaseConfig.authDomain,
  firestoreDatabaseId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_DATABASE_ID) || defaultFirebaseConfig.firestoreDatabaseId,
  storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || defaultFirebaseConfig.storageBucket,
  messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || defaultFirebaseConfig.messagingSenderId,
  measurementId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID) || defaultFirebaseConfig.measurementId,
  oAuthClientId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_OAUTH_CLIENT_ID) || defaultFirebaseConfig.oAuthClientId,
  recaptchaSiteKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_RECAPTCHA_KEY) || defaultFirebaseConfig.recaptchaSiteKey,
};

// Initialize Firebase App instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific databaseId if provisioned
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined
);

export const auth = getAuth(app);

// Collection References
export const COLLECTIONS = {
  CLIENTS: 'clients',
  GEMSTONES: 'gemstones',
  APPOINTMENTS: 'appointments',
  SALES_INVOICES: 'sales_invoices',
  PURCHASE_ORDERS: 'purchase_orders',
  USERS: 'users',
  AUDIT_LOGS: 'audit_logs',
  SAVED_CHARTS: 'saved_charts',
  STORE_SETTINGS: 'store_settings',
} as const;

export { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
};
