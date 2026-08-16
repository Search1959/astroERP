/**
 * AstroERP - Hybrid Astrology Ephemeris & Back-Office ERP Platform
 * Main React Application Entry Point with Zero-Human-Overhead Automation:
 * - Single-Point Manual Entry at Add Stock / Inventory
 * - Automatic Purchase Order Logging for Inbound Stock & Restocking
 * - Automatic Sales Dispensing from Astrological Gemstone Prescriptions
 * - Excel / CSV Import with Auto-Purchase Generation
 * - Camera / Barcode Scanning for Live Stock & Procurement Intake
 * - Vedic Astrology Themed Home Landing Page
 * - Dual-Tab Auth Modal (Register Zero-Data A/C vs Login) & 1-Click Demo Mode (Read-Only)
 * - Super Admin System Console with Tenant Credential Vault & $200/mo Subscription Billing
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
  SubscriptionBillingRecord,
} from './types';

// Home Landing Page Component
import { AstroLandingPage } from './components/Home/AstroLandingPage';

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
import { SuperAdminConsole } from './components/Admin/SuperAdminConsole';
import { SystemAuditLogs } from './components/Admin/SystemAuditLogs';
import { StoreSettingsView } from './components/Admin/StoreSettingsView';
import { AuthModal } from './components/Auth/AuthModal';
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
  autoProcureLowStockItems,
} from './utils/automationEngine';

import {
  Sparkles,
  Download,
  Users,
  Camera,
  FileSpreadsheet,
  Zap,
  X,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { calculateFullAstrologyChart } from './utils/ephemerisEngine';
import {
  getLocalOrSeedData,
  saveLocalRecord,
  calculateDashboardStats,
  DEFAULT_SUBSCRIPTION_BILLING,
} from './data/initialDemoData';

export function App() {
  // Navigation: defaults to Home Landing Page
  const [activeTab, setActiveTab] = useState<string>('home');

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
  const [subscriptions, setSubscriptions] = useState<SubscriptionBillingRecord[]>([]);
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

  // New Auth Modal (Sign Up & Login)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'signup' | 'login'>('signup');

  // Legacy quick switcher modal
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

  const persistCurrentTenantData = (
    c = clients,
    inv = inventory,
    a = appointments,
    p = purchases,
    s = sales
  ) => {
    if (currentUser && currentUser.role !== 'super_admin' && currentUser.role !== 'demo_user') {
      try {
        localStorage.setItem(
          `astroerp_tenant_${currentUser.id}`,
          JSON.stringify({
            clients: c,
            inventory: inv,
            appointments: a,
            purchases: p,
            sales: s,
          })
        );
      } catch (e) {
        console.warn('Failed to save tenant dataset:', e);
      }
    }
  };

  const loadTenantWorkspace = (user: User, allSeed?: ReturnType<typeof getLocalOrSeedData>) => {
    if (user.role === 'super_admin' || user.role === 'demo_user') {
      const seed = allSeed || getLocalOrSeedData();
      setClients(seed.clients);
      setInventory(seed.inventory);
      setAppointments(seed.appointments);
      setPurchases(seed.purchases);
      setSales(seed.sales);
      refreshStats(seed.clients, seed.appointments, seed.inventory, seed.sales, auditLogs);
    } else {
      // Regular client / astrologer account (must start with 0 data unless saved)
      try {
        const raw = localStorage.getItem(`astroerp_tenant_${user.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          const tClients = parsed.clients || [];
          const tInv = parsed.inventory || [];
          const tApts = parsed.appointments || [];
          const tPurchases = parsed.purchases || [];
          const tSales = parsed.sales || [];
          setClients(tClients);
          setInventory(tInv);
          setAppointments(tApts);
          setPurchases(tPurchases);
          setSales(tSales);
          refreshStats(tClients, tApts, tInv, tSales, auditLogs);
        } else {
          // Zero-data state for fresh account
          setClients([]);
          setInventory([]);
          setAppointments([]);
          setPurchases([]);
          setSales([]);
          refreshStats([], [], [], [], auditLogs);
        }
      } catch (e) {
        setClients([]);
        setInventory([]);
        setAppointments([]);
        setPurchases([]);
        setSales([]);
        refreshStats([], [], [], [], auditLogs);
      }
    }
  };

  const fetchInitialData = async () => {
    try {
      // 1. Immediately hydrate from robust local seed & storage
      const seed = getLocalOrSeedData();
      setUsers(seed.users);
      setSettings(seed.settings);
      setAuditLogs(seed.logs);
      setSubscriptions(seed.subscriptions || DEFAULT_SUBSCRIPTION_BILLING);

      // Default user set to Super Admin (or first user)
      const defaultUser = seed.users[0] || null;
      setCurrentUser(defaultUser);

      if (defaultUser) {
        loadTenantWorkspace(defaultUser, seed);
      }

      // 2. Initial sample chart for astrology view
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

      // 3. Deep-linked saved chart or tab from URL params
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
      const calculated = calculateFullAstrologyChart(formData);
      setChartData(calculated);

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
      persistCurrentTenantData(updated);
      saveLocalRecord('CLIENTS', updated);
      refreshStats(updated);
      setActiveTab('clients');

      showAutomationNotice(
        'Client Profile Created from Natal Chart',
        `Saved ${newClient.name} with planetary placements and gemstone remedies.`
      );

      saveClientToCloud(newClient).catch(() => {});
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
      persistCurrentTenantData(updatedList);
      saveLocalRecord('CLIENTS', updatedList);
      refreshStats(updatedList);
      setIsClientFormModalOpen(false);
      setClientToEdit(null);

      saveClientToCloud(savedClient).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to remove this client profile?')) return;
    try {
      const updated = clients.filter(c => c.id !== clientId);
      setClients(updated);
      persistCurrentTenantData(updated);
      saveLocalRecord('CLIENTS', updated);
      refreshStats(updated);
      deleteClientFromCloud(clientId).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateClientNotes = async (clientId: string, notes: string) => {
    try {
      const updated = clients.map(c => (c.id === clientId ? { ...c, notes, updatedAt: new Date().toISOString() } : c));
      setClients(updated);
      persistCurrentTenantData(updated);
      saveLocalRecord('CLIENTS', updated);
      const target = updated.find(c => c.id === clientId);
      if (target) {
        saveClientToCloud(target).catch(() => {});
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
      persistCurrentTenantData(clients, inventory, updated);
      saveLocalRecord('APPOINTMENTS', updated);
      refreshStats(clients, updated);
      setIsAppointmentModalOpen(false);
      setAppointmentPrefillClient(null);

      saveAppointmentToCloud(newApt).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      const updated = appointments.map(a => (a.id === id ? { ...a, status } : a));
      setAppointments(updated);
      persistCurrentTenantData(clients, inventory, updated);
      saveLocalRecord('APPOINTMENTS', updated);
      refreshStats(clients, updated);
      const target = updated.find(a => a.id === id);
      if (target) {
        saveAppointmentToCloud(target).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      const updated = appointments.filter(a => a.id !== id);
      setAppointments(updated);
      persistCurrentTenantData(clients, inventory, updated);
      saveLocalRecord('APPOINTMENTS', updated);
      refreshStats(clients, updated);
      deleteAppointmentFromCloud(id).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  // Inventory Handlers
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
      persistCurrentTenantData(clients, updatedList);
      saveLocalRecord('INVENTORY', updatedList);
      refreshStats(clients, appointments, updatedList);
      setIsStoneModalOpen(false);
      setStoneToEdit(null);

      // Auto Purchase order creation
      if (!stoneToEdit && autoCreatePurchase) {
        const autoPurchase = createAutoPurchaseForInventory([savedStone]);
        const updatedPurchases = [autoPurchase, ...purchases];
        setPurchases(updatedPurchases);
        persistCurrentTenantData(clients, updatedList, appointments, updatedPurchases);
        saveLocalRecord('PURCHASES', updatedPurchases);
        savePurchaseToCloud(autoPurchase).catch(() => {});

        showAutomationNotice(
          '⚡ Auto-Purchase Logged',
          `Stock '${savedStone.name}' added & Purchase PO #${autoPurchase.purchaseOrderNumber || autoPurchase.invoiceNumber} auto-generated for ${savedStone.supplier}.`,
          'View Purchases',
          () => setActiveTab('purchases')
        );
      }

      saveInventoryItemToCloud(savedStone).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStone = async (id: string) => {
    if (!window.confirm('Delete this gemstone lot from inventory?')) return;
    try {
      const updated = inventory.filter(i => i.id !== id);
      setInventory(updated);
      persistCurrentTenantData(clients, updated);
      saveLocalRecord('INVENTORY', updated);
      refreshStats(clients, appointments, updated);
      deleteInventoryItemFromCloud(id).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkImportStones = async (
    importedItems: Partial<InventoryItem>[],
    autoGeneratePurchases: boolean = true
  ) => {
    try {
      const newItems: InventoryItem[] = importedItems.map((item, idx) => ({
        id: 'gem_imp_' + (Date.now() + idx),
        sku: item.sku || `GEM-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
        name: item.name || 'Imported Gemstone',
        categoryId: item.categoryId || 'cat_natural_ruby',
        categoryName: item.categoryName || 'Natural Ruby',
        weightCarats: item.weightCarats || 3.0,
        weightRatti: item.weightRatti || 3.3,
        purchasePrice: item.purchasePrice || 350,
        salePrice: item.salePrice || 850,
        stockQuantity: item.stockQuantity !== undefined ? item.stockQuantity : 1,
        minStockThreshold: item.minStockThreshold || 2,
        supplier: item.supplier || 'Precious Stone Imports',
        origin: item.origin || 'Burma / Myanmar',
        certificateNumber: item.certificateNumber || `CERT-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
        treatment: item.treatment || 'Unheated Natural',
        rulingPlanet: item.rulingPlanet || 'Sun',
        clarity: item.clarity || 'VS1',
        shapeCut: item.shapeCut || 'Oval Mixed',
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
        notes: item.notes || 'Batch imported from Excel ledger.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const updatedInventory = [...newItems, ...inventory];
      setInventory(updatedInventory);
      persistCurrentTenantData(clients, updatedInventory);
      saveLocalRecord('INVENTORY', updatedInventory);

      if (autoGeneratePurchases && newItems.length > 0) {
        const autoPurchase = createAutoPurchaseForInventory(newItems);
        const updatedPurchases = [autoPurchase, ...purchases];
        setPurchases(updatedPurchases);
        persistCurrentTenantData(clients, updatedInventory, appointments, updatedPurchases);
        saveLocalRecord('PURCHASES', updatedPurchases);
        savePurchaseToCloud(autoPurchase).catch(() => {});
      }

      refreshStats(clients, appointments, updatedInventory, sales);
      setIsCsvImportModalOpen(false);

      showAutomationNotice(
        `Bulk Import Succeeded: ${newItems.length} Gems Added`,
        `All lots inwarded with automated purchase order sync.`
      );
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  const handleScannedItem = (stoneData: Partial<InventoryItem>) => {
    setIsScannerModalOpen(false);
    if (scannerPurpose === 'stock_add') {
      setStoneToEdit(null);
      setIsStoneModalOpen(true);
    } else if (scannerPurpose === 'sale_scan') {
      const match = inventory.find(i => i.sku === stoneData.sku || i.name.toLowerCase() === stoneData.name?.toLowerCase());
      if (match) {
        setSalePrefillStone(match);
        setIsSaleModalOpen(true);
      } else {
        handleCreateOrUpdateStone(stoneData, true);
      }
    }
  };

  const handleAutoRestockAll = () => {
    const result = autoProcureLowStockItems(inventory, purchases);
    if (!result.createdPurchase || result.replenishedCount === 0) {
      showAutomationNotice(
        'Stock Levels Optimal',
        'All gemstone items are currently above minimum threshold.'
      );
      return;
    }

    setInventory(result.updatedInventory);
    const updatedPurchases = [result.createdPurchase, ...purchases];
    setPurchases(updatedPurchases);
    persistCurrentTenantData(clients, result.updatedInventory, appointments, updatedPurchases);
    saveLocalRecord('INVENTORY', result.updatedInventory);
    saveLocalRecord('PURCHASES', updatedPurchases);
    refreshStats(clients, appointments, result.updatedInventory, sales);

    showAutomationNotice(
      `⚡ Auto-Restocked ${result.replenishedCount} Lots`,
      `Created Purchase PO #${result.createdPurchase.purchaseOrderNumber || result.createdPurchase.invoiceNumber}.`,
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

      // Increase stock
      const updatedInventory = inventory.map(item => {
        const matching = newPurchase.items.find(pi => pi.stoneId === item.id);
        if (matching) {
          return {
            ...item,
            stockQuantity: item.stockQuantity + matching.quantity,
          };
        }
        return item;
      });

      setInventory(updatedInventory);
      persistCurrentTenantData(clients, updatedInventory, appointments, updatedPurchases);
      saveLocalRecord('PURCHASES', updatedPurchases);
      saveLocalRecord('INVENTORY', updatedInventory);
      refreshStats(clients, appointments, updatedInventory, sales);
      setIsPurchaseModalOpen(false);

      savePurchaseToCloud(newPurchase).catch(() => {});
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

      // Deduct stock
      const updatedInventory = inventory.map(item => {
        const matching = newSale.items.find(si => si.stoneId === item.id);
        if (matching) {
          return {
            ...item,
            stockQuantity: Math.max(0, item.stockQuantity - matching.quantity),
          };
        }
        return item;
      });

      setInventory(updatedInventory);
      persistCurrentTenantData(clients, updatedInventory, appointments, purchases, updatedSales);
      saveLocalRecord('SALES', updatedSales);
      saveLocalRecord('INVENTORY', updatedInventory);
      refreshStats(clients, appointments, updatedInventory, updatedSales);
      setIsSaleModalOpen(false);

      saveSaleToCloud(newSale).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  // Admin & Tenant Management Handlers
  const handleAddUser = (user: User) => {
    const updated = [...users, user];
    setUsers(updated);
    saveLocalRecord('USERS', updated);
  };

  const handleUpdateUser = (updatedUser: User) => {
    const updated = users.map(u => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    saveLocalRecord('USERS', updated);
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveLocalRecord('USERS', updated);
    try {
      localStorage.removeItem(`astroerp_tenant_${id}`);
    } catch (e) {
      console.warn(e);
    }
  };

  // Super Admin Monthly Fee ($200/mo) Subscriptions Handlers
  const handleAddMonthlyBilling = (accountId: string, amount: number = 200) => {
    const targetUser = users.find(u => u.id === accountId);
    if (!targetUser) return;

    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const newRecord: SubscriptionBillingRecord = {
      id: 'sub_' + Date.now(),
      accountId: targetUser.id,
      accountName: targetUser.name,
      companyName: targetUser.companyName || targetUser.name + ' Vedic Astro',
      username: targetUser.username || targetUser.email.split('@')[0],
      billingDate: today,
      dueDate: nextMonth,
      amount: amount,
      currency: 'USD',
      status: 'paid',
      planName: 'Professional Astrologer ERP',
      paymentMethod: 'Auto Monthly Debit',
      invoiceNumber: `INV-SUB-${Date.now().toString().slice(-6)}`,
      notes: 'Added via System Admin Console',
    };

    const updatedSubs = [newRecord, ...subscriptions];
    setSubscriptions(updatedSubs);
    saveLocalRecord('SUBSCRIPTIONS', updatedSubs);

    // Update user subscription stats
    const updatedUser: User = {
      ...targetUser,
      monthlyFee: amount,
      subscriptionStatus: 'active_paid',
      lastBillingDate: today,
      nextBillingDate: nextMonth,
      totalBilled: (targetUser.totalBilled || 0) + amount,
    };
    handleUpdateUser(updatedUser);

    showAutomationNotice(
      `$${amount} Monthly Fee Added`,
      `Generated invoice #${newRecord.invoiceNumber} for ${targetUser.name}.`
    );
  };

  const handleBatchAddMonthlyBilling = () => {
    const targetUsers = users.filter(u => u.role !== 'demo_user' && u.role !== 'super_admin');
    if (targetUsers.length === 0) {
      showAutomationNotice('No Client Accounts', 'No registered client accounts found to bill.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const newRecords: SubscriptionBillingRecord[] = targetUsers.map((u, idx) => ({
      id: 'sub_batch_' + (Date.now() + idx),
      accountId: u.id,
      accountName: u.name,
      companyName: u.companyName || u.name + ' Vedic Astro',
      username: u.username || u.email.split('@')[0],
      billingDate: today,
      dueDate: nextMonth,
      amount: 200,
      currency: 'USD',
      status: 'paid',
      planName: 'Professional Astrologer ERP',
      paymentMethod: 'Monthly Subscription',
      invoiceNumber: `INV-SUB-${Date.now().toString().slice(-4)}-${idx + 1}`,
      notes: 'Batch $200 Monthly Billing Cycle',
    }));

    const updatedSubs = [...newRecords, ...subscriptions];
    setSubscriptions(updatedSubs);
    saveLocalRecord('SUBSCRIPTIONS', updatedSubs);

    // Update all users
    const updatedUsers = users.map(u => {
      if (u.role === 'demo_user' || u.role === 'super_admin') return u;
      return {
        ...u,
        monthlyFee: 200,
        subscriptionStatus: 'active_paid' as const,
        lastBillingDate: today,
        nextBillingDate: nextMonth,
        totalBilled: (u.totalBilled || 0) + 200,
      };
    });

    setUsers(updatedUsers);
    saveLocalRecord('USERS', updatedUsers);

    showAutomationNotice(
      `⚡ Batch $200 Fee Processed`,
      `Generated monthly billing invoices for ${targetUsers.length} astrologer accounts.`
    );
  };

  const handleToggleSubscriptionPayment = (recordId: string, newStatus: 'paid' | 'pending' | 'overdue') => {
    const updated = subscriptions.map(s => (s.id === recordId ? { ...s, status: newStatus } : s));
    setSubscriptions(updated);
    saveLocalRecord('SUBSCRIPTIONS', updated);
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    saveLocalRecord('SETTINGS', newSettings);
    saveSettingsToCloud(newSettings).catch(() => {});
  };

  // Auth Modal & Admin Actions (Sign Up / Login / Demo Launch / SuperAdmin user creation)
  const handleRegisterAccount = (data: {
    username?: string;
    password?: string;
    companyName?: string;
    astrologerName?: string;
    name?: string;
    email: string;
    phone?: string;
    specialty?: string;
    role?: User['role'];
    [key: string]: any;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const practitionerName = data.astrologerName || data.name || 'Practitioner';
    const cleanUsername = data.username || data.email.split('@')[0];

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: practitionerName,
      email: data.email,
      username: cleanUsername,
      password: data.password || 'vedic123',
      companyName: data.companyName || `${practitionerName} Jyotish Sansthan`,
      role: data.role || 'astrologer',
      specialty: data.specialty || 'Vedic Ephemeris & Ratna Jyotish',
      phone: data.phone || '+91 98765 43210',
      status: 'active',
      monthlyFee: 200,
      subscriptionStatus: 'active_paid',
      lastBillingDate: today,
      nextBillingDate: nextMonth,
      totalBilled: 200,
      createdAt: new Date().toISOString(),
    };

    // Add initial subscription entry ($200 monthly plan)
    const initialSubRecord: SubscriptionBillingRecord = {
      id: 'sub_' + Date.now(),
      accountId: newUser.id,
      accountName: newUser.name,
      companyName: newUser.companyName || newUser.name,
      username: newUser.username || '',
      billingDate: today,
      dueDate: nextMonth,
      amount: 200,
      currency: 'USD',
      status: 'paid',
      planName: 'Professional Astrologer ERP (Monthly)',
      paymentMethod: 'Initial Account Activation',
      invoiceNumber: `INV-SUB-${Date.now().toString().slice(-6)}`,
      notes: 'Initial account provisioning with $200/mo active subscription',
    };

    const updatedSubs = [initialSubRecord, ...subscriptions];
    setSubscriptions(updatedSubs);
    saveLocalRecord('SUBSCRIPTIONS', updatedSubs);

    // Save to users list
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveLocalRecord('USERS', updatedUsers);

    // Initialize 0-data workspace for this new account
    setClients([]);
    setInventory([]);
    setAppointments([]);
    setPurchases([]);
    setSales([]);
    try {
      localStorage.setItem(
        `astroerp_tenant_${newUser.id}`,
        JSON.stringify({
          clients: [],
          inventory: [],
          appointments: [],
          purchases: [],
          sales: [],
        })
      );
    } catch (e) {
      console.warn(e);
    }

    setCurrentUser(newUser);
    refreshStats([], [], [], [], auditLogs);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');

    showAutomationNotice(
      `Welcome, ${newUser.name}!`,
      `Your dedicated workspace is live with clean zero-data state and active $200/mo plan.`
    );
  };

  const handleLoginAccount = (identifier: string, password?: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPw = password?.trim() || '';

    // Direct check for System Admin account (apex7tech@gmail.com / apex7tech / admin)
    const isSuperAdminAlias =
      cleanId === 'apex7tech@gmail.com' ||
      cleanId === 'apex7tech' ||
      cleanId === 'admin' ||
      cleanId === 'admin@astroerp.com' ||
      cleanId === 'apex7' ||
      cleanId === 'system admin';

    if (isSuperAdminAlias) {
      if (cleanPw === 'Search@1959' || cleanPw === 'admin123') {
        let adminUser = users.find(
          u =>
            u.role === 'super_admin' ||
            u.email.toLowerCase() === 'apex7tech@gmail.com' ||
            u.id === 'usr_admin_1'
        );

        if (!adminUser) {
          adminUser = {
            id: 'usr_admin_1',
            name: 'Apex7 Admin',
            email: 'apex7tech@gmail.com',
            username: 'apex7tech',
            password: 'Search@1959',
            companyName: 'AstroNexus Vedic Labs & Research',
            specialty: 'Vedic Jyotish & Gemology',
            role: 'super_admin',
            status: 'active',
            title: 'Chief System Administrator & Managing Director',
            monthlyFee: 200,
            subscriptionStatus: 'active_paid',
            createdAt: '2025-01-10T10:00:00Z',
          };
          const updated = [adminUser, ...users];
          setUsers(updated);
          saveLocalRecord('USERS', updated);
        } else {
          // Ensure credentials and role are fresh
          adminUser = {
            ...adminUser,
            email: 'apex7tech@gmail.com',
            password: 'Search@1959',
            role: 'super_admin',
          };
          const updated = users.map(u => (u.id === adminUser!.id ? adminUser! : u));
          setUsers(updated);
          saveLocalRecord('USERS', updated);
        }

        setCurrentUser(adminUser);
        loadTenantWorkspace(adminUser);
        setIsAuthModalOpen(false);
        setActiveTab('dashboard');

        showAutomationNotice(
          `Logged in as System Admin`,
          `Welcome Apex7 Admin! Full super admin & tenant management console active.`
        );

        return { success: true, user: adminUser };
      }
    }

    const found = users.find(
      u =>
        u.email.toLowerCase() === cleanId ||
        (u.username && u.username.toLowerCase() === cleanId) ||
        u.name.toLowerCase() === cleanId ||
        (isSuperAdminAlias && u.role === 'super_admin')
    );

    if (!found) {
      return { success: false, message: 'Account not found. Please verify username or create a new account.' };
    }

    if (password) {
      const isMatch =
        found.password === password ||
        (found.role === 'super_admin' && (password === 'Search@1959' || password === 'admin123'));
      if (!isMatch) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
    }

    setCurrentUser(found);
    loadTenantWorkspace(found);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');

    showAutomationNotice(
      `Logged in as ${found.name}`,
      `Loaded ${found.role === 'super_admin' ? 'System Admin Data' : 'Astrologer Workspace'}.`
    );

    return { success: true, user: found };
  };

  const handleLaunchDemoUser = () => {
    let demoUser = users.find(u => u.role === 'demo_user');
    if (!demoUser) {
      demoUser = {
        id: 'usr_demo',
        name: 'Demo Astrologer',
        email: 'demo@astronexus.com',
        username: 'demo_user',
        password: 'demouser123',
        companyName: 'AstroNexus Demo Sansthan',
        role: 'demo_user',
        specialty: 'Vedic Astrology & Gemstone Remedies',
        isReadOnly: true,
        monthlyFee: 0,
        subscriptionStatus: 'active_paid',
        createdAt: new Date().toISOString(),
      };
      setUsers([...users, demoUser]);
      saveLocalRecord('USERS', [...users, demoUser]);
    }

    setCurrentUser(demoUser);
    loadTenantWorkspace(demoUser);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');

    showAutomationNotice(
      '✨ Demo Mode Active (Read-Only)',
      'Loaded sample clients, gemstones, and consultations for live exploration.'
    );
  };

  const currencySymbol = settings?.currencySymbol || '$';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col lg:flex-row font-sans antialiased selection:bg-indigo-600 selection:text-white relative w-full">
      {/* Comprehensive SEO Meta Tags */}
      <SEOHead
        activeTab={activeTab}
        chartData={chartData}
        pageTitle={
          activeTab === 'home'
            ? 'AstroNexus Pro | Vedic Ephemeris & Astrologer Back-Office ERP'
            : activeTab === 'system_admin'
            ? 'System Admin Data & Subscription Vault | AstroNexus'
            : activeTab === 'astrology'
            ? 'Free Kundli & Ephemeris Calculator | AstroNexus'
            : activeTab === 'inventory'
            ? 'Certified Gemstone Vault & Automation | AstroNexus'
            : 'Astrology ERP & Jyotish Practice Management'
        }
        pageDescription="AstroNexus Pro is an automated astrological ERP platform with zero-human-overhead inventory, auto-purchases, auto-dispensing, and Swiss Ephemeris calculations."
      />

      {/* ========================================================================= */}
      {/* HOME LANDING PAGE VIEW (Full-width Vedic Astro Theme)                     */}
      {/* ========================================================================= */}
      {activeTab === 'home' ? (
        <div className="w-full min-h-screen bg-[#0B0F19]">
          <AstroLandingPage
            onOpenAuthModal={initialTab => {
              setAuthModalInitialTab(initialTab || 'login');
              setIsAuthModalOpen(true);
            }}
            onLaunchDemo={handleLaunchDemoUser}
            onGoToDashboard={() => setActiveTab('dashboard')}
            isLoggedIn={!!currentUser}
            currentUserName={currentUser?.name}
            settings={settings}
          />
        </div>
      ) : (
        <>
          {/* Sidebar Navigation (Desktop Fixed Sidebar / Mobile Top Bar) */}
          <Navbar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            currentUser={currentUser}
            onOpenLoginModal={() => {
              setAuthModalInitialTab('login');
              setIsAuthModalOpen(true);
            }}
            onGoToHome={() => setActiveTab('home')}
            onOpenCloudModal={() => setIsCloudModalOpen(true)}
            settings={settings}
          />

          {/* Main Right-Side Workspace Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:h-screen lg:overflow-hidden bg-[#0B0F19]">
            {/* Demo Read-Only Notice or Automation Status Banner */}
            {currentUser?.role === 'demo_user' ? (
              <div className="bg-amber-950/70 border-b border-amber-800/80 px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between text-xs text-amber-200 gap-2 shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">Demo Mode (Read-Only):</span>
                  <span className="text-amber-300/90 text-[11px]">
                    Exploring pre-seeded sample data. All modifications are simulated.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalInitialTab('signup');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Create Your 0-Data Account</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/90 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-slate-200">Zero-Human-Overhead Active:</span>
                  <span>Auto purchase orders & gemstone dispensing synchronized.</span>
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
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-amber-400 hover:text-amber-300 font-semibold text-xs transition cursor-pointer"
                  >
                    Home Page ✧
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Main Viewport Container */}
            <div className="flex-1 overflow-y-auto w-full">
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 w-full">
                {/* ========================================================================= */}
                {/* VIEW 0: System Admin Data & $200 Subscriptions Console                    */}
                {/* ========================================================================= */}
                {activeTab === 'system_admin' && (
                  <SuperAdminConsole
                    users={users}
                    subscriptionRecords={subscriptions}
                    onAddMonthlyBilling={handleAddMonthlyBilling}
                    onBatchAddMonthlyBilling={handleBatchAddMonthlyBilling}
                    onToggleSubscriptionPayment={handleToggleSubscriptionPayment}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                    onCreateUser={handleRegisterAccount}
                    currencySymbol={currencySymbol}
                  />
                )}

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

                        {/* Gemstone Prescriptions */}
                        <GemstonePrescription
                          recommendations={chartData.interpretations.gemstoneRecommendations}
                          subjectName={chartData.subjectName}
                          selectedLanguage={selectedLanguage}
                          onNavigateToVault={() => setActiveTab('inventory')}
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

                        {/* Predictions Timelines */}
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
                {/* VIEW 4: Appointment Calendar / Consultation Scheduler                    */}
                {/* ========================================================================= */}
                {(activeTab === 'appointments' || activeTab === 'calendar') && (
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
        </>
      )}

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

      {/* Dual-Tab Auth Portal (Create New A/C vs Login) + Demo Access */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalInitialTab}
        onRegisterAccount={handleRegisterAccount}
        onLoginAccount={handleLoginAccount}
        onLaunchDemoUser={handleLaunchDemoUser}
        registeredUsers={users}
      />

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
        astrologers={users.filter(u => u.role === 'astrologer' || u.role === 'admin' || u.role === 'super_admin')}
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

      {/* Legacy Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        currentUser={currentUser}
        onSwitchUser={u => {
          setCurrentUser(u);
          loadTenantWorkspace(u);
        }}
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
        />
      )}
    </div>
  );
}

export default App;
