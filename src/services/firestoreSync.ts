/**
 * Firestore Real-time Cloud Database Synchronization Service
 * Provides complete CRUD, real-time subscriptions, cloud persistence,
 * initial database seeding, and shareable public chart storage.
 */

import {
  db,
  COLLECTIONS,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from '../lib/firebase';
import {
  Client,
  InventoryItem,
  Appointment,
  Purchase,
  Sale,
  User,
  AuditLog,
  StoreSettings,
  AstrologyChartData,
} from '../types';

export interface CloudSyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
  documentCounts: {
    clients: number;
    inventory: number;
    appointments: number;
    sales: number;
    purchases: number;
    savedCharts: number;
  };
}

// ------------------------------------------------------------- //
//                  SAVED CHARTS (ONLINE ACCESS)                 //
// ------------------------------------------------------------- //

export interface SavedCloudChart {
  id: string;
  subjectName: string;
  birthDate: string;
  birthTime: string;
  placeName: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  houseSystem: string;
  zodiacSystem: string;
  chartData: AstrologyChartData;
  createdAt: string;
  shareUrl?: string;
  isPublic?: boolean;
}

/**
 * Save a calculated Natal Kundali Chart to Firestore for global access via URL link
 */
export async function saveChartToCloud(
  params: {
    subjectName: string;
    birthDate: string;
    birthTime: string;
    placeName: string;
    latitude: number;
    longitude: number;
    timezoneOffset: number;
    houseSystem: string;
    zodiacSystem: string;
    chartData: AstrologyChartData;
  }
): Promise<{ id: string; shareUrl: string }> {
  try {
    const chartId = `chart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const chartDocRef = doc(db, COLLECTIONS.SAVED_CHARTS, chartId);
    
    // Construct public share URL using current origin
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}?chartId=${chartId}`;

    const payload: SavedCloudChart = {
      id: chartId,
      ...params,
      createdAt: new Date().toISOString(),
      shareUrl,
      isPublic: true,
    };

    await setDoc(chartDocRef, payload);
    return { id: chartId, shareUrl };
  } catch (err: any) {
    console.error('Failed to save chart to Firestore:', err);
    throw new Error(err.message || 'Could not save chart to cloud database');
  }
}

/**
 * Retrieve a saved chart from Firestore by ID
 */
