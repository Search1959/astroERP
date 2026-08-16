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
import firebaseConfig from '../../firebase-applet-config.json';

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
