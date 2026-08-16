/**
 * Core Data Models & Shared Types for AstroERP
 */

export type UserRole = 'super_admin' | 'admin' | 'astrologer' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: 'active' | 'blocked';
  isActive?: boolean;
  title?: string;
  phone?: string;
  avatarUrl?: string;
  permissions?: string[];
  lastLogin?: string;
  createdAt?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:mm
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  address?: string;
  occupation?: string;
  notes?: string;
  tags?: string[];
  ascendant?: string;
  moonSign?: string;
  nakshatra?: string;
  attachedCharts?: AttachedNatalChart[];
  totalConsultations?: number;
  totalSpent?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttachedNatalChart {
  id: string;
  name: string;
  calculatedAt: string;
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
  chartData: AstrologyChartData;
}

export type AppointmentType = 
  | 'natal_reading' 
  | 'gemstone_consultation' 
  | 'synastry' 
  | 'transit_forecast' 
  | 'career_wealth' 
  | 'medical_astrology';

export type AppointmentStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  astrologerId?: string;
  astrologerName: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  type?: AppointmentType | string;
  serviceType?: string;
  status: AppointmentStatus;
  notes?: string;
  fee: number;
  isPaid?: boolean;
  meetingLink?: string;
  meetingMode?: 'In-Person' | 'Video Call (Zoom/GMeet)' | 'Phone Consultation' | string;
  createdAt?: string;
}

export interface GemstoneCategory {
  id: string;
  name: string;
  sanskritName: string;
  rulingPlanet: string;
  description: string;
  color: string;
  count?: number;
}

export interface GemstoneItem {
  id: string;
  sku: string;
  name: string;
  sanskritName?: string;
  categoryId?: string;
  categoryName?: string;
  category?: string;
  weightCarats: number;
  weightRatti?: number;
  costPrice?: number;
  sellingPrice?: number;
  purchasePrice?: number;
  salePrice?: number;
  stockQuantity: number;
  minStockThreshold: number;
  supplier?: string;
  origin?: string;
  color?: string;
  cut?: string;
  description?: string;
  isCertified?: boolean;
  certificationLab?: string;
  certificateNumber?: string;
  treatment?: 'Natural' | 'Heated' | 'Untreated' | 'Treated' | string;
  rulingPlanet?: string;
  associatedPlanet?: string;
  clarity?: 'VVS' | 'VS' | 'SI' | 'Transparent' | 'Translucent' | string;
  shapeCut?: 'Oval' | 'Cushion' | 'Emerald Cut' | 'Round' | 'Pear' | 'Cabochon' | string;
  imageUrl?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Aliases for Gemstone Item
export type InventoryItem = GemstoneItem;

export interface PurchaseItem {
  stoneId?: string;
  stoneName: string;
  sku?: string;
  categoryId?: string;
  categoryName?: string;
  weightCarats?: number;
  weightRatti?: number;
  quantity: number;
  unitCost: number;
  totalCost: number;
  rulingPlanet?: string;
  origin?: string;
}

export interface PurchaseEntry {
  id: string;
  invoiceNumber?: string;
  purchaseOrderNumber?: string;
  supplierName: string;
  supplierContact?: string;
  purchaseDate: string;
  invoiceReference?: string;
  items: PurchaseItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  status: 'received' | 'pending' | 'ordered';
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid' | 'paid' | 'unpaid' | 'partial';
  paymentMethod?: string;
  notes?: string;
  createdAt?: string;
}

export type Purchase = PurchaseEntry;

export interface SaleItem {
  stoneId: string;
  stoneName: string;
  categoryName?: string;
  sku: string;
  weightCarats?: number;
  weightRatti?: number;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  totalPrice?: number;
  total?: number;
  certificateNumber?: string;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  saleDate: string;
  items: SaleItem[];
  subtotal: number;
  discountAmount: number;
  taxRatePercent?: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: 'Cash' | 'Credit/Debit Card' | 'Bank Transfer' | 'UPI' | 'PayPal' | 'Credit Card / Stripe' | 'Bank Wire / NEFT' | 'Cash / POS' | 'Crypto (USDT/BTC)' | string;
  paymentStatus?: 'paid' | 'unpaid' | 'partial';
  astrologerRecommended?: string;
  prescriptionDetails?: string;
  notes?: string;
  createdAt?: string;
}

export type Sale = SalesInvoice;

export interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole | string;
  action: string;
  module: 'Auth' | 'CRM' | 'Astrology' | 'Inventory' | 'Purchases' | 'Sales' | 'Settings' | 'Users' | string;
  details: string;
  ipAddress?: string;
}

export type AuditLog = SystemLog;

export interface StoreSettings {
  storeName?: string;
  businessName?: string;
  tagline?: string;
  astrologerTitle?: string;
  address?: string;
  officeAddress?: string;
  phone?: string;
  contactPhone?: string;
  email?: string;
  contactEmail?: string;
  website?: string;
  taxRatePercent: number;
  currencySymbol: string;
  currencyCode?: string;
  currency?: string;
  defaultHouseSystem: 'placidus' | 'equal' | 'whole_sign';
  defaultZodiacSystem?: 'tropical' | 'sidereal_lahiri';
  defaultAyanamsha?: 'tropical' | 'sidereal_lahiri';
  defaultLanguage?: string;
  invoiceFooterNote?: string;
  enablePublicCalculator?: boolean;
}

