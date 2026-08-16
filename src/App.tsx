/**
 * AstroERP - Hybrid Astrology Ephemeris & Back-Office ERP Platform
 * Main React Application Entry Point with Zero-Human-Overhead Automation:
 * - Single-Point Manual Entry at Add Stock / Inventory
 * - Automatic Purchase Order Logging for Inbound Stock & Restocking
 * - Automatic Sales Dispensing from Astrological Gemstone Prescriptions
 * - Excel / CSV Import with Auto-Purchase Generation
 * - Camera / Barcode Scanning for Live Stock & Procurement Intake
 */

import React, { useState, useEffect } from 'react';
import {
  AstrologyChartData,
  Client,
  Appointment,
  InventoryItem,
  Purchase,
  Sale,
  User,
  DashboardStats,
  AuditLog,
  StoreSettings,
  GemstoneRecommendation,
} from './types';

// Public Astrology Components
import { ChartCalculatorForm } from './components/PublicAstrology/ChartCalculatorForm';
import { NatalWheelChart } from './components/PublicAstrology/NatalWheelChart';
import { PlanetaryTable } from './components/PublicAstrology/PlanetaryTable';
import { AspectsMatrix } from './components/PublicAstrology/AspectsMatrix';
import { InterpretationView } from './components/PublicAstrology/InterpretationView';
import { PredictionsView } from './components/PublicAstrology/PredictionsView';
import { GemstonePrescription } from './components/PublicAstrology/GemstonePrescription';
import { PrintableReportModal } from './components/PublicAstrology/PrintableReportModal';
import { ComprehensivePredictionsWindow } from './components/PublicAstrology/ComprehensivePredictionsWindow';
import { LanguageSelector } from './components/Common/LanguageSelector';
import { LanguageCode } from './utils/indianLanguages';

// Back-Office ERP Components
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { ClientList } from './components/CRM/ClientList';
import { ClientDetailModal } from './components/CRM/ClientDetailModal';
import { ClientFormModal } from './components/CRM/ClientFormModal';
import { AppointmentCalendar } from './components/Calendar/AppointmentCalendar';
import { AppointmentFormModal } from './components/Calendar/AppointmentFormModal';
import { InventoryList } from './components/Inventory/InventoryList';
import { StoneFormModal } from './components/Inventory/StoneFormModal';
import { CsvImportModal } from './components/Inventory/CsvImportModal';
import { GemstoneScannerModal } from './components/Inventory/GemstoneScannerModal';
import { PurchaseList } from './components/Purchases/PurchaseList';
import { PurchaseEntryModal } from './components/Purchases/PurchaseEntryModal';
import { SalesList } from './components/Sales/SalesList';
import { SalesInvoiceModal } from './components/Sales/SalesInvoiceModal';
import { UserManagement } from './components/Admin/UserManagement';
import { SystemAuditLogs } from './components/Admin/SystemAuditLogs';
import { StoreSettingsView } from './components/Admin/StoreSettingsView';
import { LoginModal } from './components/Auth/LoginModal';
import { Navbar } from './components/Navbar';

// SEO and Cloud Database (Firestore) Sync Components & Services
import { SEOHead } from './components/SEO/SEOHead';
import { CloudDatabaseModal } from './components/Common/CloudDatabaseModal';
import {
  saveChartToCloud,
  getChartFromCloud,
  saveClientToCloud,
  deleteClientFromCloud,
  saveInventoryItemToCloud,
  deleteInventoryItemFromCloud,
  saveAppointmentToCloud,
  deleteAppointmentFromCloud,
  saveSaleToCloud,
  savePurchaseToCloud,
  saveSettingsToCloud,
} from './services/firestoreSync';

import {
  createAutoPurchaseForInventory,
  autoDispensePrescribedGemstone,
  autoProcureLowStockItems,
} from './utils/automationEngine';

import {
  Sparkles,
  Download,
  ArrowRight,
  ShieldCheck,
  Globe,
  Calendar,
  Gem,
  Users,
  AlertCircle,
  Cloud,
  Database,
  Camera,
  FileSpreadsheet,
  Zap,
  CheckCircle2,
  X,
} from 'lucide-react';
import { calculateFullAstrologyChart } from './utils/ephemerisEngine';
import {
  getLocalOrSeedData,
  saveLocalRecord,
  calculateDashboardStats,
  DEFAULT_USERS,
  DEFAULT_SETTINGS,
} from './data/initialDemoData';

