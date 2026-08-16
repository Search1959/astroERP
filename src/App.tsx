/**
 * AstroERP - Hybrid Astrology Ephemeris & Back-Office ERP Platform
 * Main React Application Entry Point
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
  seedCloudDatabaseIfEmpty,
  SavedCloudChart,
} from './services/firestoreSync';

import { Sparkles, Download, ArrowRight, ShieldCheck, Globe, Calendar, Gem, Users, AlertCircle, Cloud, Database } from 'lucide-react';
import { calculateFullAstrologyChart } from './utils/ephemerisEngine';
import {
  getLocalOrSeedData,
  saveLocalRecord,
  calculateDashboardStats,
  DEFAULT_USERS,
  DEFAULT_SETTINGS,
} from './data/initialDemoData';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('astrology');

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

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [salePrefillStone, setSalePrefillStone] = useState<InventoryItem | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  // Fetch initial data & handle deep links / SEO routes
  useEffect(() => {
    fetchInitialData();
  }, []);

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
        astrologerId: aptData.astrologerId || (users[0]?.id || ''),
        astrologerName: astrologer?.name || aptData.astrologerName || 'Astrologer',
        date: aptData.date || new Date().toISOString().split('T')[0],
        time: aptData.time || '11:00',
        durationMinutes: aptData.durationMinutes || 45,
        type: aptData.type || 'natal_reading',
        status: aptData.status || 'scheduled',
        notes: aptData.notes || '',
        fee: aptData.fee || 150,
        isPaid: aptData.isPaid || false,
        meetingMode: aptData.meetingMode || 'Video Call (Zoom/GMeet)',
        createdAt: new Date().toISOString(),
      };

      const updated = [newApt, ...appointments];
      setAppointments(updated);
      saveLocalRecord('APPOINTMENTS', updated);
      refreshStats(clients, updated);
      setIsAppointmentModalOpen(false);

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

  // Inventory Handlers
  const handleCreateOrUpdateStone = async (stoneData: Partial<InventoryItem>) => {
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

  const handleBulkImportStones = async (importedItems: Partial<InventoryItem>[]) => {
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
    } catch (err) {
      console.error(err);
    }
  };

  // Purchases Handlers
  const handleCreatePurchase = async (purchaseData: Partial<Purchase>) => {
    try {
      const newPurchase: Purchase = {
        id: 'pur_' + Date.now(),
        invoiceNumber: purchaseData.invoiceNumber || `PUR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
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
  const handleAddUser = async (userData: Partial<User>) => {
    try {
      const newUser: User = {
        id: 'usr_' + Date.now(),
        name: userData.name || 'New Staff Member',
        email: userData.email || 'staff@astroerp.com',
        role: userData.role || 'staff',
        status: userData.status || 'active',
        title: userData.title || 'Staff Astrologer',
        avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      const updated = [newUser, ...users];
      setUsers(updated);
      saveLocalRecord('USERS', updated);

      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      saveLocalRecord('USERS', updated);
      fetch(`/api/users/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (newSettings: StoreSettings) => {
    try {
      setSettings(newSettings);
      saveLocalRecord('SETTINGS', newSettings);
      saveSettingsToCloud(newSettings).catch(() => {});
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const currencySymbol = settings?.currencySymbol || '$';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic SEO Meta & Schema.org JSON-LD Manager */}
      <SEOHead activeTab={activeTab} chartData={chartData} />

      {/* Sidebar Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        settings={settings}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Desktop Top Header Bar with Context & Quick Navigation */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-3.5 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 font-mono">
              {activeTab === 'astrology' ? 'Public Engine' : 'Back-Office ERP'}
            </span>
            <span className="text-slate-300">/</span>
            <h1 className="text-base font-bold text-slate-800 capitalize">
              {activeTab === 'dashboard' && 'Command Center & KPI Metrics'}
              {activeTab === 'astrology' && 'Swiss Ephemeris Natal Chart Calculator'}
              {activeTab === 'clients' && 'Client Relationship Management (CRM)'}
              {activeTab === 'appointments' && 'Consultation Scheduler & Calendar'}
              {activeTab === 'inventory' && 'Gemstone Vault & Inventory Roster'}
              {activeTab === 'purchases' && 'Dealer Purchases & Restocking'}
              {activeTab === 'sales' && 'Sales Ledger & Invoicing'}
              {activeTab === 'admin' && 'Staff Accounts & Security Audit'}
              {activeTab === 'settings' && 'Store & Ephemeris Configuration'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Cloud Database & SEO Manager Trigger */}
            <button
              type="button"
              id="topbar-btn-cloud-seo"
              onClick={() => setIsCloudModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Cloud className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cloud DB & SEO</span>
            </button>

            <button
              type="button"
              id="header-btn-quick-chart"
              onClick={() => setActiveTab('astrology')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'astrology'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Chart Calculator
            </button>
            <button
              type="button"
              id="header-btn-quick-crm"
              onClick={() => setActiveTab('clients')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'clients'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Clients
            </button>
            <button
              type="button"
              id="header-btn-quick-vault"
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Gem className="w-3.5 h-3.5 text-emerald-600" />
              Gem Vault
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Indian Language Selector Dropdown */}
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              variant="compact"
            />

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <button
              type="button"
              id="header-btn-login-modal"
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium transition cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">{currentUser?.name.split(' ')[0] || 'User'}</span>
              <span className="text-[10px] text-slate-400 capitalize">({currentUser?.role || 'admin'})</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* ========================================================================= */}
          {/* VIEW 1: Public Astrology Natal Chart Calculator (Astro.com Style)       */}
          {/* ========================================================================= */}
          {activeTab === 'astrology' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Calculator Input Form */}
              <ChartCalculatorForm
                onCalculate={calculateAstrologyChart}
                isLoading={isCalculatingChart}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
              />

              {/* Results Section */}
              {chartData && (
                <div className="space-y-8">
                  {/* Result Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        Natal Chart & Cosmic Blueprint for {chartData.subjectName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Born {chartData.birthDate} at {chartData.birthTime} • {chartData.birthPlace}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        id="btn-cloud-share-chart"
                        onClick={() => setIsCloudModalOpen(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Save to Cloud & Share Link
                      </button>
                      <button
                        type="button"
                        id="btn-save-to-crm"
                        onClick={handleSaveChartAsClient}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Save Chart to Back-Office CRM
                      </button>
                      <button
                        type="button"
                        id="btn-open-pdf-modal"
                        onClick={() => setIsPdfModalOpen(true)}
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Generate & Print PDF Report
                      </button>
                    </div>
                  </div>

                {/* Primary Chart View: Interactive Wheel + Interpretation Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6 flex justify-center">
                    <NatalWheelChart chartData={chartData} size={540} />
                  </div>
                  <div className="lg:col-span-6">
                    <InterpretationView
                      interpretations={chartData.interpretations}
                      subjectName={chartData.subjectName}
                      selectedLanguage={selectedLanguage}
                    />
                  </div>
                </div>

                {/* Weekly, Monthly, and Yearly Astrological Predictions for Everyday Understanding */}
                <PredictionsView
                  chartData={chartData}
                  selectedLanguage={selectedLanguage}
                />

                {/* Planetary Positions & Elemental Table */}
                <PlanetaryTable
                  chartData={chartData}
                  selectedLanguage={selectedLanguage}
                />

                {/* Major Planetary Aspects Matrix */}
                <AspectsMatrix aspects={chartData.aspects} />

                {/* Jyotish Gemstone Remedial Prescription */}
                <GemstonePrescription
                  recommendations={chartData.interpretations.gemstoneRecommendations}
                  subjectName={chartData.subjectName}
                  selectedLanguage={selectedLanguage}
                  onNavigateToVault={() => setActiveTab('inventory')}
                  onBookConsultation={() => {
                    setActiveTab('appointments');
                    setIsAppointmentModalOpen(true);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: Back-Office Overview Dashboard                                   */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            stats={dashboardStats}
            currentUser={currentUser}
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
            currencySymbol={currencySymbol}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: CRM & Client Records                                              */}
        {/* ========================================================================= */}
        {activeTab === 'clients' && (
          <ClientList
            clients={clients}
            onSelectClient={c => setSelectedClientForView(c)}
            onOpenNewClientModal={() => {
              setClientToEdit(null);
              setIsClientFormModalOpen(true);
            }}
            onEditClient={c => {
              setClientToEdit(c);
              setIsClientFormModalOpen(true);
            }}
            onDeleteClient={handleDeleteClient}
            onBookAppointmentForClient={c => {
              setAppointmentPrefillClient(c);
              setIsAppointmentModalOpen(true);
            }}
            currencySymbol={currencySymbol}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: Consultations & Calendar Scheduler                               */}
        {/* ========================================================================= */}
        {activeTab === 'appointments' && (
          <AppointmentCalendar
            appointments={appointments}
            clients={clients}
            astrologers={users.filter(u => u.role === 'astrologer' || u.role === 'admin')}
            onOpenBookingModal={c => {
              setAppointmentPrefillClient(c || null);
              setIsAppointmentModalOpen(true);
            }}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onDeleteAppointment={handleDeleteAppointment}
            currencySymbol={currencySymbol}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: Gemstone & Stone Inventory Roster                                */}
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
            onIssueSaleForStone={item => {
              setSalePrefillStone(item);
              setIsSaleModalOpen(true);
            }}
            currencySymbol={currencySymbol}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: Supplier Purchases & Restocking                                  */}
        {/* ========================================================================= */}
        {activeTab === 'purchases' && (
          <PurchaseList
            purchases={purchases}
            inventory={inventory}
            onOpenNewPurchaseModal={() => setIsPurchaseModalOpen(true)}
            currencySymbol={currencySymbol}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 7: Sales & Invoicing                                                */}
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

      {/* Global Modals */}

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
        astrologers={users.filter(u => u.role === 'astrologer' || u.role === 'admin')}
        prefillClient={appointmentPrefillClient}
      />

      {/* Gemstone Lot Modal */}
      <StoneFormModal
        isOpen={isStoneModalOpen}
        onClose={() => setIsStoneModalOpen(false)}
        onSubmit={handleCreateOrUpdateStone}
        editingStone={stoneToEdit}
      />

      {/* CSV Bulk Import Modal */}
      <CsvImportModal
        isOpen={isCsvImportModalOpen}
        onClose={() => setIsCsvImportModalOpen(false)}
        onImport={handleBulkImportStones}
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
        onLoadSavedChart={(cloudChart) => {
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
    </div>
  );
}

export default App;
