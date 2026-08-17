/**
 * Core Data Models & Shared Types for AstroERP
 */

export type UserRole = 'super_admin' | 'admin' | 'astrologer' | 'staff' | 'demo_user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username?: string;
  password?: string;
  companyName?: string;
  specialty?: string;
  status?: 'active' | 'blocked' | 'inactive';
  isActive?: boolean;
  isReadOnly?: boolean;
  title?: string;
  phone?: string;
  avatarUrl?: string;
  permissions?: string[];
  lastLogin?: string;
  createdAt?: string;
  monthlyFee?: number;
  subscriptionStatus?: 'active_paid' | 'due' | 'overdue' | 'trial';
  lastBillingDate?: string;
  nextBillingDate?: string;
  totalBilled?: number;
}

export interface SubscriptionBillingRecord {
  id: string;
  accountId: string;
  accountName: string;
  companyName: string;
  username?: string;
  planName?: string;
  amount: number; // e.g. 200
  currency: string;
  billingDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  invoiceNumber: string;
  description?: string;
  notes?: string;
  paymentMethod?: string;
  paidAt?: string;
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
  timezone?: number;
  timezoneOffset?: number;
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
  id?: string;
  stoneId: string;
  stoneName: string;
  categoryName?: string;
  sku?: string;
  stoneSku?: string;
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
  defaultHouseSystem: 'placidus' | 'equal' | 'whole_sign' | string;
  defaultZodiacSystem?: 'tropical' | 'sidereal_lahiri' | string;
  defaultAyanamsha?: 'lahiri' | 'raman' | 'krishnamurti' | 'tropical' | 'sidereal_lahiri' | string;
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

// ------------------------------------------------------------- //
//             LEAD MANAGEMENT & WHATSAPP CRM TYPES              //
// ------------------------------------------------------------- //

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'FOLLOW_UP'
  | 'CONVERTED'
  | 'NO_RESPONSE'
  | 'NOT_INTERESTED'
  | 'REJECTED'
  | 'WRONG_NUMBER'
  | 'LOST';

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'HOT';

export type LeadSource =
  | 'Meta Ads'
  | 'Facebook'
  | 'Instagram'
  | 'WhatsApp'
  | 'WhatsApp Direct'
  | 'Google Ads'
  | 'Website'
  | 'Referral'
  | 'Walk-in'
  | 'Existing Customer'
  | 'Phone'
  | 'Manual'
  | 'Manual Entry'
  | 'Other';

export interface Lead {
  id?: string;
  lead_id?: string;
  customer_id?: string;
  name: string;
  phone?: string;
  whatsapp_number?: string;
  alternate_phone?: string;
  email?: string;
  city?: string;
  source: LeadSource | string;
  campaign_name?: string;
  ad_set_name?: string;
  ad_name?: string;
  service_interested?: string;
  service_purchased?: string;
  requirement?: string;
  lead_status: LeadStatus;
  priority: LeadPriority;
  assigned_to?: string;
  assigned_to_id?: string;
  assigned_to_name?: string;
  created_at: string;
  last_contact_at?: string;
  last_contact_date?: string;
  next_followup_date?: string;
  next_followup_time?: string;
  conversion_date?: string;
  converted_at?: string;
  converted_value?: number;
  conversion_details?: {
    servicePurchased?: string;
    invoiceNumber?: string;
    paymentAmount?: number;
    paymentMethod?: string;
    clientId?: string;
  };
  lost_reason?: string;
  notes?: string;
  tags?: string[];
  total_touchpoints?: number;
  unread_messages_count?: number;
  created_by?: string;
  updated_at?: string;
  is_archived?: boolean;
}

export type LeadFollowupType = 'WhatsApp' | 'Phone Call' | 'Meeting' | 'Consultation' | 'Email' | 'Other' | 'whatsapp' | 'call' | 'meeting' | 'email';
export type LeadFollowupStatus = 'pending' | 'completed' | 'cancelled' | 'overdue';

export interface LeadFollowup {
  id?: string;
  followup_id?: string;
  lead_id: string;
  lead_name?: string;
  whatsapp_number?: string;
  followup_date: string;
  followup_time: string;
  type?: LeadFollowupType | string;
  followup_type?: string;
  notes?: string;
  outcome_notes?: string;
  assigned_to?: string;
  assigned_to_id?: string;
  assigned_to_name?: string;
  status: LeadFollowupStatus;
  completed_at?: string;
  created_at: string;
}

export type LeadActivityType =
  | 'lead_created'
  | 'lead_updated'
  | 'whatsapp_received'
  | 'whatsapp_sent'
  | 'whatsapp_message_received'
  | 'whatsapp_message_sent'
  | 'phone_call'
  | 'followup_scheduled'
  | 'followup_completed'
  | 'status_changed'
  | 'assigned_to_staff'
  | 'assigned'
  | 'note_added'
  | 'appointment_created'
  | 'payment_received'
  | 'lead_converted'
  | 'converted'
  | 'lead_rejected';

export interface LeadActivity {
  id?: string;
  activity_id?: string;
  lead_id: string;
  type?: LeadActivityType | string;
  activity_type?: LeadActivityType | string;
  title: string;
  description: string;
  timestamp?: string;
  created_at?: string;
  performed_by_id?: string;
  performed_by_name?: string;
  user_id?: string;
  user_name?: string;
  metadata?: Record<string, unknown>;
}

export interface LeadMessage {
  id?: string;
  message_id?: string;
  lead_id: string;
  direction: 'inbound' | 'outbound';
  sender_number?: string;
  sender_name?: string;
  recipient_number?: string;
  message_text?: string;
  body?: string;
  message_type?: string;
  media_url?: string;
  media_type?: string;
  raw_payload?: unknown;
  timestamp?: string;
  created_at?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed' | 'received';
  channel?: 'whatsapp_cloud_api' | 'whatsapp_manual' | 'sms' | string;
  source?: string;
  meta_message_id?: string;
  template_name?: string;
}

export interface WhatsAppConfig {
  isConnected: boolean;
  businessAccountId: string;
  phoneNumberId: string;
  accessToken: string;
  webhookVerifyToken: string;
  apiEndpoint: string;
  webhookUrl: string;
  businessPhoneNumber: string;
  displayPhoneNumberName?: string;
  autoLeadCreation: boolean;
  defaultAssignedUserId?: string;
  defaultSource?: string;
  defaultCampaign?: string;
  autoWelcomeMessage?: boolean;
  welcomeMessageTemplate?: string;
}

export interface LeadSettingsData {
  whatsappConfig?: WhatsAppConfig;
  defaultFollowupDays?: number;
  autoAssignStrategy?: 'round_robin' | 'specific_user' | 'manual';
  auto_assign_enabled?: boolean;
  auto_assign_rule?: string;
  autoAssignEnabled?: boolean;
  assignedStaffIds?: string[];
  autoReplyEnabled?: boolean;
  welcomeMessage?: string;
  whatsapp_verify_token?: string;
  whatsapp_phone_number_id?: string;
  whatsapp_business_account_id?: string;
  whatsapp_access_token?: string;
  customSources?: string[];
  customServices?: string[];
  lostReasons?: string[];
  lost_reasons?: string[];
  templates?: { id: string; name: string; content: string; category: string }[];
}

export interface LeadSourceStats {
  source: string;
  leadCount: number;
  convertedCount: number;
  conversionRate: number;
  revenue: number;
}

export interface LeadCampaignStats {
  campaign: string;
  source: string;
  leadCount: number;
  convertedCount: number;
  conversionRate: number;
  revenue: number;
}

export interface LeadDashboardMetrics {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  followupsDueToday: number;
  followupsOverdue: number;
  convertedLeads: number;
  rejectedLeads: number;
  lostLeads: number;
  conversionRate: number;
  totalRevenue: number;
  leadsByDay: { date: string; count: number; converted: number }[];
  leadsBySource: LeadSourceStats[];
  leadsByCampaign: LeadCampaignStats[];
  leadStatusDistribution: { status: LeadStatus; label: string; count: number; color: string }[];
  conversionTrend: { month: string; rate: number; count: number; revenue: number }[];
}