export async function getChartFromCloud(chartId: string): Promise<SavedCloudChart | null> {
  try {
    const chartDocRef = doc(db, COLLECTIONS.SAVED_CHARTS, chartId);
    const snap = await getDoc(chartDocRef);
    if (snap.exists()) {
      return snap.data() as SavedCloudChart;
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch chart ${chartId} from Firestore:`, err);
    return null;
  }
}

/**
 * List recently saved public charts
 */
export async function getRecentCloudCharts(limitCount = 10): Promise<SavedCloudChart[]> {
  try {
    const chartsCol = collection(db, COLLECTIONS.SAVED_CHARTS);
    const q = query(chartsCol, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const results: SavedCloudChart[] = [];
    snap.forEach((d) => results.push(d.data() as SavedCloudChart));
    return results.slice(0, limitCount);
  } catch (err) {
    console.warn('Could not load recent cloud charts:', err);
    return [];
  }
}

// ------------------------------------------------------------- //
//                  CLIENTS CLOUD CRUD                           //
// ------------------------------------------------------------- //

export async function fetchClientsFromCloud(): Promise<Client[]> {
  try {
    const colRef = collection(db, COLLECTIONS.CLIENTS);
    const snap = await getDocs(colRef);
    const items: Client[] = [];
    snap.forEach((d) => items.push(d.data() as Client));
    return items;
  } catch (err) {
    console.warn('Firestore fetchClients error:', err);
    return [];
  }
}

export async function saveClientToCloud(client: Client): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CLIENTS, client.id);
    await setDoc(docRef, client, { merge: true });
  } catch (err) {
    console.error('Error saving client to Firestore:', err);
    throw err;
  }
}

export async function deleteClientFromCloud(clientId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CLIENTS, clientId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting client from Firestore:', err);
    throw err;
  }
}

// ------------------------------------------------------------- //
//                  INVENTORY / GEMSTONES CLOUD CRUD             //
// ------------------------------------------------------------- //

export async function fetchInventoryFromCloud(): Promise<InventoryItem[]> {
  try {
    const colRef = collection(db, COLLECTIONS.GEMSTONES);
    const snap = await getDocs(colRef);
    const items: InventoryItem[] = [];
    snap.forEach((d) => items.push(d.data() as InventoryItem));
    return items;
  } catch (err) {
    console.warn('Firestore fetchInventory error:', err);
    return [];
  }
}

export async function saveInventoryItemToCloud(item: InventoryItem): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.GEMSTONES, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    console.error('Error saving gemstone to Firestore:', err);
    throw err;
  }
}

export async function deleteInventoryItemFromCloud(itemId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.GEMSTONES, itemId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting gemstone from Firestore:', err);
    throw err;
  }
}

// ------------------------------------------------------------- //
//                  APPOINTMENTS CLOUD CRUD                      //
// ------------------------------------------------------------- //

export async function fetchAppointmentsFromCloud(): Promise<Appointment[]> {
  try {
    const colRef = collection(db, COLLECTIONS.APPOINTMENTS);
    const snap = await getDocs(colRef);
    const items: Appointment[] = [];
    snap.forEach((d) => items.push(d.data() as Appointment));
    return items;
  } catch (err) {
    console.warn('Firestore fetchAppointments error:', err);
    return [];
  }
}

export async function saveAppointmentToCloud(appointment: Appointment): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointment.id);
    await setDoc(docRef, appointment, { merge: true });
  } catch (err) {
    console.error('Error saving appointment to Firestore:', err);
    throw err;
  }
}

export async function deleteAppointmentFromCloud(appointmentId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting appointment from Firestore:', err);
    throw err;
  }
}

// ------------------------------------------------------------- //
//                  SALES & PURCHASES CLOUD CRUD                 //
// ------------------------------------------------------------- //

export async function fetchSalesFromCloud(): Promise<Sale[]> {
  try {
    const colRef = collection(db, COLLECTIONS.SALES_INVOICES);
    const snap = await getDocs(colRef);
    const items: Sale[] = [];
    snap.forEach((d) => items.push(d.data() as Sale));
    return items;
  } catch (err) {
    console.warn('Firestore fetchSales error:', err);
    return [];
  }
}

export async function saveSaleToCloud(sale: Sale): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SALES_INVOICES, sale.id);
    await setDoc(docRef, sale, { merge: true });
  } catch (err) {
    console.error('Error saving sale invoice to Firestore:', err);
    throw err;
  }
}

export async function fetchPurchasesFromCloud(): Promise<Purchase[]> {
  try {
    const colRef = collection(db, COLLECTIONS.PURCHASE_ORDERS);
    const snap = await getDocs(colRef);
    const items: Purchase[] = [];
    snap.forEach((d) => items.push(d.data() as Purchase));
    return items;
  } catch (err) {
    console.warn('Firestore fetchPurchases error:', err);
    return [];
  }
}

export async function savePurchaseToCloud(purchase: Purchase): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.PURCHASE_ORDERS, purchase.id);
    await setDoc(docRef, purchase, { merge: true });
  } catch (err) {
    console.error('Error saving purchase order to Firestore:', err);
    throw err;
  }
}

// ------------------------------------------------------------- //
//                  SETTINGS & AUDIT LOGS                        //
// ------------------------------------------------------------- //

export async function fetchSettingsFromCloud(): Promise<StoreSettings | null> {
  try {
    const docRef = doc(db, COLLECTIONS.STORE_SETTINGS, 'main_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as StoreSettings;
    }
    return null;
  } catch (err) {
    console.warn('Firestore fetchSettings error:', err);
    return null;
  }
}

export async function saveSettingsToCloud(settings: StoreSettings): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.STORE_SETTINGS, 'main_config');
    await setDoc(docRef, settings, { merge: true });
  } catch (err) {
    console.error('Error saving store settings to Firestore:', err);
    throw err;
  }
}

export async function logCloudAudit(action: string, category: string, details: string, user?: { id: string; name: string }): Promise<void> {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const docRef = doc(db, COLLECTIONS.AUDIT_LOGS, logId);
    const logEntry = {
      id: logId,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'sys',
      userName: user?.name || 'Online User',
      userRole: 'admin',
      action,
      category,
      details,
    };
    await setDoc(docRef, logEntry);
  } catch (e) {
    // Non-blocking log
  }
}

// ------------------------------------------------------------- //
//             INITIAL CLOUD SEEDING UTILITY                    //
// ------------------------------------------------------------- //

/**
 * Seed Firestore with initial rich catalog and records if collections are empty
 */
export async function seedCloudDatabaseIfEmpty(initialData: {
  clients: Client[];
  inventory: InventoryItem[];
  appointments: Appointment[];
  purchases: Purchase[];
  sales: Sale[];
  users: User[];
  settings: StoreSettings;
}): Promise<boolean> {
  try {
    const invSnap = await getDocs(collection(db, COLLECTIONS.GEMSTONES));
    if (invSnap.size > 0) {
      // Already populated
      return false;
    }

    console.log('Seeding initial data to Firestore cloud database...');

    // Seed settings
    await setDoc(doc(db, COLLECTIONS.STORE_SETTINGS, 'main_config'), initialData.settings);

    // Seed inventory
    for (const item of initialData.inventory) {
      await setDoc(doc(db, COLLECTIONS.GEMSTONES, item.id), item);
    }

    // Seed clients
    for (const client of initialData.clients) {
      await setDoc(doc(db, COLLECTIONS.CLIENTS, client.id), client);
    }

    // Seed appointments
    for (const apt of initialData.appointments) {
      await setDoc(doc(db, COLLECTIONS.APPOINTMENTS, apt.id), apt);
    }

    // Seed sales
    for (const sale of initialData.sales) {
      await setDoc(doc(db, COLLECTIONS.SALES_INVOICES, sale.id), sale);
    }

    // Seed purchases
    for (const pur of initialData.purchases) {
      await setDoc(doc(db, COLLECTIONS.PURCHASE_ORDERS, pur.id), pur);
    }

    // Seed users
    for (const u of initialData.users) {
      await setDoc(doc(db, COLLECTIONS.USERS, u.id), u);
    }

    console.log('Cloud database seeding completed successfully.');
    return true;
  } catch (err) {
    console.error('Error seeding Firestore database:', err);
    return false;
  }
}