export interface DashboardStats {
  totalClients: number;
  weeklyAppointments: number;
  totalAppointments: number;
  lowStockCount: number;
  totalRevenue: number;
  totalStonesInStock: number;
  totalInventoryValuation: number;
  monthlyRevenue: number;
  recentSales: SalesInvoice[];
  upcomingAppointments: Appointment[];
  lowStockItems: GemstoneItem[];
  recentLogs: SystemLog[];
}

// ---------------- Astrological Data Types ---------------- //

export interface PlanetPosition {
  name: string;
  symbol: string;
  longitude: number; // 0 to 360 degrees
  sign: string;
  signIndex: number; // 0 (Aries) to 11 (Pisces)
  signSymbol: string;
  degreesInSign: number; // 0 to 29.999
  formattedDegrees: string; // e.g. "15° 24' 12\""
  house: number; // 1 to 12
  isRetrograde: boolean;
  speed: number;
  dignity: 'Rulership' | 'Exalted' | 'Fall' | 'Detriment' | 'Peregrine';
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  keywords: string[];
}

export interface HouseCusp {
  houseNumber: number;
  sign: string;
  signIndex: number;
  signSymbol: string;
  cuspLongitude: number;
  degreesInSign: number;
  formattedDegrees: string;
  ruler: string;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  aspectType: 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile' | 'Quincunx';
  angle: number;
  orb: number;
  exactAngle: number;
  isApplying: boolean;
  nature: 'Harmonious' | 'Dynamic' | 'Neutral';
  symbol: string;
  description: string;
}

export interface GemstoneRecommendation {
  stone: string;
  sanskritName: string;
  planet: string;
  reason: string;
  weightSuggestion: string;
  metalSuggestion: string;
  finger: string;
  auspiciousDay: string;
  mantra: string;
  suitability: 'Highly Recommended' | 'Favorable' | 'Neutral' | 'Avoid';
}

export interface TimeframePrediction {
  periodType: 'weekly' | 'monthly' | 'yearly';
  title: string;
  timeframeLabel: string;
  overallScore: number; // 0 to 100
  overallMood: string;
  headline: string;
  summary: string;
  careerAndMoney: {
    score: number;
    status: 'Excellent' | 'Favorable' | 'Steady' | 'Caution';
    prediction: string;
    actionableTip: string;
  };
  loveAndFamily: {
    score: number;
    status: 'Excellent' | 'Favorable' | 'Steady' | 'Caution';
    prediction: string;
    actionableTip: string;
  };
  healthAndVitality: {
    score: number;
    status: 'Excellent' | 'Favorable' | 'Steady' | 'Caution';
    prediction: string;
    actionableTip: string;
  };
  favorableActivities: string[];
  cautionActivities: string[];
  luckyElements: {
    luckyColors: string[];
    luckyNumbers: number[];
    luckyDays: string[];
    auspiciousDirection: string;
    favorableGemstone: string;
    mantraOrAffirmation: string;
  };
  transitInfluences: {
    planet: string;
    transitNote: string;
    impactOnHouses: string;
  }[];
}

export interface AstrologyPredictions {
  weekly: TimeframePrediction;
  monthly: TimeframePrediction;
  yearly: TimeframePrediction;
}

export interface AstrologyInterpretation {
  coreAscendant: {
    sign: string;
    title: string;
    description: string;
    physicalTraits: string;
    lifeApproach: string;
  };
  coreSun: {
    sign: string;
    house: number;
    title: string;
    description: string;
    soulPurpose: string;
    challenges: string;
  };
  coreMoon: {
    sign: string;
    house: number;
    title: string;
    description: string;
    emotionalNeeds: string;
    instincts: string;
  };
  planetaryPlacements: {
    planet: string;
    sign: string;
    house: number;
    dignity: string;
    text: string;
  }[];
  aspectInterpretations: {
    planet1: string;
    planet2: string;
    aspect: string;
    nature: string;
    text: string;
  }[];
  elementDistribution: {
    fire: number;
    earth: number;
    air: number;
    water: number;
    dominantElement: string;
    elementAnalysis: string;
  };
  modalityDistribution: {
    cardinal: number;
    fixed: number;
    mutable: number;
    dominantModality: string;
    modalityAnalysis: string;
  };
  gemstoneRecommendations: GemstoneRecommendation[];
  karmicDestinySummary: string;
  predictions?: AstrologyPredictions;
}

export interface AstrologyChartData {
  subjectName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  julianDay: number;
  siderealTime: number;
  zodiacSystem: 'tropical' | 'sidereal_lahiri';
  houseSystem: 'placidus' | 'equal' | 'whole_sign';
  ascendant: number;
  midheaven: number;
  vertex: number;
  armc: number;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
  interpretations: AstrologyInterpretation;
  inputData?: {
    name?: string;
    birthDate?: string;
    birthTime?: string;
    placeName?: string;
    latitude?: number;
    longitude?: number;
    timezoneOffset?: number;
    houseSystem?: string;
    zodiacSystem?: string;
  };
}
