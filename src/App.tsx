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

import { Sparkles, Download, ArrowRight, ShieldCheck, Globe, Calendar, Gem, Users, AlertCircle } from 'lucide-react';

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

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Calculate initial sample chart for public view
      calculateAstrologyChart({
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

      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url);
          const json = await res.json();
          if (json && json.data !== undefined) return json.data;
          return json;
        } catch (e) {
          console.warn(`Fetch error for ${url}:`, e);
          return null;
        }
      };

      // Load ERP backend data in parallel
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
      if (Array.isArray(clientsData)) setClients(clientsData);
      if (Array.isArray(aptsData)) setAppointments(aptsData);
      if (Array.isArray(invData)) setInventory(invData);
      if (Array.isArray(purData)) setPurchases(purData);
      if (Array.isArray(salesData)) setSales(salesData);
      if (Array.isArray(usersData)) {
        setUsers(usersData);
        setCurrentUser(usersData[0] || null);
      }
      if (Array.isArray(logsData)) setAuditLogs(logsData);
      if (setData) setSettings(setData);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  const refreshStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const json = await res.json();
      const data = json.data !== undefined ? json.data : json;
      if (data) setDashboardStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate astrology chart via Ephemeris API
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
      const res = await fetch('/api/astrology/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).then(r => r.json());

      if (res.success && res.data) {
        setChartData(res.data);
      }
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
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: chartData.subjectName,
          email: `${chartData.subjectName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          dateOfBirth: chartData.birthDate,
          timeOfBirth: chartData.birthTime,
          placeOfBirth: chartData.birthPlace,
          latitude: chartData.latitude,
          longitude: chartData.longitude,
          tags: ['Natal Chart Lead', chartData.interpretations.coreAscendant.sign + ' Rising'],
          notes: `Ascendant: ${chartData.interpretations.coreAscendant.sign}, Sun: ${chartData.planets.find(p=>p.name==='Sun')?.sign}, Moon: ${chartData.planets.find(p=>p.name==='Moon')?.sign}. Recommended stone: ${chartData.interpretations.gemstoneRecommendations[0]?.stone}`,
        }),
      }).then(r => r.json());

      if (res.success) {
        setClients(prev => [res.data, ...prev]);
        refreshStats();
        setActiveTab('clients');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Client Handlers
  const handleCreateOrUpdateClient = async (clientData: Partial<Client>) => {
    try {
      if (clientToEdit) {
        const res = await fetch(`/api/clients/${clientToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData),
        }).then(r => r.json());
        if (res.success) {
          setClients(prev => prev.map(c => c.id === clientToEdit.id ? res.data : c));
        }
      } else {
        const res = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData),
        }).then(r => r.json());
        if (res.success) {
          setClients(prev => [res.data, ...prev]);
        }
      }
      refreshStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to remove this client profile?')) return;
    try {
      await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
      setClients(prev => prev.filter(c => c.id !== clientId));
      refreshStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateClientNotes = async (clientId: string, notes: string) => {
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      }).then(r => r.json());
      if (res.success) {
        setClients(prev => prev.map(c => c.id === clientId ? res.data : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Appointment Handlers
  const handleCreateAppointment = async (aptData: Partial<Appointment>) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aptData),
      }).then(r => r.json());
      if (res.success) {
        setAppointments(prev => [res.data, ...prev]);
        refreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).then(r => r.json());
      if (res.success) {
        setAppointments(prev => prev.map(a => a.id === id ? res.data : a));
        refreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      setAppointments(prev => prev.filter(a => a.id !== id));
      refreshStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Inventory Handlers
  const handleCreateOrUpdateStone = async (stoneData: Partial<InventoryItem>) => {
    try {
      if (stoneToEdit) {
        const res = await fetch(`/api/inventory/${stoneToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stoneData),
        }).then(r => r.json());
        if (res.success) {
          setInventory(prev => prev.map(i => i.id === stoneToEdit.id ? res.data : i));
        }
      } else {
        const res = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stoneData),
        }).then(r => r.json());
        if (res.success) {
          setInventory(prev => [res.data, ...prev]);
        }
      }
      refreshStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStone = async (id: string) => {
    if (!window.confirm('Delete this gemstone lot from inventory?')) return;
    try {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      setInventory(prev => prev.filter(i => i.id !== id));
      refreshStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkImportStones = async (importedItems: Partial<InventoryItem>[]) => {
    try {
      for (const item of importedItems) {
        await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      const refreshed = await fetch('/api/inventory').then(r => r.json());
      if (refreshed.success) setInventory(refreshed.data);
      refreshStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Purchases Handlers
  const handleCreatePurchase = async (purchaseData: Partial<Purchase>) => {
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData),
      }).then(r => r.json());
      if (res.success) {
        setPurchases(prev => [res.data, ...prev]);
        const refInv = await fetch('/api/inventory').then(r => r.json());
        if (refInv.success) setInventory(refInv.data);
        refreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sales Handlers
  const handleCreateSale = async (saleData: Partial<Sale>) => {
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      }).then(r => r.json());
      if (res.success) {
        setSales(prev => [res.data, ...prev]);
        const refInv = await fetch('/api/inventory').then(r => r.json());
        if (refInv.success) setInventory(refInv.data);
        refreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin & Settings Handlers
  const handleAddUser = async (userData: Partial<User>) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }).then(r => r.json());
      if (res.success) {
        setUsers(prev => [res.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (newSettings: StoreSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      }).then(r => r.json());
      if (res.success) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currencySymbol = settings?.currencySymbol || '$';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        settings={settings}
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