export function App() {
  // Navigation - default to executive command center dashboard
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Application Data States
  const [chartData, setChartData] = useState<AstrologyChartData | null>(null);
  const [isCalculatingChart, setIsCalculatingChart] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('hi');

  // Modals & Selected items
  const [selectedClientForView, setSelectedClientForView] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isClientFormModalOpen, setIsClientFormModalOpen] = useState(false);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentPrefillClient, setAppointmentPrefillClient] = useState<Client | null>(null);

  const [isStoneModalOpen, setIsStoneModalOpen] = useState(false);
  const [stoneToEdit, setStoneToEdit] = useState<InventoryItem | null>(null);
  const [isCsvImportModalOpen, setIsCsvImportModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [scannerPurpose, setScannerPurpose] = useState<'stock_add' | 'purchase_scan' | 'sale_scan'>('stock_add');

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [salePrefillStone, setSalePrefillStone] = useState<InventoryItem | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isPredictionsWindowOpen, setIsPredictionsWindowOpen] = useState(false);

  // Live Toast Notification for Automation Feedbacks
  const [autoToast, setAutoToast] = useState<{
    id: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // Fetch initial data & handle deep links / SEO routes
  useEffect(() => {
    fetchInitialData();
  }, []);

  const showAutomationNotice = (
    title: string,
    description: string,
    actionLabel?: string,
    onAction?: () => void
  ) => {
    setAutoToast({
      id: 'toast_' + Date.now(),
      title,
      description,
      actionLabel,
      onAction,
    });
    setTimeout(() => {
      setAutoToast(current => (current?.title === title ? null : current));
    }, 6000);
  };

  const fetchInitialData = async () => {
    try {
      // 1. Immediately hydrate from robust local seed & storage (zero network latency, works 100% offline & on Vercel)
      const seed = getLocalOrSeedData();
      setClients(seed.clients);
      setInventory(seed.inventory);
      setAppointments(seed.appointments);
      setPurchases(seed.purchases);
      setSales(seed.sales);
      setSettings(seed.settings);
      setUsers(seed.users);
      setCurrentUser(seed.users[0] || null);
      setAuditLogs(seed.logs);
      setDashboardStats(calculateDashboardStats(seed.clients, seed.appointments, seed.inventory, seed.sales, seed.logs));

      // 2. Immediately calculate initial sample chart for public astrology view
      const initialChart = calculateFullAstrologyChart({
        name: 'Alexander Sterling',
        birthDate: '1992-07-24',
        birthTime: '14:30',
        placeName: 'London, UK',
        latitude: 51.5074,
        longitude: -0.1278,
        timezoneOffset: 0,
        houseSystem: 'placidus',
        zodiacSystem: 'tropical',
      });
      setChartData(initialChart);

      // 3. Check for deep-linked saved chart from Firestore via URL search params (e.g. ?chartId=chart_123)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const linkedChartId = urlParams.get('chartId');
        const linkedTab = urlParams.get('tab');

        if (linkedTab) {
          setActiveTab(linkedTab);
        }

        if (linkedChartId) {
          try {
            const cloudChart = await getChartFromCloud(linkedChartId);
            if (cloudChart && cloudChart.chartData) {
              setChartData(cloudChart.chartData);
              setActiveTab('astrology');
            }
          } catch (e) {
            console.warn('Cloud chart lookup:', e);
          }
        }
      }

      // 4. In parallel, attempt to sync with backend API if running in full-stack mode
      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          const json = await res.json();
          if (json && json.data !== undefined) return json.data;
          return json;
        } catch {
          return null;
        }
      };

      const [stats, clientsData, aptsData, invData, purData, salesData, usersData, logsData, setData] = await Promise.all([
        safeFetch('/api/dashboard/stats'),
        safeFetch('/api/clients'),
        safeFetch('/api/appointments'),
        safeFetch('/api/inventory'),
        safeFetch('/api/purchases'),
        safeFetch('/api/sales'),
        safeFetch('/api/users'),
        safeFetch('/api/audit-logs'),
        safeFetch('/api/settings'),
      ]);

      if (stats) setDashboardStats(stats);
      if (Array.isArray(clientsData) && clientsData.length > 0) {
        setClients(clientsData);
        saveLocalRecord('CLIENTS', clientsData);
      }
      if (Array.isArray(aptsData) && aptsData.length > 0) {
        setAppointments(aptsData);
        saveLocalRecord('APPOINTMENTS', aptsData);
      }
      if (Array.isArray(invData) && invData.length > 0) {
        setInventory(invData);
        saveLocalRecord('INVENTORY', invData);
      }
      if (Array.isArray(purData) && purData.length > 0) {
        setPurchases(purData);
        saveLocalRecord('PURCHASES', purData);
      }
      if (Array.isArray(salesData) && salesData.length > 0) {
        setSales(salesData);
        saveLocalRecord('SALES', salesData);
      }
      if (Array.isArray(usersData) && usersData.length > 0) {
        setUsers(usersData);
        setCurrentUser(usersData[0] || null);
        saveLocalRecord('USERS', usersData);
      }
      if (Array.isArray(logsData) && logsData.length > 0) {
        setAuditLogs(logsData);
        saveLocalRecord('LOGS', logsData);
      }
      if (setData) {
        setSettings(setData);
        saveLocalRecord('SETTINGS', setData);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  const refreshStats = (
    currentClients = clients,
    currentApts = appointments,
    currentInv = inventory,
    currentSales = sales,
    currentLogs = auditLogs
  ) => {
    const updated = calculateDashboardStats(currentClients, currentApts, currentInv, currentSales, currentLogs);
    setDashboardStats(updated);
  };

  // Calculate astrology chart via high-precision client engine + optional backend API
  const calculateAstrologyChart = async (formData: {
    name: string;
    birthDate: string;
    birthTime: string;
    placeName: string;
    latitude: number;
    longitude: number;
    timezoneOffset?: number;
    houseSystem: 'placidus' | 'equal' | 'whole_sign';
    zodiacSystem: 'tropical' | 'sidereal_lahiri';
  }) => {
    setIsCalculatingChart(true);
    try {
      // 1. Direct high-precision astronomical computation in-browser (Jean Meeus algorithm)
      const calculated = calculateFullAstrologyChart(formData);
      setChartData(calculated);

      // 2. Non-blocking background sync if backend server is available
      fetch('/api/astrology/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(r => r.json())
        .then(res => {
          if (res && res.success && res.data) {
            setChartData(res.data);
          }
        })
        .catch(() => {});
    } catch (err) {
      console.error('Failed to calculate astrology chart:', err);
    } finally {
      setIsCalculatingChart(false);
    }
  };

  // Attach Current Chart to a New or Existing Client in CRM
  const handleSaveChartAsClient = async () => {
    if (!chartData) return;
    try {
      const newClient: Client = {
        id: 'cli_' + Date.now(),
        name: chartData.subjectName,
        email: `${chartData.subjectName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: '',
        dateOfBirth: chartData.birthDate,
        timeOfBirth: chartData.birthTime,
        placeOfBirth: chartData.birthPlace,
        latitude: chartData.latitude,
        longitude: chartData.longitude,
        gender: 'Prefer not to say',
        tags: ['Natal Chart Lead', (chartData.interpretations.coreAscendant.sign || 'Aries') + ' Rising'],
        notes: `Ascendant: ${chartData.interpretations.coreAscendant.sign}, Sun: ${chartData.planets.find(p => p.name === 'Sun')?.sign}, Moon: ${chartData.planets.find(p => p.name === 'Moon')?.sign}. Recommended stone: ${chartData.interpretations.gemstoneRecommendations[0]?.stone}`,
        attachedCharts: [
          {
            id: 'chart_' + Date.now(),
            name: `${chartData.subjectName} - Natal Chart`,
            calculatedAt: new Date().toISOString(),
            sunSign: chartData.planets.find(p => p.name === 'Sun')?.sign || 'Sun',
            moonSign: chartData.planets.find(p => p.name === 'Moon')?.sign || 'Moon',
            ascendantSign: chartData.interpretations.coreAscendant.sign || 'Ascendant',
            chartData,
          },
        ],
        totalConsultations: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newClient, ...clients];
      setClients(updated);
      saveLocalRecord('CLIENTS', updated);
      refreshStats(updated);
      setActiveTab('clients');

      showAutomationNotice(
        'Client Profile Created from Natal Chart',
        `Saved ${newClient.name} with planetary placements and gemstone remedies.`
      );

      // Sync with Cloud & Backend silently
      saveClientToCloud(newClient).catch(() => {});
      fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  // Client Handlers
  const handleCreateOrUpdateClient = async (clientData: Partial<Client>) => {
    try {
      let updatedList: Client[] = [];
      let savedClient: Client;

      if (clientToEdit) {
        savedClient = {
          ...clientToEdit,
          ...clientData,
          updatedAt: new Date().toISOString(),
        } as Client;
        updatedList = clients.map(c => (c.id === clientToEdit.id ? savedClient : c));
      } else {
        savedClient = {
          id: 'cli_' + Date.now(),
          name: clientData.name || 'New Client',
          email: clientData.email || '',
          phone: clientData.phone || '',
          dateOfBirth: clientData.dateOfBirth || '1990-01-01',
          timeOfBirth: clientData.timeOfBirth || '12:00',
          placeOfBirth: clientData.placeOfBirth || 'London, UK',
          latitude: clientData.latitude || 51.5074,
          longitude: clientData.longitude || -0.1278,
          gender: clientData.gender || 'Prefer not to say',
          address: clientData.address || '',
          occupation: clientData.occupation || '',
          notes: clientData.notes || '',
          tags: clientData.tags || ['Client'],
          attachedCharts: clientData.attachedCharts || [],
          totalConsultations: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedList = [savedClient, ...clients];
      }

      setClients(updatedList);
      saveLocalRecord('CLIENTS', updatedList);
      refreshStats(updatedList);
      setIsClientFormModalOpen(false);
      setClientToEdit(null);

      // Cloud & API sync
      saveClientToCloud(savedClient).catch(() => {});
      if (clientToEdit) {
        fetch(`/api/clients/${clientToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedClient),
        }).catch(() => {});
      } else {
        fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedClient),
        }).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to remove this client profile?')) return;
    try {
      const updated = clients.filter(c => c.id !== clientId);
      setClients(updated);
      saveLocalRecord('CLIENTS', updated);
      refreshStats(updated);
      deleteClientFromCloud(clientId).catch(() => {});
      fetch(`/api/clients/${clientId}`, { method: 'DELETE' }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateClientNotes = async (clientId: string, notes: string) => {
    try {
      const updated = clients.map(c => (c.id === clientId ? { ...c, notes, updatedAt: new Date().toISOString() } : c));
      setClients(updated);
      saveLocalRecord('CLIENTS', updated);
      const target = updated.find(c => c.id === clientId);
      if (target) {
        saveClientToCloud(target).catch(() => {});
        fetch(`/api/clients/${clientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Appointment Handlers
  const handleCreateAppointment = async (aptData: Partial<Appointment>) => {
    try {
      const client = clients.find(c => c.id === aptData.clientId);
      const astrologer = users.find(u => u.id === aptData.astrologerId);

      const newApt: Appointment = {
        id: 'apt_' + Date.now(),
        clientId: aptData.clientId || (clients[0]?.id || ''),
        clientName: client?.name || aptData.clientName || 'Client',
        clientEmail: client?.email || aptData.clientEmail || '',
        clientPhone: client?.phone || aptData.clientPhone || '',
        astrologerId: aptData.astrologerId || (users[0]?.id || 'usr_1'),
        astrologerName: astrologer?.name || aptData.astrologerName || 'Astrologer',
        serviceType: aptData.serviceType || 'Kundli Reading & Gemstone Consultation',
        date: aptData.date || new Date().toISOString().split('T')[0],
        startTime: aptData.startTime || '10:00',
        endTime: aptData.endTime || '11:00',
        status: aptData.status || 'scheduled',
        fee: aptData.fee || 150,
        notes: aptData.notes || '',
        meetingLink: aptData.meetingLink || 'https://meet.google.com/xyz-jyotish',
        createdAt: new Date().toISOString(),
      };

      const updated = [newApt, ...appointments];
      setAppointments(updated);
      saveLocalRecord('APPOINTMENTS', updated);
      refreshStats(clients, updated);
      setIsAppointmentModalOpen(false);
      setAppointmentPrefillClient(null);

      saveAppointmentToCloud(newApt).catch(() => {});
      fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApt),
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      const updated = appointments.map(a => (a.id === id ? { ...a, status } : a));
      setAppointments(updated);
      saveLocalRecord('APPOINTMENTS', updated);
      refreshStats(clients, updated);
      const target = updated.find(a => a.id === id);
      if (target) {
        saveAppointmentToCloud(target).catch(() => {});
        fetch(`/api/appointments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      const updated = appointments.filter(a => a.id !== id);
      setAppointments(updated);
      saveLocalRecord('APPOINTMENTS', updated);
      refreshStats(clients, updated);
      deleteAppointmentFromCloud(id).catch(() => {});
      fetch(`/api/appointments/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================================
  // ZERO-HUMAN-OVERHEAD INVENTORY & AUTOMATION HANDLERS
  // =========================================================================

  /**
   * Add or update stone in inventory.
   * If adding a new stone and autoCreatePurchase is true, automatically
   * creates and records the corresponding purchase order without manual human entry.
   */
  const handleCreateOrUpdateStone = async (
    stoneData: Partial<InventoryItem>,
    autoCreatePurchase: boolean = true
  ) => {
    try {
      let updatedList: InventoryItem[] = [];
      let savedStone: InventoryItem;

      if (stoneToEdit) {
        savedStone = {
          ...stoneToEdit,
          ...stoneData,
          updatedAt: new Date().toISOString(),
        } as InventoryItem;
        updatedList = inventory.map(i => (i.id === stoneToEdit.id ? savedStone : i));
      } else {
        savedStone = {
          id: 'gem_' + Date.now(),
          sku: stoneData.sku || `GEM-${Date.now().toString().slice(-4)}`,
          name: stoneData.name || 'Natural Gemstone',
          categoryId: stoneData.categoryId || 'cat_yellow_sapphire',
          categoryName: stoneData.categoryName || 'Yellow Sapphire',
          weightCarats: stoneData.weightCarats || 4.5,
          weightRatti: stoneData.weightRatti || 5.0,
          purchasePrice: stoneData.purchasePrice || 500,
          salePrice: stoneData.salePrice || 1200,
          stockQuantity: stoneData.stockQuantity !== undefined ? stoneData.stockQuantity : 1,
          minStockThreshold: stoneData.minStockThreshold || 2,
          supplier: stoneData.supplier || 'Gemstone Supplier',
          origin: stoneData.origin || 'Ceylon, Sri Lanka',
          certificateNumber: stoneData.certificateNumber || `CERT-${Date.now().toString().slice(-6)}`,
          treatment: stoneData.treatment || 'Untreated',
          rulingPlanet: stoneData.rulingPlanet || 'Jupiter',
          clarity: stoneData.clarity || 'VVS',
          shapeCut: stoneData.shapeCut || 'Oval',
          imageUrl: stoneData.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
          notes: stoneData.notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedList = [savedStone, ...inventory];
      }

      setInventory(updatedList);
      saveLocalRecord('INVENTORY', updatedList);
      refreshStats(clients, appointments, updatedList);
      setIsStoneModalOpen(false);
      setStoneToEdit(null);

      // AUTO-PURCHASE WORKFLOW: No human contribution required for dealer purchases
      if (!stoneToEdit && autoCreatePurchase) {
        const autoPurchase = createAutoPurchaseForInventory([savedStone]);
        const updatedPurchases = [autoPurchase, ...purchases];
        setPurchases(updatedPurchases);
        saveLocalRecord('PURCHASES', updatedPurchases);

        savePurchaseToCloud(autoPurchase).catch(() => {});
        fetch('/api/purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(autoPurchase),
        }).catch(() => {});

        showAutomationNotice(
          '⚡ Auto-Purchase Logged',
          `Stock '${savedStone.name}' added & Purchase PO #${autoPurchase.purchaseOrderNumber || autoPurchase.invoiceNumber} auto-generated for ${savedStone.supplier}.`,
          'View Purchases',
          () => setActiveTab('purchases')
        );
      }

      saveInventoryItemToCloud(savedStone).catch(() => {});
      if (stoneToEdit) {
        fetch(`/api/inventory/${stoneToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedStone),
        }).catch(() => {});
      } else {
        fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedStone),
        }).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStone = async (id: string) => {
    if (!window.confirm('Delete this gemstone lot from inventory?')) return;
    try {
      const updated = inventory.filter(i => i.id !== id);
      setInventory(updated);
      saveLocalRecord('INVENTORY', updated);
      refreshStats(clients, appointments, updated);
      deleteInventoryItemFromCloud(id).catch(() => {});
      fetch(`/api/inventory/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Excel / CSV Bulk Stock Import with Auto-Purchase Generation
   */
  const handleBulkImportStones = async (
    importedItems: Partial<InventoryItem>[],
    autoGeneratePurchases: boolean = true
  ) => {
    try {
      const newItems: InventoryItem[] = importedItems.map((item, idx) => ({
        id: 'gem_' + (Date.now() + idx),
        sku: item.sku || `GEM-IMP-${Date.now().toString().slice(-4)}-${idx}`,
        name: item.name || 'Imported Gemstone',
        categoryId: item.categoryId || 'cat_yellow_sapphire',
        categoryName: item.categoryName || 'Yellow Sapphire',
        weightCarats: item.weightCarats || 4.0,
        weightRatti: item.weightRatti || 4.4,
        purchasePrice: item.purchasePrice || 400,
        salePrice: item.salePrice || 950,
        stockQuantity: item.stockQuantity || 1,
        minStockThreshold: item.minStockThreshold || 2,
        supplier: item.supplier || 'Import Lot',
        origin: item.origin || 'Sri Lanka',
        certificateNumber: item.certificateNumber || 'CERT-IMP',
        treatment: item.treatment || 'Untreated',
        rulingPlanet: item.rulingPlanet || 'Jupiter',
        clarity: item.clarity || 'VVS',
        shapeCut: item.shapeCut || 'Oval',
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
        notes: item.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const updated = [...newItems, ...inventory];
      setInventory(updated);
      saveLocalRecord('INVENTORY', updated);
      refreshStats(clients, appointments, updated);
      setIsCsvImportModalOpen(false);

      newItems.forEach(item => {
        saveInventoryItemToCloud(item).catch(() => {});
        fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        }).catch(() => {});
      });

      // AUTO PURCHASE CREATION FOR EXCEL IMPORT
      if (autoGeneratePurchases && newItems.length > 0) {
        const autoPurchase = createAutoPurchaseForInventory(newItems);
        const updatedPurchases = [autoPurchase, ...purchases];
        setPurchases(updatedPurchases);
        saveLocalRecord('PURCHASES', updatedPurchases);

        savePurchaseToCloud(autoPurchase).catch(() => {});
        fetch('/api/purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(autoPurchase),
        }).catch(() => {});

        showAutomationNotice(
          '⚡ Bulk Stock & Purchases Synchronized',
          `Imported ${newItems.length} gemstone lots & created purchase PO #${autoPurchase.purchaseOrderNumber || autoPurchase.invoiceNumber} automatically.`,
          'View Purchases',
          () => setActiveTab('purchases')
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Camera / Barcode Scanned Lot Processing
   */
  const handleScannedItem = (
    scannedItem: Partial<InventoryItem>,
    autoCreatePurchase: boolean = true
  ) => {
    setIsScannerModalOpen(false);
    handleCreateOrUpdateStone(scannedItem, autoCreatePurchase);
  };

  /**
   * Automatic Astrological Gemstone Dispensing
   * Decrements vault stock, automatically logs the sales invoice, and notifies astrologer.
   */
  const handleAutoDispenseGemstone = (
    recommendation: GemstoneRecommendation,
    targetClient?: Client
  ) => {
    const activeClient = targetClient || clients[0];
    if (!activeClient) {
      alert('Please select or register a client to dispense this gemstone.');
      return;
    }

    const result = autoDispensePrescribedGemstone(
      recommendation,
      activeClient,
      inventory,
      sales,
      users[0]?.name || 'Acharya Rajesh Sharma'
    );

    setInventory(result.updatedInventory);
    saveLocalRecord('INVENTORY', result.updatedInventory);

    if (result.newSale) {
      const updatedSales = [result.newSale, ...sales];
      setSales(updatedSales);
      saveLocalRecord('SALES', updatedSales);
      refreshStats(clients, appointments, result.updatedInventory, updatedSales);

      saveSaleToCloud(result.newSale).catch(() => {});
      fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.newSale),
      }).catch(() => {});

      showAutomationNotice(
        '⚡ Auto-Sale Invoice Issued',
        `${result.matchedItem?.name || recommendation.stone} auto-dispensed for ${activeClient.name}. Invoice #${result.newSale.invoiceNumber} generated!`,
        'View Invoices',
        () => setActiveTab('sales')
      );
    }
  };

  /**
   * 1-Click Auto-Procure All Low Stock Items
   */
  const handleAutoRestockAll = () => {
    const result = autoProcureLowStockItems(inventory, purchases);
    if (!result.createdPurchase) {
      showAutomationNotice('Stock Levels Healthy', 'All gemstone lots meet minimum threshold.');
      return;
    }

    setInventory(result.updatedInventory);
    const updatedPurchases = [result.createdPurchase, ...purchases];
    setPurchases(updatedPurchases);
    saveLocalRecord('INVENTORY', result.updatedInventory);
    saveLocalRecord('PURCHASES', updatedPurchases);
    refreshStats(clients, appointments, result.updatedInventory, sales);

    savePurchaseToCloud(result.createdPurchase).catch(() => {});
    fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.createdPurchase),
    }).catch(() => {});

    showAutomationNotice(
      '⚡ Auto-Procurement Complete',
      `Restocked ${result.replenishedCount} lots with Purchase PO #${result.createdPurchase.purchaseOrderNumber || result.createdPurchase.invoiceNumber}.`,
      'View Purchases',
      () => setActiveTab('purchases')
    );
  };

  // Purchases Handlers
  const handleCreatePurchase = async (purchaseData: Partial<Purchase>) => {
    try {
      const newPurchase: Purchase = {
        id: 'pur_' + Date.now(),
        invoiceNumber: purchaseData.invoiceNumber || `PUR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        purchaseOrderNumber: purchaseData.purchaseOrderNumber || `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        supplierName: purchaseData.supplierName || 'Gem Supplier',
        supplierContact: purchaseData.supplierContact || '',
        purchaseDate: purchaseData.purchaseDate || new Date().toISOString().split('T')[0],
        items: purchaseData.items || [],
        subtotal: purchaseData.subtotal || 0,
        taxAmount: purchaseData.taxAmount || 0,
        grandTotal: purchaseData.grandTotal || 0,
        status: purchaseData.status || 'received',
        paymentStatus: purchaseData.paymentStatus || 'Paid',
        notes: purchaseData.notes || '',
        createdAt: new Date().toISOString(),
      };

      const updatedPurchases = [newPurchase, ...purchases];
      setPurchases(updatedPurchases);
      saveLocalRecord('PURCHASES', updatedPurchases);

      // Increase stock of purchased items
      const updatedInventory = inventory.map(item => {
        const matchingPurchased = newPurchase.items.find(pi => pi.stoneId === item.id);
        if (matchingPurchased) {
          return {
            ...item,
            stockQuantity: item.stockQuantity + matchingPurchased.quantity,
          };
        }
        return item;
      });

      setInventory(updatedInventory);
      saveLocalRecord('INVENTORY', updatedInventory);
      refreshStats(clients, appointments, updatedInventory, sales);
      setIsPurchaseModalOpen(false);

      savePurchaseToCloud(newPurchase).catch(() => {});
      fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPurchase),
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  // Sales Handlers
  const handleCreateSale = async (saleData: Partial<Sale>) => {
    try {
      const newSale: Sale = {
        id: 'inv_' + Date.now(),
        invoiceNumber: saleData.invoiceNumber || `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        clientId: saleData.clientId || (clients[0]?.id || ''),
        clientName: saleData.clientName || 'Client',
        clientPhone: saleData.clientPhone || '',
        clientEmail: saleData.clientEmail || '',
        clientAddress: saleData.clientAddress || '',
        saleDate: saleData.saleDate || new Date().toISOString().split('T')[0],
        items: saleData.items || [],
        subtotal: saleData.subtotal || 0,
        discountAmount: saleData.discountAmount || 0,
        taxRatePercent: saleData.taxRatePercent || 5,
        taxAmount: saleData.taxAmount || 0,
        grandTotal: saleData.grandTotal || 0,
        paymentMethod: saleData.paymentMethod || 'Credit/Debit Card',
        astrologerRecommended: saleData.astrologerRecommended || (users[0]?.name || 'Acharya Rajesh Sharma'),
        prescriptionDetails: saleData.prescriptionDetails || '',
        notes: saleData.notes || '',
        createdAt: new Date().toISOString(),
      };

      const updatedSales = [newSale, ...sales];
      setSales(updatedSales);
      saveLocalRecord('SALES', updatedSales);

      // Deduct stock for sold items
      const updatedInventory = inventory.map(item => {
        const matchingSold = newSale.items.find(si => si.stoneId === item.id);
        if (matchingSold) {
          return {
            ...item,
            stockQuantity: Math.max(0, item.stockQuantity - matchingSold.quantity),
          };
        }
        return item;
      });

      setInventory(updatedInventory);
      saveLocalRecord('INVENTORY', updatedInventory);
      refreshStats(clients, appointments, updatedInventory, updatedSales);
      setIsSaleModalOpen(false);

      saveSaleToCloud(newSale).catch(() => {});
      fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale),
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  // Admin & Settings Handlers
  const handleAddUser = (user: User) => {
    const updated = [...users, user];
    setUsers(updated);
    saveLocalRecord('USERS', updated);
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveLocalRecord('USERS', updated);
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    saveLocalRecord('SETTINGS', newSettings);
    saveSettingsToCloud(newSettings).catch(() => {});
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    }).catch(() => {});
  };

  const currencySymbol = settings?.currencySymbol || '$';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row font-sans antialiased selection:bg-indigo-600 selection:text-white relative w-full">
      {/* Comprehensive SEO Meta Tags */}
      <SEOHead
        activeTab={activeTab}
        chartData={chartData}
        pageTitle={
          activeTab === 'astrology'
            ? 'Free Kundli & Ephemeris Calculator | AstroERP'
            : activeTab === 'inventory'
            ? 'Certified Gemstone Vault & Automation | AstroERP'
            : 'Astrology ERP & Jyotish Practice Management'
        }
        pageDescription="AstroERP is an automated astrological ERP platform with zero-human-overhead inventory, auto-purchases, auto-dispensing, and ephemeris calculations."
      />

      {/* Sidebar Navigation (Desktop Fixed Sidebar / Mobile Top Bar) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        settings={settings}
      />

      {/* Main Right-Side Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:h-screen lg:overflow-hidden bg-slate-900">
        {/* Zero Overhead Automation Quick Status Banner (Placed at the top of content pane) */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-200">Zero-Human-Overhead Active:</span>
            <span>Manual Entry restricted to Add Stock. Dealer Purchases & Sales Invoicing auto-synchronized.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setScannerPurpose('stock_add');
                setIsScannerModalOpen(true);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              Camera Scan
            </button>
            <button
              onClick={() => setIsCsvImportModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel Import
            </button>
          </div>
        </div>

        {/* Scrollable Main Viewport Container */}
        <div className="flex-1 overflow-y-auto w-full">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 w-full">
            {/* ========================================================================= */}
            {/* VIEW 1: Public Astrology Kundli & Ephemeris Calculator                    */}
            {/* ========================================================================= */}
          {activeTab === 'astrology' && (
            <div className="space-y-8">
              {/* Top Banner & Language Selector */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/90 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <div>
                  <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                    Ephemeris Calculation & Kundli Engine
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    High-precision Swiss Ephemeris astronomical positions, Vedic Vimshottari Dasha, and Ratna Jyotish.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    onSelectLanguage={setSelectedLanguage}
                  />
                  {chartData && (
                    <>
                      <button
                        id="btn-open-predictions-window-top"
                        onClick={() => setIsPredictionsWindowOpen(true)}
                        className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        Predictions Window
                      </button>
                      <button
                        onClick={() => setIsPdfModalOpen(true)}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Export PDF
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Calculator Form */}
              <ChartCalculatorForm
                onCalculate={calculateAstrologyChart}
                isLoading={isCalculatingChart}
              />

              {/* Computed Chart & Analysis Components */}
              {chartData && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Subject Header & Quick Client Save */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800">
                        Natal Ephemeris Generated
                      </span>
                      <h2 className="text-xl font-bold text-white mt-2">
                        {chartData.subjectName}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Born {chartData.birthDate} at {chartData.birthTime} • {chartData.birthPlace} (Lat: {chartData.latitude.toFixed(2)}, Lon: {chartData.longitude.toFixed(2)})
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        id="btn-open-predictions-window-banner"
                        onClick={() => setIsPredictionsWindowOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        View Weekly / Monthly / Yearly Predictions
                      </button>
                      <button
                        id="btn-save-as-client"
                        onClick={handleSaveChartAsClient}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-indigo-400" />
                        Save to CRM
                      </button>
                    </div>
                  </div>

                  {/* Natal Wheel and Interpretations */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-6 flex flex-col items-center bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2 self-start">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Planetary Natal Wheel Chart
                      </h3>
                      <NatalWheelChart chartData={chartData} size={480} />
                    </div>

                    <div className="lg:col-span-6">
                      <InterpretationView
                        interpretations={chartData.interpretations}
                        subjectName={chartData.subjectName}
                        selectedLanguage={selectedLanguage}
                      />
                    </div>
                  </div>

                  {/* Gemstone Prescriptions with 1-Click Auto-Dispensing */}
                  <GemstonePrescription
                    recommendations={chartData.interpretations.gemstoneRecommendations}
                    subjectName={chartData.subjectName}
                    selectedLanguage={selectedLanguage}
                    onNavigateToVault={() => setActiveTab('inventory')}
                    onAutoDispense={rec => handleAutoDispenseGemstone(rec, clients[0])}
                  />

                  {/* Planetary Positions & Vedic Dashas */}
                  <PlanetaryTable
                    chartData={chartData}
                    selectedLanguage={selectedLanguage}
                  />

                  {/* Planetary Aspects Matrix */}
                  <AspectsMatrix
                    aspects={chartData.aspects || []}
                  />

                  {/* AI & Predictive Timelines */}
                  <PredictionsView
                    chartData={chartData}
                    selectedLanguage={selectedLanguage}
                    onOpenDedicatedWindow={() => setIsPredictionsWindowOpen(true)}
                  />
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: Back-Office Executive Dashboard                                   */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <OverviewDashboard
              stats={dashboardStats}
              currentUser={currentUser}
              inventory={inventory}
              clients={clients}
              appointments={appointments}
              sales={sales}
              chartData={chartData}
              onNavigateTab={setActiveTab}
              onOpenNewClientModal={() => {
                setClientToEdit(null);
                setIsClientFormModalOpen(true);
              }}
              onOpenNewAppointmentModal={() => {
                setAppointmentPrefillClient(null);
                setIsAppointmentModalOpen(true);
              }}
              onOpenNewSaleModal={() => {
                setSalePrefillStone(null);
                setIsSaleModalOpen(true);
              }}
              onOpenNewStoneModal={() => {
                setStoneToEdit(null);
                setIsStoneModalOpen(true);
              }}
              onOpenScannerModal={() => {
                setScannerPurpose('stock_add');
                setIsScannerModalOpen(true);
              }}
              onOpenCsvImportModal={() => setIsCsvImportModalOpen(true)}
              onOpenPredictionsWindow={() => {
                if (chartData) {
                  setIsPredictionsWindowOpen(true);
                } else {
                  calculateAstrologyChart({
                    name: 'Ananya Sharma',
                    birthDate: '1995-11-18',
                    birthTime: '09:15',
                    placeName: 'New Delhi, India',
                    latitude: 28.6139,
                    longitude: 77.2090,
                    timezoneOffset: 5.5,
                    houseSystem: 'placidus',
                    zodiacSystem: 'tropical',
                  });
                  setIsPredictionsWindowOpen(true);
                }
              }}
              onQuickCalculate={(name, date, time) => {
                calculateAstrologyChart({
                  name: name,
                  birthDate: date,
                  birthTime: time,
                  placeName: 'New Delhi, India',
                  latitude: 28.6139,
                  longitude: 77.2090,
                  timezoneOffset: 5.5,
                  houseSystem: 'placidus',
                  zodiacSystem: 'tropical',
                });
                setActiveTab('astrology');
              }}
              currencySymbol={currencySymbol}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: Client CRM & Consultations                                       */}
          {/* ========================================================================= */}
          {activeTab === 'clients' && (
            <ClientList
              clients={clients}
              onSelectClient={c => setSelectedClientForView(c)}
              onEditClient={c => {
                setClientToEdit(c);
                setIsClientFormModalOpen(true);
              }}
              onDeleteClient={handleDeleteClient}
              onOpenNewClientModal={() => {
                setClientToEdit(null);
                setIsClientFormModalOpen(true);
              }}
              onBookAppointmentForClient={c => {
                setAppointmentPrefillClient(c);
                setIsAppointmentModalOpen(true);
              }}
              currencySymbol={currencySymbol}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: Appointment Calendar                                             */}
          {/* ========================================================================= */}
          {activeTab === 'calendar' && (
            <AppointmentCalendar
              appointments={appointments}
              clients={clients}
              astrologers={users.filter(u => u.role === 'astrologer' || u.role === 'super_admin' || u.role === 'admin')}
              onOpenBookingModal={prefillClient => {
                setAppointmentPrefillClient(prefillClient || null);
                setIsAppointmentModalOpen(true);
              }}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              onDeleteAppointment={handleDeleteAppointment}
              currencySymbol={currencySymbol}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: Gemstone Inventory Vault (Zero-Overhead Hub)                      */}
          {/* ========================================================================= */}
          {activeTab === 'inventory' && (
            <InventoryList
              inventory={inventory}
              onOpenAddStoneModal={() => {
                setStoneToEdit(null);
                setIsStoneModalOpen(true);
              }}
              onEditStone={item => {
                setStoneToEdit(item);
                setIsStoneModalOpen(true);
              }}
              onDeleteStone={handleDeleteStone}
              onOpenCsvImportModal={() => setIsCsvImportModalOpen(true)}
              onOpenScanner={() => {
                setScannerPurpose('stock_add');
                setIsScannerModalOpen(true);
              }}
              onAutoRestockAll={handleAutoRestockAll}
              onIssueSaleForStone={item => {
                setSalePrefillStone(item);
                setIsSaleModalOpen(true);
              }}
              currencySymbol={currencySymbol}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: Supplier Purchases & Auto-Procurement                              */}
          {/* ========================================================================= */}
          {activeTab === 'purchases' && (
            <PurchaseList
              purchases={purchases}
              inventory={inventory}
              onOpenNewPurchaseModal={() => setIsPurchaseModalOpen(true)}
              onOpenScanner={() => {
                setScannerPurpose('purchase_scan');
                setIsScannerModalOpen(true);
              }}
              onAutoRestockAll={handleAutoRestockAll}
              currencySymbol={currencySymbol}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW 7: Sales & Auto-Dispensed Invoicing                                  */}
          {/* ========================================================================= */}
          {activeTab === 'sales' && (
            <SalesList
              sales={sales}
              clients={clients}
              inventory={inventory}
              onOpenNewSaleModal={() => {
                setSalePrefillStone(null);
                setIsSaleModalOpen(true);
              }}
              onOpenScanner={() => {
                setScannerPurpose('sale_scan');
                setIsScannerModalOpen(true);
              }}
              currencySymbol={currencySymbol}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW 8: User Accounts & Audit Logs                                       */}
          {/* ========================================================================= */}
          {activeTab === 'admin' && (
            <div className="space-y-8">
              <UserManagement
                users={users}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
              />
              <SystemAuditLogs logs={auditLogs} />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 9: System Settings                                                  */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <StoreSettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>
    </div>

      {/* Floating Auto-Notification Toast */}
      {autoToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900/95 border border-emerald-500/50 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-300">{autoToast.title}</h4>
                <button
                  onClick={() => setAutoToast(null)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">{autoToast.description}</p>
              {autoToast.actionLabel && autoToast.onAction && (
                <button
                  onClick={() => {
                    autoToast.onAction?.();
                    setAutoToast(null);
                  }}
                  className="mt-2 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                >
                  {autoToast.actionLabel} &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}

      {/* Camera / Barcode Scanning Modal */}
      <GemstoneScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onStoneScanned={handleScannedItem}
        mode={scannerPurpose}
      />

      {/* Client Detail Drawer / Modal */}
      <ClientDetailModal
        client={selectedClientForView}
        isOpen={!!selectedClientForView}
        onClose={() => setSelectedClientForView(null)}
        onUpdateNotes={handleUpdateClientNotes}
        onBookAppointment={c => {
          setSelectedClientForView(null);
          setAppointmentPrefillClient(c);
          setIsAppointmentModalOpen(true);
        }}
        onAutoDispenseGemstone={(rec, cl) => handleAutoDispenseGemstone(rec, cl)}
        currencySymbol={currencySymbol}
      />

      {/* Client Create / Edit Modal */}
      <ClientFormModal
        isOpen={isClientFormModalOpen}
        onClose={() => setIsClientFormModalOpen(false)}
        onSubmit={handleCreateOrUpdateClient}
        editingClient={clientToEdit}
      />

      {/* Appointment Booking Modal */}
      <AppointmentFormModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSubmit={handleCreateAppointment}
        clients={clients}
        astrologers={users.filter(u => u.role === 'astrologer' || u.role === 'admin')}
        prefillClient={appointmentPrefillClient}
      />

      {/* Gemstone Lot Modal (Single-Point Manual Entry) */}
      <StoneFormModal
        isOpen={isStoneModalOpen}
        onClose={() => setIsStoneModalOpen(false)}
        onSubmit={(stoneData, autoCreatePurchase) => handleCreateOrUpdateStone(stoneData, autoCreatePurchase)}
        editingStone={stoneToEdit}
      />

      {/* CSV / Excel Bulk Import Modal */}
      <CsvImportModal
        isOpen={isCsvImportModalOpen}
        onClose={() => setIsCsvImportModalOpen(false)}
        onImport={(items, autoPurchases) => handleBulkImportStones(items, autoPurchases)}
      />

      {/* Purchase Entry Modal */}
      <PurchaseEntryModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSubmit={handleCreatePurchase}
        inventory={inventory}
      />

      {/* Sales Invoice Modal */}
      <SalesInvoiceModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSubmit={handleCreateSale}
        clients={clients}
        inventory={inventory}
        prefillStone={salePrefillStone}
      />

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        currentUser={currentUser}
        onSwitchUser={u => setCurrentUser(u)}
      />

      {/* Cloud Database & SEO Manager Modal */}
      <CloudDatabaseModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        chartData={chartData}
        clients={clients}
        inventory={inventory}
        appointments={appointments}
        purchases={purchases}
        sales={sales}
        users={users}
        settings={settings}
        onLoadSavedChart={cloudChart => {
          setChartData(cloudChart.chartData);
          setActiveTab('astrology');
        }}
      />

      {/* Natal Chart PDF Preview Modal */}
      {chartData && (
        <PrintableReportModal
          chartData={chartData}
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          currencySymbol={currencySymbol}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />
      )}

      {/* Comprehensive Dedicated Predictions Window (Weekly, Monthly, Yearly + Birth Details) */}
      {chartData && (
        <ComprehensivePredictionsWindow
          chartData={chartData}
          isOpen={isPredictionsWindowOpen}
          onClose={() => setIsPredictionsWindowOpen(false)}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          currencySymbol={currencySymbol}
          onAutoDispenseGemstone={rec => handleAutoDispenseGemstone(rec, clients[0])}
        />
      )}
    </div>
  );
}

export default App;
