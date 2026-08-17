/**
 * Data Storage Engine with Pre-seeded realistic records & full CRUD operations
 */

import {
  User,
  Client,
  Appointment,
  GemstoneCategory,
  GemstoneItem,
  PurchaseEntry,
  SalesInvoice,
  SystemLog,
  StoreSettings,
  DashboardStats,
  Lead,
  LeadFollowup,
  LeadActivity,
  LeadMessage,
  LeadSettingsData,
  LeadDashboardMetrics,
} from '../src/types';
import { calculateFullAstrologyChart } from './astronomy/ephemeris';
import {
  DEFAULT_LEADS,
  DEFAULT_LEAD_FOLLOWUPS,
  DEFAULT_LEAD_ACTIVITIES,
  DEFAULT_LEAD_MESSAGES,
  DEFAULT_LEAD_SETTINGS,
} from '../src/data/leadDemoData';

export class StorageEngine {
  public users: User[] = [];
  public clients: Client[] = [];
  public appointments: Appointment[] = [];
  public categories: GemstoneCategory[] = [];
  public inventory: GemstoneItem[] = [];
  public purchases: PurchaseEntry[] = [];
  public sales: SalesInvoice[] = [];
  public logs: SystemLog[] = [];
  public leads: Lead[] = [];
  public leadFollowups: LeadFollowup[] = [];
  public leadActivities: LeadActivity[] = [];
  public leadMessages: LeadMessage[] = [];
  public leadSettings: LeadSettingsData = DEFAULT_LEAD_SETTINGS;
  public settings: StoreSettings = {
    businessName: 'VedicAstro Gems & Astrology Studio',
    tagline: 'Authentic Astrological Consultations & Certified Jyotish Gemstones',
    address: 'Suite 408, Celestial Tower, MG Road, Bangalore & Connaught Place, New Delhi',
    phone: '+91 98450 12345 / +91 11 2334 5678',
    email: 'consult@vedicastro.in',
    website: 'https://vedicastro-gems.in',
    taxRatePercent: 18.0,
    currencySymbol: '₹',
    currencyCode: 'INR',
    currency: 'INR',
    defaultHouseSystem: 'whole_sign',
    defaultZodiacSystem: 'sidereal_lahiri',
    invoiceFooterNote: 'All gemstones are 100% natural, lab-certified, and astrologically energized (Pran Pratishtha performed). Consultations are confidential.',
  };

  constructor() {
    this.seedInitialData();
  }

  public seedInitialData() {
    // 1. Pre-seeded Users (Super Admin, Astrologer, Staff)
    this.users = [
      {
        id: 'usr_admin_1',
        name: 'Acharya Rajesh Sharma',
        email: 'admin@astroerp.com',
        role: 'super_admin',
        status: 'active',
        title: 'Chief Astrologer & Managing Director',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        lastLogin: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        createdAt: '2025-01-10T10:00:00Z',
      },
      {
        id: 'usr_astro_1',
        name: 'Dr. Elena Rostova',
        email: 'elena@astroerp.com',
        role: 'astrologer',
        status: 'active',
        title: 'Senior Western & Vedic Astrologer',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        lastLogin: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        createdAt: '2025-02-01T10:00:00Z',
      },
      {
        id: 'usr_staff_1',
        name: 'Priya Sundaram',
        email: 'priya@astroerp.com',
        role: 'staff',
        status: 'active',
        title: 'Store Manager & Gemologist Coordinator',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        lastLogin: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        createdAt: '2025-02-15T10:00:00Z',
      },
    ];

    // 2. Pre-seeded Categories
    this.categories = [
      { id: 'cat_ruby', name: 'Ruby', sanskritName: 'Manik (माणिक)', rulingPlanet: 'Sun', description: 'Enhances leadership, power, vitality, confidence, and paternal blessings.', color: '#ef4444', count: 8 },
      { id: 'cat_pearl', name: 'Pearl', sanskritName: 'Moti (मोती)', rulingPlanet: 'Moon', description: 'Calms emotions, alleviates anxiety, brings mental peace and maternal grace.', color: '#f8fafc', count: 12 },
      { id: 'cat_emerald', name: 'Emerald', sanskritName: 'Panna (पन्ना)', rulingPlanet: 'Mercury', description: 'Boosts intellect, memory, business success, commercial communication, and speech.', color: '#10b981', count: 15 },
      { id: 'cat_yellow_sapphire', name: 'Yellow Sapphire', sanskritName: 'Pukhraj (पुखराज)', rulingPlanet: 'Jupiter', description: 'Attracts wealth, wisdom, spiritual growth, marriage bliss, and higher education.', color: '#f59e0b', count: 10 },
      { id: 'cat_blue_sapphire', name: 'Blue Sapphire', sanskritName: 'Neelam (नीलम)', rulingPlanet: 'Saturn', description: 'Brings swift fortune, disciplined focus, clears karmic debts, and elevates career.', color: '#3b82f6', count: 6 },
      { id: 'cat_diamond', name: 'Diamond / White Sapphire', sanskritName: 'Heera / Safed Pukhraj', rulingPlanet: 'Venus', description: 'Bestows luxury, artistic charisma, romantic harmony, and financial opulence.', color: '#e0e7ff', count: 9 },
      { id: 'cat_red_coral', name: 'Red Coral', sanskritName: 'Moonga (मूंगा)', rulingPlanet: 'Mars', description: 'Imparts physical stamina, courage, victory over adversaries, and ambition.', color: '#ea580c', count: 14 },
      { id: 'cat_hessonite', name: 'Hessonite Garnet', sanskritName: 'Gomed (गोमेद)', rulingPlanet: 'Rahu', description: 'Protects from hidden enemies, clears confusion, and drives unexpected success.', color: '#b45309', count: 7 },
      { id: 'cat_cats_eye', name: 'Cat’s Eye', sanskritName: 'Lehsunia (लहसुनिया)', rulingPlanet: 'Ketu', description: 'Aids spiritual enlightenment, moksha, shields against psychic attacks and misfortune.', color: '#84cc16', count: 5 },
    ];

    // 3. Pre-seeded Gemstone Inventory
    this.inventory = [
      {
        id: 'gem_101',
        sku: 'YS-CEY-001',
        name: 'Unheated Ceylon Yellow Sapphire (Royal Pukhraj)',
        categoryId: 'cat_yellow_sapphire',
        categoryName: 'Yellow Sapphire',
        weightCarats: 5.45,
        weightRatti: 6.05,
        purchasePrice: 1200,
        salePrice: 2450,
        stockQuantity: 4,
        minStockThreshold: 2,
        supplier: 'Ratnapura Gem Corp, Sri Lanka',
        origin: 'Ratnapura, Sri Lanka',
        certificateNumber: 'GIA-24910284',
        treatment: 'Untreated',
        rulingPlanet: 'Jupiter',
        clarity: 'VVS',
        shapeCut: 'Cushion',
        imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
        notes: 'Golden butter-yellow color with exceptional dispersion. Recommended for Sagittarius and Pisces Ascendant.',
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-02-10T12:00:00Z',
      },
      {
        id: 'gem_102',
        sku: 'EM-ZAM-002',
        name: 'Vibrant Green Zambian Emerald (Panna)',
        categoryId: 'cat_emerald',
        categoryName: 'Emerald',
        weightCarats: 4.20,
        weightRatti: 4.66,
        purchasePrice: 850,
        salePrice: 1750,
        stockQuantity: 1, // LOW STOCK ALERT
        minStockThreshold: 3,
        supplier: 'Kagem Mining Ltd, Zambia',
        origin: 'Zambia',
        certificateNumber: 'IGI-5920194',
        treatment: 'Natural',
        rulingPlanet: 'Mercury',
        clarity: 'VS',
        shapeCut: 'Emerald Cut',
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
        notes: 'Rich saturated green, excellent transparency with minimal natural inclusions. Boosts commerce & speech.',
        createdAt: '2025-01-18T12:00:00Z',
        updatedAt: '2025-02-12T12:00:00Z',
      },
      {
        id: 'gem_103',
        sku: 'BS-KAS-003',
        name: 'Velvety Royal Blue Sapphire (Kashmir Cut Neelam)',
        categoryId: 'cat_blue_sapphire',
        categoryName: 'Blue Sapphire',
        weightCarats: 3.80,
        weightRatti: 4.22,
        purchasePrice: 2200,
        salePrice: 4800,
        stockQuantity: 2, // LOW STOCK ALERT
        minStockThreshold: 3,
        supplier: 'Himalayan Gemstones Ltd',
        origin: 'Kashmir Valley / Sri Lanka',
        certificateNumber: 'GRS-2024-8841',
        treatment: 'Untreated',
        rulingPlanet: 'Saturn',
        clarity: 'VVS',
        shapeCut: 'Oval',
        imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80',
        notes: 'High potency Shani stone. Must conduct 3-day pillow test before wearing.',
        createdAt: '2025-01-20T12:00:00Z',
        updatedAt: '2025-02-14T12:00:00Z',
      },
      {
        id: 'gem_104',
        sku: 'RB-BUR-004',
        name: 'Burmese Pigeon Blood Natural Ruby (Manik)',
        categoryId: 'cat_ruby',
        categoryName: 'Ruby',
        weightCarats: 3.15,
        weightRatti: 3.50,
        purchasePrice: 1500,
        salePrice: 3200,
        stockQuantity: 5,
        minStockThreshold: 2,
        supplier: 'Mogok Gem Traders, Myanmar',
        origin: 'Mogok, Myanmar',
        certificateNumber: 'SSEF-994102',
        treatment: 'Untreated',
        rulingPlanet: 'Sun',
        clarity: 'VVS',
        shapeCut: 'Oval',
        imageUrl: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80',
        notes: 'Glorious inner fire. Enhances leadership and government favor.',
        createdAt: '2025-02-01T12:00:00Z',
        updatedAt: '2025-02-01T12:00:00Z',
      },
      {
        id: 'gem_105',
        sku: 'PL-SS-005',
        name: 'Natural Australian South Sea Cultured Pearl (Moti)',
        categoryId: 'cat_pearl',
        categoryName: 'Pearl',
        weightCarats: 7.20,
        weightRatti: 8.00,
        purchasePrice: 350,
        salePrice: 780,
        stockQuantity: 8,
        minStockThreshold: 3,
        supplier: 'Broome Pearls Co, Australia',
        origin: 'South Sea, Australia',
        certificateNumber: 'GTL-849102',
        treatment: 'Natural',
        rulingPlanet: 'Moon',
        clarity: 'Transparent',
        shapeCut: 'Round',
        imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&auto=format&fit=crop&q=80',
        notes: 'Silvery white sheen with mirror lustre. Calms mind and pacifies stressful Moon.',
        createdAt: '2025-02-03T12:00:00Z',
        updatedAt: '2025-02-03T12:00:00Z',
      },
      {
        id: 'gem_106',
        sku: 'RC-ITA-006',
        name: 'Italian Triangular Red Coral (Moonga)',
        categoryId: 'cat_red_coral',
        categoryName: 'Red Coral',
        weightCarats: 6.50,
        weightRatti: 7.22,
        purchasePrice: 280,
        salePrice: 620,
        stockQuantity: 1, // LOW STOCK ALERT
        minStockThreshold: 4,
        supplier: 'Mediterranean Corals SRL, Italy',
        origin: 'Sardinia, Italy',
        certificateNumber: 'IGJ-771920',
        treatment: 'Natural',
        rulingPlanet: 'Mars',
        clarity: 'Translucent',
        shapeCut: 'Cabochon',
        imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80',
        notes: 'Deep oxblood red color without blemishes. For stamina, property success, and courage.',
        createdAt: '2025-02-05T12:00:00Z',
        updatedAt: '2025-02-05T12:00:00Z',
      },
      {
        id: 'gem_107',
        sku: 'HG-SL-007',
        name: 'Ceylon Honey-Brown Hessonite Garnet (Gomed)',
        categoryId: 'cat_hessonite',
        categoryName: 'Hessonite Garnet',
        weightCarats: 5.80,
        weightRatti: 6.44,
        purchasePrice: 220,
        salePrice: 510,
        stockQuantity: 6,
        minStockThreshold: 2,
        supplier: 'Lanka Gems Ltd',
        origin: 'Sri Lanka',
        certificateNumber: 'GII-339102',
        treatment: 'Natural',
        rulingPlanet: 'Rahu',
        clarity: 'Transparent',
        shapeCut: 'Cushion',
        imageUrl: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=500&auto=format&fit=crop&q=80',
        notes: 'Gomed for Rahu Mahadasha. Clear oily lustre without cloudy bands.',
        createdAt: '2025-02-08T12:00:00Z',
        updatedAt: '2025-02-08T12:00:00Z',
      },
    ];

    // 4. Pre-seeded Clients with attached charts
    const sampleChart1 = calculateFullAstrologyChart({
      name: 'Alexander Sterling',
      birthDate: '1988-06-15',
      birthTime: '08:30',
      placeName: 'London, United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
    });

    const sampleChart2 = calculateFullAstrologyChart({
      name: 'Ananya Deshmukh',
      birthDate: '1994-11-22',
      birthTime: '14:45',
      placeName: 'Mumbai, India',
      latitude: 19.0760,
      longitude: 72.8777,
    });

    this.clients = [
      {
        id: 'cli_1',
        name: 'Alexander Sterling',
        email: 'alexander.s@enterprise.co.uk',
        phone: '+44 7700 900123',
        dateOfBirth: '1988-06-15',
        timeOfBirth: '08:30',
        placeOfBirth: 'London, United Kingdom',
        latitude: 51.5074,
        longitude: -0.1278,
        gender: 'Male',
        occupation: 'Investment Director & Tech Founder',
        address: '14 Mayfair Gardens, London W1K',
        notes: 'VIP Client. Interested in career expansion and corporate synastry. Purchased Ceylon Yellow Sapphire in Jan 2025.',
        tags: ['VIP', 'Corporate', 'Gemstone Buyer', 'Annual Retainer'],
        attachedCharts: [
          {
            id: 'chart_alex_1',
            name: 'Alexander Sterling - Natal Chart (Placidus)',
            calculatedAt: '2025-01-10T14:30:00Z',
            sunSign: sampleChart1.planets.find(p => p.name === 'Sun')?.sign || 'Gemini',
            moonSign: sampleChart1.planets.find(p => p.name === 'Moon')?.sign || 'Cancer',
            ascendantSign: sampleChart1.interpretations.coreAscendant.sign || 'Cancer',
            chartData: sampleChart1,
          },
        ],
        totalConsultations: 4,
        totalSpent: 3250,
        createdAt: '2025-01-08T10:00:00Z',
        updatedAt: '2025-02-12T15:00:00Z',
      },
      {
        id: 'cli_2',
        name: 'Ananya Deshmukh',
        email: 'ananya.deshmukh@gmail.com',
        phone: '+91 98200 45678',
        dateOfBirth: '1994-11-22',
        timeOfBirth: '14:45',
        placeOfBirth: 'Mumbai, India',
        latitude: 19.0760,
        longitude: 72.8777,
        gender: 'Female',
        occupation: 'Architect & Creative Director',
        address: 'Bandra West, Mumbai 400050',
        notes: 'Consulted for marriage timing and career overseas transition. Recommended Zambian Emerald for Mercury activation.',
        tags: ['New Client', 'Astrology Reading', 'Emerald Inquiry'],
        attachedCharts: [
          {
            id: 'chart_ananya_1',
            name: 'Ananya Deshmukh - Natal Chart & D9 Navamsha',
            calculatedAt: '2025-01-22T11:00:00Z',
            sunSign: sampleChart2.planets.find(p => p.name === 'Sun')?.sign || 'Scorpio',
            moonSign: sampleChart2.planets.find(p => p.name === 'Moon')?.sign || 'Cancer',
            ascendantSign: sampleChart2.interpretations.coreAscendant.sign || 'Pisces',
            chartData: sampleChart2,
          },
        ],
        totalConsultations: 2,
        totalSpent: 1950,
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-02-14T11:30:00Z',
      },
      {
        id: 'cli_3',
        name: 'Marcus Vance',
        email: 'mvance@innovatex.io',
        phone: '+1 (415) 890-3342',
        dateOfBirth: '1982-03-10',
        timeOfBirth: '06:15',
        placeOfBirth: 'San Francisco, CA, USA',
        latitude: 37.7749,
        longitude: -122.4194,
        gender: 'Male',
        occupation: 'AI Venture Capitalist',
        address: 'Presidio Heights, San Francisco, CA',
        notes: 'Quarterly transit readings. High interest in planetary timing for fund launches and M&A deals.',
        tags: ['Executive', 'Quarterly Forecast', 'High Net Worth'],
        attachedCharts: [],
        totalConsultations: 3,
        totalSpent: 1200,
        createdAt: '2025-01-25T14:00:00Z',
        updatedAt: '2025-02-05T09:00:00Z',
      },
      {
        id: 'cli_4',
        name: 'Dr. Sophia Lin',
        email: 'sophia.lin@biocure.org',
        phone: '+1 (617) 555-8910',
        dateOfBirth: '1979-09-04',
        timeOfBirth: '21:20',
        placeOfBirth: 'Boston, MA, USA',
        latitude: 42.3601,
        longitude: -71.0589,
        gender: 'Female',
        occupation: 'Biotech Research Director',
        address: 'Cambridge, MA',
        notes: 'Referred by Dr. Elena. Medical astrology and holistic vitality analysis.',
        tags: ['Health Focus', 'Medical Astrology'],
        attachedCharts: [],
        totalConsultations: 1,
        totalSpent: 350,
        createdAt: '2025-02-02T16:00:00Z',
        updatedAt: '2025-02-02T16:00:00Z',
      },
    ];

    // 5. Pre-seeded Appointments
    const today = new Date();
    const formatDateOffset = (offsetDays: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    this.appointments = [
      {
        id: 'apt_1',
        clientId: 'cli_1',
        clientName: 'Alexander Sterling',
        clientEmail: 'alexander.s@enterprise.co.uk',
        clientPhone: '+44 7700 900123',
        astrologerId: 'usr_admin_1',
        astrologerName: 'Acharya Rajesh Sharma',
        date: formatDateOffset(1),
        time: '11:00',
        durationMinutes: 60,
        type: 'natal_reading',
        status: 'scheduled',
        notes: 'Annual Sol Return & 2026-2027 transit forecast for venture capital syndication.',
        fee: 350,
        isPaid: true,
        meetingMode: 'Video Call (Zoom/GMeet)',
        createdAt: '2025-02-10T10:00:00Z',
      },
      {
        id: 'apt_2',
        clientId: 'cli_2',
        clientName: 'Ananya Deshmukh',
        clientEmail: 'ananya.deshmukh@gmail.com',
        clientPhone: '+91 98200 45678',
        astrologerId: 'usr_astro_1',
        astrologerName: 'Dr. Elena Rostova',
        date: formatDateOffset(2),
        time: '15:30',
        durationMinutes: 45,
        type: 'gemstone_consultation',
        status: 'scheduled',
        notes: 'Finalize Zambian Emerald setting and auspicious wearing muhurta calculation.',
        fee: 200,
        isPaid: true,
        meetingMode: 'In-Person',
        createdAt: '2025-02-12T14:00:00Z',
      },
      {
        id: 'apt_3',
        clientId: 'cli_3',
        clientName: 'Marcus Vance',
        clientEmail: 'mvance@innovatex.io',
        clientPhone: '+1 (415) 890-3342',
        astrologerId: 'usr_admin_1',
        astrologerName: 'Acharya Rajesh Sharma',
        date: formatDateOffset(4),
        time: '18:00',
        durationMinutes: 60,
        type: 'career_wealth',
        status: 'scheduled',
        notes: 'Saturn transit through 10th house analysis and wealth protection gemstones.',
        fee: 400,
        isPaid: false,
        meetingMode: 'Video Call (Zoom/GMeet)',
        createdAt: '2025-02-13T16:30:00Z',
      },
      {
        id: 'apt_4',
        clientId: 'cli_4',
        clientName: 'Dr. Sophia Lin',
        clientEmail: 'sophia.lin@biocure.org',
        clientPhone: '+1 (617) 555-8910',
        astrologerId: 'usr_astro_1',
        astrologerName: 'Dr. Elena Rostova',
        date: formatDateOffset(-3),
        time: '10:00',
        durationMinutes: 60,
        type: 'medical_astrology',
        status: 'completed',
        notes: 'Completed full medical astrology chart overview. Prescribed South Sea Pearl for Moon pacification.',
        fee: 350,
        isPaid: true,
        meetingMode: 'Phone Consultation',
        createdAt: '2025-02-05T09:00:00Z',
      },
    ];

    // 6. Pre-seeded Purchases (Incoming Gemstone Shipments)
    this.purchases = [
      {
        id: 'pur_1001',
        invoiceNumber: 'PUR-2025-001',
        supplierName: 'Ratnapura Gem Corp, Sri Lanka',
        supplierContact: 'Mr. Chandana Perera (+94 77 123 4567)',
        purchaseDate: '2025-01-14',
        items: [
          {
            stoneId: 'gem_101',
            stoneName: 'Unheated Ceylon Yellow Sapphire (Royal Pukhraj)',
            categoryId: 'cat_yellow_sapphire',
            categoryName: 'Yellow Sapphire',
            weightCarats: 5.45,
            weightRatti: 6.05,
            quantity: 5,
            unitCost: 1200,
            totalCost: 6000,
            rulingPlanet: 'Jupiter',
            origin: 'Sri Lanka',
          },
        ],
        subtotal: 6000,
        taxAmount: 300,
        grandTotal: 6300,
        status: 'received',
        paymentStatus: 'Paid',
        notes: 'Batch of 5 certified Ceylon yellow sapphires. GIA certified lot.',
        createdAt: '2025-01-14T10:00:00Z',
      },
      {
        id: 'pur_1002',
        invoiceNumber: 'PUR-2025-002',
        supplierName: 'Kagem Mining Ltd, Zambia',
        supplierContact: 'sales@kagememerald.zm',
        purchaseDate: '2025-01-18',
        items: [
          {
            stoneId: 'gem_102',
            stoneName: 'Vibrant Green Zambian Emerald (Panna)',
            categoryId: 'cat_emerald',
            categoryName: 'Emerald',
            weightCarats: 4.20,
            weightRatti: 4.66,
            quantity: 3,
            unitCost: 850,
            totalCost: 2550,
            rulingPlanet: 'Mercury',
            origin: 'Zambia',
          },
        ],
        subtotal: 2550,
        taxAmount: 127.50,
        grandTotal: 2677.50,
        status: 'received',
        paymentStatus: 'Paid',
        notes: 'Top quality untreated Zambian crystal lot with high luster.',
        createdAt: '2025-01-18T14:30:00Z',
      },
    ];

    // 7. Pre-seeded Sales Invoices
    this.sales = [
      {
        id: 'inv_2025_001',
        invoiceNumber: 'INV-2025-0089',
        clientId: 'cli_1',
        clientName: 'Alexander Sterling',
        clientPhone: '+44 7700 900123',
        clientEmail: 'alexander.s@enterprise.co.uk',
        clientAddress: '14 Mayfair Gardens, London W1K',
        saleDate: '2025-01-20',
        items: [
          {
            stoneId: 'gem_101',
            stoneName: 'Unheated Ceylon Yellow Sapphire (Royal Pukhraj)',
            categoryName: 'Yellow Sapphire',
            sku: 'YS-CEY-001',
            weightCarats: 5.45,
            weightRatti: 6.05,
            quantity: 1,
            unitPrice: 2450,
            discountPercent: 5,
            total: 2327.50,
          },
        ],
        subtotal: 2327.50,
        discountAmount: 122.50,
        taxRatePercent: 5,
        taxAmount: 116.38,
        grandTotal: 2443.88,
        paymentMethod: 'Bank Transfer',
        astrologerRecommended: 'Acharya Rajesh Sharma',
        prescriptionDetails: 'Wear on Right Hand Index finger in 18k Yellow Gold on Thursday morning during Guru Hora.',
        notes: 'Pre-energized with 108 Gayatri & Guru Mantras before shipping.',
        createdAt: '2025-01-20T16:00:00Z',
      },
      {
        id: 'inv_2025_002',
        invoiceNumber: 'INV-2025-0090',
        clientId: 'cli_2',
        clientName: 'Ananya Deshmukh',
        clientPhone: '+91 98200 45678',
        clientEmail: 'ananya.deshmukh@gmail.com',
        clientAddress: 'Bandra West, Mumbai',
        saleDate: '2025-02-10',
        items: [
          {
            stoneId: 'gem_102',
            stoneName: 'Vibrant Green Zambian Emerald (Panna)',
            categoryName: 'Emerald',
            sku: 'EM-ZAM-002',
            weightCarats: 4.20,
            weightRatti: 4.66,
            quantity: 1,
            unitPrice: 1750,
            discountPercent: 0,
            total: 1750,
          },
        ],
        subtotal: 1750,
        discountAmount: 0,
        taxRatePercent: 5,
        taxAmount: 87.50,
        grandTotal: 1837.50,
        paymentMethod: 'Credit/Debit Card',
        astrologerRecommended: 'Dr. Elena Rostova',
        prescriptionDetails: 'Wear on Right Hand Little finger in Silver / White Gold on Wednesday morning at Sunrise.',
        notes: 'Custom bezel ring crafted by in-house goldsmith.',
        createdAt: '2025-02-10T12:00:00Z',
      },
    ];

    // 8. Pre-seeded System Logs
    this.logs = [
      {
        id: 'log_1',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        userId: 'usr_admin_1',
        userName: 'Acharya Rajesh Sharma',
        userRole: 'super_admin',
        action: 'USER_LOGIN',
        module: 'Auth',
        details: 'Admin user logged in successfully from IP 192.168.1.45',
      },
      {
        id: 'log_2',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        userId: 'usr_staff_1',
        userName: 'Priya Sundaram',
        userRole: 'staff',
        action: 'INVENTORY_STOCK_UPDATE',
        module: 'Inventory',
        details: 'Adjusted stock quantity for SKU EM-ZAM-002 after quality check (1 in stock).',
      },
      {
        id: 'log_3',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        userId: 'usr_astro_1',
        userName: 'Dr. Elena Rostova',
        userRole: 'astrologer',
        action: 'NATAL_CHART_ATTACHED',
        module: 'CRM',
        details: 'Calculated and saved Natal Chart for Client: Ananya Deshmukh',
      },
      {
        id: 'log_4',
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        userId: 'usr_admin_1',
        userName: 'Acharya Rajesh Sharma',
        userRole: 'super_admin',
        action: 'SALES_INVOICE_GENERATED',
        module: 'Sales',
        details: 'Issued Invoice #INV-2025-0090 to Client Ananya Deshmukh for ₹1,83,750',
      },
    ];

    // 8. Pre-seeded Leads, Follow-ups, Activities, Messages & Settings
    this.leads = [...DEFAULT_LEADS];
    this.leadFollowups = [...DEFAULT_LEAD_FOLLOWUPS];
    this.leadActivities = [...DEFAULT_LEAD_ACTIVITIES];
    this.leadMessages = [...DEFAULT_LEAD_MESSAGES];
    this.leadSettings = { ...DEFAULT_LEAD_SETTINGS };
  }

  // Activity Logger Helper
  public logAction(userId: string, userName: string, userRole: any, action: string, module: any, details: string) {
    const newLog: SystemLog = {
      id: 'log_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action,
      module,
      details,
    };
    this.logs.unshift(newLog);
    if (this.logs.length > 200) {
      this.logs = this.logs.slice(0, 200);
    }
  }

  // Dashboard Aggregator
  public getDashboardStats(): DashboardStats {
    const totalClients = this.clients.length;
    const totalAppointments = this.appointments.length;
    const weeklyAppointments = this.appointments.filter(a => a.status === 'scheduled').length;
    const lowStockItems = this.inventory.filter(item => item.stockQuantity <= item.minStockThreshold);
    const lowStockCount = lowStockItems.length;

    const totalRevenue = this.sales.reduce((acc, sale) => acc + sale.grandTotal, 0);
    const totalStonesInStock = this.inventory.reduce((acc, item) => acc + item.stockQuantity, 0);
    const totalInventoryValuation = this.inventory.reduce((acc, item) => acc + item.stockQuantity * item.salePrice, 0);

    return {
      totalClients,
      weeklyAppointments,
      totalAppointments,
      lowStockCount,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalStonesInStock,
      totalInventoryValuation: Math.round(totalInventoryValuation * 100) / 100,
      monthlyRevenue: Math.round(totalRevenue * 0.75 * 100) / 100,
      recentSales: this.sales.slice(0, 5),
      upcomingAppointments: this.appointments.filter(a => a.status === 'scheduled').slice(0, 5),
      lowStockItems,
      recentLogs: this.logs.slice(0, 8),
    };
  }

  // ---------------- LEAD MANAGEMENT METHODS ---------------- //

  public normalizePhone(phone: string): string {
    if (!phone) return '';
    const clean = phone.replace(/[^0-9+]/g, '');
    if (clean.startsWith('+')) return clean;
    if (clean.length === 10) return '+91' + clean;
    if (clean.startsWith('91') && clean.length === 12) return '+' + clean;
    return '+' + clean;
  }

  public findLeadByPhone(phone: string): Lead | undefined {
    const normalized = this.normalizePhone(phone);
    return this.leads.find(l => {
      const leadNorm = this.normalizePhone(l.whatsapp_number);
      const altNorm = l.alternate_phone ? this.normalizePhone(l.alternate_phone) : '';
      return leadNorm === normalized || (altNorm && altNorm === normalized);
    });
  }

  public logLeadActivity(
    lead_id: string,
    type: any,
    title: string,
    description: string,
    performed_by_name: string = 'System',
    performed_by_id?: string,
    metadata?: Record<string, unknown>
  ) {
    const activity: LeadActivity = {
      activity_id: 'act_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      lead_id,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      performed_by_name,
      performed_by_id,
      metadata,
    };
    this.leadActivities.unshift(activity);
    return activity;
  }

  public getLeadMetrics(): LeadDashboardMetrics {
    const todayStr = new Date().toISOString().split('T')[0];
    const totalLeads = this.leads.length;
    const newLeads = this.leads.filter(l => l.lead_status === 'NEW').length;
    const contactedLeads = this.leads.filter(l => l.lead_status === 'CONTACTED').length;
    const interestedLeads = this.leads.filter(l => l.lead_status === 'INTERESTED').length;
    const convertedLeads = this.leads.filter(l => l.lead_status === 'CONVERTED').length;
    const rejectedLeads = this.leads.filter(l => l.lead_status === 'REJECTED').length;
    const lostLeads = this.leads.filter(l => l.lead_status === 'LOST').length;

    const followupsDueToday = this.leadFollowups.filter(
      f => f.status === 'pending' && f.followup_date === todayStr
    ).length;

    const followupsOverdue = this.leadFollowups.filter(
      f => f.status === 'pending' && f.followup_date < todayStr
    ).length;

    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 1000) / 10 : 0;
    const totalRevenue = this.leads
      .filter(l => l.lead_status === 'CONVERTED')
      .reduce((sum, l) => sum + (l.converted_value || 0), 0);

    // Group by source
    const sourceMap = new Map<string, { total: number; converted: number; revenue: number }>();
    this.leads.forEach(l => {
      const src = l.source || 'Other';
      const curr = sourceMap.get(src) || { total: 0, converted: 0, revenue: 0 };
      curr.total += 1;
      if (l.lead_status === 'CONVERTED') {
        curr.converted += 1;
        curr.revenue += l.converted_value || 0;
      }
      sourceMap.set(src, curr);
    });

    const leadsBySource = Array.from(sourceMap.entries()).map(([source, data]) => ({
      source,
      leadCount: data.total,
      convertedCount: data.converted,
      conversionRate: data.total > 0 ? Math.round((data.converted / data.total) * 1000) / 10 : 0,
      revenue: data.revenue,
    }));

    // Group by campaign
    const campaignMap = new Map<string, { source: string; total: number; converted: number; revenue: number }>();
    this.leads.forEach(l => {
      const cmp = l.campaign_name || 'Direct / Organic';
      const curr = campaignMap.get(cmp) || { source: l.source || 'Direct', total: 0, converted: 0, revenue: 0 };
      curr.total += 1;
      if (l.lead_status === 'CONVERTED') {
        curr.converted += 1;
        curr.revenue += l.converted_value || 0;
      }
      campaignMap.set(cmp, curr);
    });

    const leadsByCampaign = Array.from(campaignMap.entries()).map(([campaign, data]) => ({
      campaign,
      source: data.source,
      leadCount: data.total,
      convertedCount: data.converted,
      conversionRate: data.total > 0 ? Math.round((data.converted / data.total) * 1000) / 10 : 0,
      revenue: data.revenue,
    }));

    const statusColors: Record<string, string> = {
      NEW: '#3b82f6',
      CONTACTED: '#8b5cf6',
      INTERESTED: '#f59e0b',
      FOLLOW_UP: '#06b6d4',
      CONVERTED: '#10b981',
      NO_RESPONSE: '#64748b',
      NOT_INTERESTED: '#94a3b8',
      REJECTED: '#ef4444',
      WRONG_NUMBER: '#f97316',
      LOST: '#dc2626',
    };

    const statusLabels: Record<string, string> = {
      NEW: 'New Lead',
      CONTACTED: 'Contacted',
      INTERESTED: 'Interested',
      FOLLOW_UP: 'Follow-up Scheduled',
      CONVERTED: 'Converted / Paid',
      NO_RESPONSE: 'No Response',
      NOT_INTERESTED: 'Not Interested',
      REJECTED: 'Rejected',
      WRONG_NUMBER: 'Wrong Number',
      LOST: 'Lost Lead',
    };

    const statusCountMap = new Map<string, number>();
    this.leads.forEach(l => {
      const s = l.lead_status || 'NEW';
      statusCountMap.set(s, (statusCountMap.get(s) || 0) + 1);
    });

    const leadStatusDistribution = Array.from(statusCountMap.entries()).map(([status, count]) => ({
      status: status as any,
      label: statusLabels[status] || status,
      count,
      color: statusColors[status] || '#64748b',
    }));

    const dayMap = new Map<string, { count: number; converted: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      dayMap.set(d, { count: 0, converted: 0 });
    }

    this.leads.forEach(l => {
      const day = (l.created_at || '').split('T')[0];
      if (dayMap.has(day)) {
        const val = dayMap.get(day)!;
        val.count += 1;
        if (l.lead_status === 'CONVERTED') {
          val.converted += 1;
        }
      }
    });

    const leadsByDay = Array.from(dayMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      converted: data.converted,
    }));

    const conversionTrend = [
      { month: 'Jun', rate: 22.4, count: 18, revenue: 145000 },
      { month: 'Jul', rate: 26.8, count: 24, revenue: 210000 },
      { month: 'Aug', rate: conversionRate || 28.5, count: convertedLeads, revenue: totalRevenue },
    ];

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      interestedLeads,
      followupsDueToday,
      followupsOverdue,
      convertedLeads,
      rejectedLeads,
      lostLeads,
      conversionRate,
      totalRevenue,
      leadsByDay,
      leadsBySource,
      leadsByCampaign,
      leadStatusDistribution,
      conversionTrend,
    };
  }
}

export const db = new StorageEngine();

// Built-in Top Global & Indian Cities for rapid 1-click autocomplete
export const WORLD_CITIES = [
  { name: 'New York, USA', country: 'United States', lat: 40.7128, lng: -74.0060, tz: -5 },
  { name: 'London, UK', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, tz: 0 },
  { name: 'Mumbai, India', country: 'India', lat: 19.0760, lng: 72.8777, tz: 5.5 },
  { name: 'New Delhi, India', country: 'India', lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { name: 'Bangalore, India', country: 'India', lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { name: 'Kolkata, India', country: 'India', lat: 22.5726, lng: 88.3639, tz: 5.5 },
  { name: 'Chennai, India', country: 'India', lat: 13.0827, lng: 80.2707, tz: 5.5 },
  { name: 'Hyderabad, India', country: 'India', lat: 17.3850, lng: 78.4867, tz: 5.5 },
  { name: 'Ahmedabad, India', country: 'India', lat: 23.0225, lng: 72.5714, tz: 5.5 },
  { name: 'Pune, India', country: 'India', lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { name: 'Jaipur, India', country: 'India', lat: 26.9124, lng: 75.7873, tz: 5.5 },
  { name: 'Varanasi, India', country: 'India', lat: 25.3176, lng: 82.9739, tz: 5.5 },
  { name: 'Dubai, UAE', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, tz: 4 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 8 },
  { name: 'Sydney, Australia', country: 'Australia', lat: -33.8688, lng: 151.2093, tz: 10 },
  { name: 'Los Angeles, USA', country: 'United States', lat: 34.0522, lng: -118.2437, tz: -8 },
  { name: 'San Francisco, USA', country: 'United States', lat: 37.7749, lng: -122.4194, tz: -8 },
  { name: 'Chicago, USA', country: 'United States', lat: 41.8781, lng: -87.6298, tz: -6 },
  { name: 'Toronto, Canada', country: 'Canada', lat: 43.6532, lng: -79.3832, tz: -5 },
  { name: 'Vancouver, Canada', country: 'Canada', lat: 49.2827, lng: -123.1207, tz: -8 },
  { name: 'Paris, France', country: 'France', lat: 48.8566, lng: 2.3522, tz: 1 },
  { name: 'Berlin, Germany', country: 'Germany', lat: 52.5200, lng: 13.4050, tz: 1 },
  { name: 'Rome, Italy', country: 'Italy', lat: 41.9028, lng: 12.4964, tz: 1 },
  { name: 'Tokyo, Japan', country: 'Japan', lat: 35.6762, lng: 139.6503, tz: 9 },
  { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, tz: 8 },
  { name: 'Colombo, Sri Lanka', country: 'Sri Lanka', lat: 6.9271, lng: 79.8612, tz: 5.5 },
  { name: 'Kathmandu, Nepal', country: 'Nepal', lat: 27.7172, lng: 85.3240, tz: 5.75 },
  { name: 'Bangkok, Thailand', country: 'Thailand', lat: 13.7563, lng: 100.5018, tz: 7 },
  { name: 'Johannesburg, South Africa', country: 'South Africa', lat: -26.2041, lng: 28.0473, tz: 2 },
  { name: 'São Paulo, Brazil', country: 'Brazil', lat: -23.5505, lng: -46.6333, tz: -3 },
];
