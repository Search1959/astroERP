/**
 * AstroERP Full-Stack Express Server
 * Providing REST APIs for Public Astrology Engine, CRM, Appointments,
 * Gemstone Inventory, Purchases, Sales Invoices, and Admin Controls.
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, WORLD_CITIES } from './server/storage';
import { calculateFullAstrologyChart } from './server/astronomy/ephemeris';
import { Client, GemstoneItem, SalesInvoice, PurchaseEntry, Appointment, User, Lead, LeadFollowup, LeadActivity, LeadMessage } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Standard Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger for API calls
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // ------------------------------------------------------------- //
  //                       REST API ROUTES                         //
  // ------------------------------------------------------------- //

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'AstroERP',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // ---------------- AUTHENTICATION & USER APIs ---------------- //
  app.post('/api/auth/login', (req, res) => {
    const { email, role } = req.body;
    let user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    
    // If role requested or first time login, fallback or find by role
    if (!user && role) {
      user = db.users.find(u => u.role === role);
    }
    if (!user) {
      user = db.users[0]; // fallback to super admin
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, error: 'This user account has been disabled by the Administrator.' });
    }

    user.lastLogin = new Date().toISOString();
    db.logAction(user.id, user.name, user.role, 'USER_LOGIN', 'Auth', `User logged in (${user.email})`);

    // Simulated JWT token
    const token = `jwt_astro_${user.id}_${Date.now()}`;
    return res.json({
      success: true,
      token,
      user,
      data: user,
    });
  });

  const handleGetUsers = (req: express.Request, res: express.Response) => {
    return res.json({ success: true, data: db.users });
  };

  app.get('/api/auth/users', handleGetUsers);
  app.get('/api/users', handleGetUsers);

  const handleCreateUser = (req: express.Request, res: express.Response) => {
    const { name, email, role, title, avatarUrl } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: 'Name, email, and role are required.' });
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      role,
      status: 'active',
      title: title || (role === 'astrologer' ? 'Astrologer' : role === 'super_admin' ? 'Administrator' : 'Staff Member'),
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    db.logAction('sys', 'System Admin', 'super_admin', 'CREATE_USER', 'Users', `Created new user account: ${name} (${role})`);
    return res.status(201).json({ success: true, data: newUser });
  };

  app.post('/api/auth/users', handleCreateUser);
  app.post('/api/users', handleCreateUser);

  const handleUpdateUser = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'User not found' });

    db.users[index] = { ...db.users[index], ...req.body };
    db.logAction('sys', 'System Admin', 'super_admin', 'UPDATE_USER', 'Users', `Updated user: ${db.users[index].name}`);
    return res.json({ success: true, data: db.users[index] });
  };

  app.put('/api/auth/users/:id', handleUpdateUser);
  app.put('/api/users/:id', handleUpdateUser);

  const handleDeleteUser = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const user = db.users.find(u => u.id === id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.role === 'super_admin' && db.users.filter(u => u.role === 'super_admin').length <= 1) {
      return res.status(400).json({ success: false, error: 'Cannot delete the only Super Admin in the system.' });
    }

    db.users = db.users.filter(u => u.id !== id);
    db.logAction('sys', 'System Admin', 'super_admin', 'DELETE_USER', 'Users', `Deleted user account: ${user.name}`);
    return res.json({ success: true, message: 'User deleted' });
  };

  app.delete('/api/auth/users/:id', handleDeleteUser);
  app.delete('/api/users/:id', handleDeleteUser);

  // ---------------- ASTROLOGY CALCULATION ENGINE APIs ---------------- //
  app.get('/api/astrology/cities', (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.json({ success: true, data: WORLD_CITIES });
    }
    const query = q.toLowerCase();
    const filtered = WORLD_CITIES.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.country.toLowerCase().includes(query)
    );
    return res.json({ success: true, data: filtered });
  });

  app.post('/api/astrology/calculate', (req, res) => {
    try {
      const {
        name,
        birthDate,
        birthTime,
        placeName,
        latitude,
        longitude,
        timezoneOffset,
        houseSystem,
        zodiacSystem,
      } = req.body;

      if (!name || !birthDate || !birthTime) {
        return res.status(400).json({ success: false, error: 'Name, birth date, and birth time are required.' });
      }

      const chartData = calculateFullAstrologyChart({
        name,
        birthDate,
        birthTime,
        placeName: placeName || 'Custom Location',
        latitude: typeof latitude === 'number' ? latitude : 0,
        longitude: typeof longitude === 'number' ? longitude : 0,
        timezoneOffset,
        houseSystem: houseSystem || db.settings.defaultHouseSystem,
        zodiacSystem: zodiacSystem || db.settings.defaultZodiacSystem,
      });

      db.logAction('public', name, 'astrologer', 'CALCULATE_NATAL_CHART', 'Astrology', `Calculated Natal Chart for ${name} (${placeName})`);
      return res.json({ success: true, data: chartData });
    } catch (err: any) {
      console.error('Astrology calculation error:', err);
      return res.status(500).json({ success: false, error: 'Failed to calculate natal chart: ' + err.message });
    }
  });

  // ---------------- CRM CLIENTS APIs ---------------- //
  app.get('/api/clients', (req, res) => {
    const { search, tag } = req.query;
    let list = [...db.clients];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.placeOfBirth.toLowerCase().includes(q)
      );
    }

    if (tag && typeof tag === 'string') {
      list = list.filter(c => c.tags.includes(tag));
    }

    return res.json({ success: true, data: list });
  });

  app.get('/api/clients/:id', (req, res) => {
    const client = db.clients.find(c => c.id === req.params.id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    return res.json({ success: true, data: client });
  });

  app.post('/api/clients', (req, res) => {
    const data = req.body;
    if (!data.name || !data.email) {
      return res.status(400).json({ success: false, error: 'Client name and email are required.' });
    }

    const newClient: Client = {
      id: 'cli_' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      dateOfBirth: data.dateOfBirth || '1990-01-01',
      timeOfBirth: data.timeOfBirth || '12:00',
      placeOfBirth: data.placeOfBirth || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      gender: data.gender || 'Prefer not to say',
      address: data.address || '',
      occupation: data.occupation || '',
      notes: data.notes || '',
      tags: Array.isArray(data.tags) ? data.tags : ['New Client'],
      attachedCharts: [],
      totalConsultations: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Auto-calculate natal chart if coordinates exist
    if (data.dateOfBirth && data.timeOfBirth) {
      try {
        const chart = calculateFullAstrologyChart({
          name: newClient.name,
          birthDate: newClient.dateOfBirth,
          birthTime: newClient.timeOfBirth,
          placeName: newClient.placeOfBirth,
          latitude: newClient.latitude,
          longitude: newClient.longitude,
        });

        newClient.attachedCharts.push({
          id: 'chart_' + Date.now(),
          name: `${newClient.name} - Initial Natal Chart`,
          calculatedAt: new Date().toISOString(),
          sunSign: chart.planets.find(p => p.name === 'Sun')?.sign || 'Aries',
          moonSign: chart.planets.find(p => p.name === 'Moon')?.sign || 'Taurus',
          ascendantSign: chart.interpretations.coreAscendant.sign || 'Gemini',
          chartData: chart,
        });
      } catch (err) {
        console.warn('Auto chart generation skipped:', err);
      }
    }

    db.clients.unshift(newClient);
    db.logAction('sys', 'Staff/Astrologer', 'staff', 'CREATE_CLIENT', 'CRM', `Created new client profile: ${newClient.name}`);
    return res.status(201).json({ success: true, data: newClient });
  });

  app.put('/api/clients/:id', (req, res) => {
    const { id } = req.params;
    const index = db.clients.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Client not found' });

    db.clients[index] = {
      ...db.clients[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    db.logAction('sys', 'Staff/Astrologer', 'staff', 'UPDATE_CLIENT', 'CRM', `Updated client record: ${db.clients[index].name}`);
    return res.json({ success: true, data: db.clients[index] });
  });

  app.delete('/api/clients/:id', (req, res) => {
    const { id } = req.params;
    const client = db.clients.find(c => c.id === id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });

    db.clients = db.clients.filter(c => c.id !== id);
    db.logAction('sys', 'Admin', 'super_admin', 'DELETE_CLIENT', 'CRM', `Deleted client profile: ${client.name}`);
    return res.json({ success: true, message: 'Client removed' });
  });

  // Attach calculated chart to client
  app.post('/api/clients/:id/charts', (req, res) => {
    const { id } = req.params;
    const { chartName, chartData } = req.body;
    const client = db.clients.find(c => c.id === id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });

    const newChart = {
      id: 'chart_' + Date.now(),
      name: chartName || `${client.name} - Natal Chart`,
      calculatedAt: new Date().toISOString(),
      sunSign: chartData.planets?.find((p: any) => p.name === 'Sun')?.sign || 'Aries',
      moonSign: chartData.planets?.find((p: any) => p.name === 'Moon')?.sign || 'Taurus',
      ascendantSign: chartData.interpretations?.coreAscendant?.sign || 'Gemini',
      chartData,
    };

    client.attachedCharts.unshift(newChart);
    client.updatedAt = new Date().toISOString();
    db.logAction('sys', 'Astrologer', 'astrologer', 'ATTACH_CHART', 'CRM', `Attached Natal Chart to ${client.name}`);
    return res.status(201).json({ success: true, data: newChart });
  });

  // ---------------- APPOINTMENT SCHEDULER APIs ---------------- //
  app.get('/api/appointments', (req, res) => {
    const { date, status, astrologerId } = req.query;
    let list = [...db.appointments];

    if (date && typeof date === 'string') {
      list = list.filter(a => a.date === date);
    }
    if (status && typeof status === 'string') {
      list = list.filter(a => a.status === status);
    }
    if (astrologerId && typeof astrologerId === 'string') {
      list = list.filter(a => a.astrologerId === astrologerId);
    }

    // Sort by date & time ascending
    list.sort((a, b) => (a.date + 'T' + a.time).localeCompare(b.date + 'T' + b.time));
    return res.json({ success: true, data: list });
  });

  app.post('/api/appointments', (req, res) => {
    const data = req.body;
    if (!data.clientName || !data.date || !data.time) {
      return res.status(400).json({ success: false, error: 'Client name, date, and time are required.' });
    }

    const astrologer = db.users.find(u => u.id === data.astrologerId) || db.users.find(u => u.role === 'astrologer') || db.users[0];

    const newAppointment: Appointment = {
      id: 'apt_' + Date.now(),
      clientId: data.clientId || '',
      clientName: data.clientName,
      clientEmail: data.clientEmail || '',
      clientPhone: data.clientPhone || '',
      astrologerId: astrologer.id,
      astrologerName: astrologer.name,
      date: data.date,
      time: data.time,
      durationMinutes: Number(data.durationMinutes) || 60,
      type: data.type || 'natal_reading',
      status: 'scheduled',
      notes: data.notes || '',
      fee: Number(data.fee) || 250,
      isPaid: Boolean(data.isPaid),
      meetingMode: data.meetingMode || 'Video Call (Zoom/GMeet)',
      createdAt: new Date().toISOString(),
    };

    // Update client stats if client exists
    if (data.clientId) {
      const client = db.clients.find(c => c.id === data.clientId);
      if (client) {
        client.totalConsultations += 1;
        if (newAppointment.isPaid) client.totalSpent += newAppointment.fee;
      }
    }

    db.appointments.push(newAppointment);
    db.logAction('sys', 'Staff', 'staff', 'BOOK_APPOINTMENT', 'CRM', `Booked appointment for ${newAppointment.clientName} on ${newAppointment.date} at ${newAppointment.time}`);
    return res.status(201).json({ success: true, data: newAppointment });
  });

  app.put('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const index = db.appointments.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Appointment not found' });

    db.appointments[index] = { ...db.appointments[index], ...req.body };
    db.logAction('sys', 'Staff', 'staff', 'UPDATE_APPOINTMENT', 'CRM', `Updated appointment #${id} for ${db.appointments[index].clientName}`);
    return res.json({ success: true, data: db.appointments[index] });
  });

  app.patch('/api/appointments/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const appt = db.appointments.find(a => a.id === id);
    if (!appt) return res.status(404).json({ success: false, error: 'Appointment not found' });

    appt.status = status;
    db.logAction('sys', 'Staff', 'staff', 'APPOINTMENT_STATUS_CHANGE', 'CRM', `Changed status of appointment #${id} to ${status}`);
    return res.json({ success: true, data: appt });
  });

  app.delete('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    db.appointments = db.appointments.filter(a => a.id !== id);
    db.logAction('sys', 'Staff', 'staff', 'CANCEL_APPOINTMENT', 'CRM', `Deleted appointment #${id}`);
    return res.json({ success: true, message: 'Appointment removed' });
  });

  // ---------------- GEMSTONE INVENTORY APIs ---------------- //
  app.get('/api/inventory/categories', (req, res) => {
    // Dynamically calculate count for each category
    const categoriesWithCount = db.categories.map(cat => ({
      ...cat,
      count: db.inventory.filter(item => item.categoryId === cat.id).length,
    }));
    return res.json({ success: true, data: categoriesWithCount });
  });

  app.post('/api/inventory/categories', (req, res) => {
    const { name, sanskritName, rulingPlanet, description, color } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Category name is required' });

    const newCat = {
      id: 'cat_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name,
      sanskritName: sanskritName || name,
      rulingPlanet: rulingPlanet || 'Sun',
      description: description || '',
      color: color || '#6366f1',
      count: 0,
    };

    db.categories.push(newCat);
    db.logAction('sys', 'Admin', 'super_admin', 'CREATE_CATEGORY', 'Inventory', `Added gemstone category: ${name}`);
    return res.status(201).json({ success: true, data: newCat });
  });

  app.get('/api/inventory', (req, res) => {
    const { categoryId, search, lowStockOnly, sortBy } = req.query;
    let list = [...db.inventory];

    if (categoryId && typeof categoryId === 'string' && categoryId !== 'all') {
      list = list.filter(item => item.categoryId === categoryId);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.rulingPlanet.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        (item.certificateNumber && item.certificateNumber.toLowerCase().includes(q))
      );
    }

    if (lowStockOnly === 'true') {
      list = list.filter(item => item.stockQuantity <= item.minStockThreshold);
    }

    if (sortBy === 'price_asc') list.sort((a, b) => a.salePrice - b.salePrice);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.salePrice - a.salePrice);
    else if (sortBy === 'weight_desc') list.sort((a, b) => b.weightCarats - a.weightCarats);
    else if (sortBy === 'stock_asc') list.sort((a, b) => a.stockQuantity - b.stockQuantity);
    else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return res.json({ success: true, data: list });
  });

  app.get('/api/inventory/:id', (req, res) => {
    const item = db.inventory.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Gemstone not found' });
    return res.json({ success: true, data: item });
  });

  app.post('/api/inventory', (req, res) => {
    const data = req.body;
    if (!data.name || !data.categoryId || data.salePrice === undefined) {
      return res.status(400).json({ success: false, error: 'Name, Category, and Sale Price are required.' });
    }

    const category = db.categories.find(c => c.id === data.categoryId) || db.categories[0];
    const weightCarats = Number(data.weightCarats) || 1.0;
    const weightRatti = Number(data.weightRatti) || Math.round(weightCarats * 1.11 * 100) / 100;

    const newItem: GemstoneItem = {
      id: 'gem_' + Date.now(),
      sku: data.sku || (category.name.substring(0, 2).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000)),
      name: data.name,
      categoryId: category.id,
      categoryName: category.name,
      weightCarats,
      weightRatti,
      purchasePrice: Number(data.purchasePrice) || 0,
      salePrice: Number(data.salePrice) || 0,
      stockQuantity: Number(data.stockQuantity) || 1,
      minStockThreshold: Number(data.minStockThreshold) || 2,
      supplier: data.supplier || 'Certified Gem Mart',
      origin: data.origin || 'Sri Lanka',
      certificateNumber: data.certificateNumber || 'GIA-' + Math.floor(1000000 + Math.random() * 9000000),
      treatment: data.treatment || 'Natural',
      rulingPlanet: data.rulingPlanet || category.rulingPlanet || 'Jupiter',
      clarity: data.clarity || 'VVS',
      shapeCut: data.shapeCut || 'Oval',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.inventory.unshift(newItem);
    db.logAction('sys', 'Staff', 'staff', 'ADD_GEMSTONE', 'Inventory', `Added new stone SKU ${newItem.sku}: ${newItem.name}`);
    return res.status(201).json({ success: true, data: newItem });
  });

  app.put('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const index = db.inventory.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Gemstone not found' });

    const current = db.inventory[index];
    const category = req.body.categoryId ? db.categories.find(c => c.id === req.body.categoryId) : null;

    db.inventory[index] = {
      ...current,
      ...req.body,
      categoryName: category ? category.name : current.categoryName,
      updatedAt: new Date().toISOString(),
    };

    db.logAction('sys', 'Staff', 'staff', 'UPDATE_GEMSTONE', 'Inventory', `Updated stone SKU ${db.inventory[index].sku}`);
    return res.json({ success: true, data: db.inventory[index] });
  });

  app.delete('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const stone = db.inventory.find(i => i.id === id);
    if (!stone) return res.status(404).json({ success: false, error: 'Gemstone not found' });

    db.inventory = db.inventory.filter(i => i.id !== id);
    db.logAction('sys', 'Staff', 'super_admin', 'DELETE_GEMSTONE', 'Inventory', `Deleted stone SKU ${stone.sku}: ${stone.name}`);
    return res.json({ success: true, message: 'Stone removed from inventory' });
  });

  // Bulk CSV Import for Stones
  app.post('/api/inventory/bulk-import', (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items provided in bulk upload payload' });
    }

    let addedCount = 0;
    for (const row of items) {
      if (!row.name || !row.salePrice) continue;
      const category = db.categories.find(c => c.name.toLowerCase() === (row.categoryName || '').toLowerCase()) || db.categories[0];
      const weightCarats = Number(row.weightCarats) || 3.0;

      const newItem: GemstoneItem = {
        id: 'gem_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        sku: row.sku || (category.name.substring(0, 2).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000)),
        name: row.name,
        categoryId: category.id,
        categoryName: category.name,
        weightCarats,
        weightRatti: Number(row.weightRatti) || Math.round(weightCarats * 1.11 * 100) / 100,
        purchasePrice: Number(row.purchasePrice) || 0,
        salePrice: Number(row.salePrice) || 500,
        stockQuantity: Number(row.stockQuantity) || 1,
        minStockThreshold: Number(row.minStockThreshold) || 2,
        supplier: row.supplier || 'Bulk Import Lot',
        origin: row.origin || 'Sri Lanka / Zambia',
        certificateNumber: row.certificateNumber || 'CERT-' + Math.floor(100000 + Math.random() * 900000),
        treatment: row.treatment || 'Natural',
        rulingPlanet: row.rulingPlanet || category.rulingPlanet,
        clarity: row.clarity || 'VVS',
        shapeCut: row.shapeCut || 'Oval',
        imageUrl: row.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
        notes: row.notes || 'Imported via CSV',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.inventory.unshift(newItem);
      addedCount++;
    }

    db.logAction('sys', 'Admin', 'super_admin', 'BULK_IMPORT_INVENTORY', 'Inventory', `Bulk imported ${addedCount} gemstones`);
    return res.status(201).json({ success: true, count: addedCount, data: db.inventory });
  });

  // ---------------- PURCHASES & SUPPLIER MANAGEMENT APIs ---------------- //
  app.get('/api/purchases', (req, res) => {
    return res.json({ success: true, data: db.purchases });
  });

  app.post('/api/purchases', (req, res) => {
    const data = req.body;
    if (!data.supplierName || !Array.isArray(data.items) || data.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Supplier name and at least one purchase line item are required.' });
    }

    let subtotal = 0;
    data.items.forEach((item: any) => {
      item.totalCost = (Number(item.quantity) || 1) * (Number(item.unitCost) || 0);
      subtotal += item.totalCost;

      // Automatically update or create inventory item
      if (item.stoneId) {
        const existing = db.inventory.find(i => i.id === item.stoneId);
        if (existing) {
          existing.stockQuantity += Number(item.quantity) || 1;
          existing.purchasePrice = Number(item.unitCost) || existing.purchasePrice;
          existing.updatedAt = new Date().toISOString();
        }
      } else {
        // Create new item in inventory
        const category = db.categories.find(c => c.id === item.categoryId) || db.categories[0];
        const weightCarats = Number(item.weightCarats) || 3.0;
        const newStone: GemstoneItem = {
          id: 'gem_' + Date.now() + '_' + Math.floor(Math.random() * 100),
          sku: category.name.substring(0, 2).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
          name: item.stoneName,
          categoryId: category.id,
          categoryName: category.name,
          weightCarats,
          weightRatti: Number(item.weightRatti) || Math.round(weightCarats * 1.11 * 100) / 100,
          purchasePrice: Number(item.unitCost) || 0,
          salePrice: Math.round((Number(item.unitCost) || 500) * 1.8),
          stockQuantity: Number(item.quantity) || 1,
          minStockThreshold: 2,
          supplier: data.supplierName,
          origin: item.origin || 'Imported Lot',
          treatment: 'Natural',
          rulingPlanet: item.rulingPlanet || category.rulingPlanet,
          clarity: 'VVS',
          shapeCut: 'Oval',
          imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.inventory.unshift(newStone);
        item.stoneId = newStone.id;
      }
    });

    const taxAmount = Math.round(subtotal * (db.settings.taxRatePercent / 100) * 100) / 100;
    const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

    const newPurchase: PurchaseEntry = {
      id: 'pur_' + Date.now(),
      invoiceNumber: data.invoiceNumber || 'PUR-' + new Date().getFullYear() + '-' + String(db.purchases.length + 1).padStart(3, '0'),
      supplierName: data.supplierName,
      supplierContact: data.supplierContact || '',
      purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
      items: data.items,
      subtotal,
      taxAmount,
      grandTotal,
      status: 'received',
      paymentStatus: data.paymentStatus || 'Paid',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };

    db.purchases.unshift(newPurchase);
    db.logAction('sys', 'Staff', 'staff', 'PURCHASE_ENTRY', 'Purchases', `Recorded purchase #${newPurchase.invoiceNumber} from ${newPurchase.supplierName} ($${grandTotal})`);
    return res.status(201).json({ success: true, data: newPurchase });
  });

  // ---------------- SALES INVOICE & CLIENT POS APIs ---------------- //
  app.get('/api/sales', (req, res) => {
    return res.json({ success: true, data: db.sales });
  });

  app.post('/api/sales', (req, res) => {
    const data = req.body;
    if (!data.clientId || !Array.isArray(data.items) || data.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Client and at least one item are required to generate invoice.' });
    }

    const client = db.clients.find(c => c.id === data.clientId);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });

    let subtotal = 0;
    let discountTotal = 0;

    // Process items and deduct stock
    for (const item of data.items) {
      const stone = db.inventory.find(i => i.id === item.stoneId);
      if (!stone) {
        return res.status(400).json({ success: false, error: `Stone ${item.stoneName} not found in inventory.` });
      }
      if (stone.stockQuantity < (Number(item.quantity) || 1)) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${stone.name}. Available: ${stone.stockQuantity}` });
      }

      // Decrement inventory stock
      stone.stockQuantity -= Number(item.quantity) || 1;
      stone.updatedAt = new Date().toISOString();

      const unitPrice = Number(item.unitPrice) || stone.salePrice;
      const qty = Number(item.quantity) || 1;
      const discPct = Number(item.discountPercent) || 0;
      const rawPrice = unitPrice * qty;
      const discVal = (rawPrice * discPct) / 100;
      const lineTotal = rawPrice - discVal;

      item.unitPrice = unitPrice;
      item.quantity = qty;
      item.discountPercent = discPct;
      item.total = Math.round(lineTotal * 100) / 100;
      item.sku = stone.sku;

      subtotal += lineTotal;
      discountTotal += discVal;
    }

    const taxRate = db.settings.taxRatePercent;
    const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

    const newInvoice: SalesInvoice = {
      id: 'inv_' + Date.now(),
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + String(db.sales.length + 91).padStart(4, '0'),
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email,
      clientAddress: client.address || '',
      saleDate: data.saleDate || new Date().toISOString().split('T')[0],
      items: data.items,
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountTotal * 100) / 100,
      taxRatePercent: taxRate,
      taxAmount,
      grandTotal,
      paymentMethod: data.paymentMethod || 'Credit/Debit Card',
      astrologerRecommended: data.astrologerRecommended || 'Acharya Rajesh Sharma',
      prescriptionDetails: data.prescriptionDetails || 'Prescribed as per natal chart planetary strength analysis.',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };

    // Update Client CRM metrics
    client.totalSpent = Math.round((client.totalSpent + grandTotal) * 100) / 100;
    if (!client.tags.includes('Gemstone Buyer')) {
      client.tags.push('Gemstone Buyer');
    }

    db.sales.unshift(newInvoice);
    db.logAction('sys', 'Staff', 'staff', 'SALES_INVOICE_GENERATED', 'Sales', `Created Sales Invoice #${newInvoice.invoiceNumber} for ${client.name} ($${grandTotal})`);
    return res.status(201).json({ success: true, data: newInvoice });
  });

  // ---------------- DASHBOARD & ANALYTICS APIs ---------------- //
  app.get('/api/dashboard/stats', (req, res) => {
    return res.json({ success: true, data: db.getDashboardStats() });
  });

  // ---------------- AUDIT LOGS APIs ---------------- //
  const handleGetLogs = (req: express.Request, res: express.Response) => {
    const { module, search } = req.query;
    let list = [...db.logs];

    if (module && typeof module === 'string' && module !== 'all') {
      list = list.filter(l => l.module === module);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.userName.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, data: list });
  };

  app.get('/api/logs', handleGetLogs);
  app.get('/api/audit-logs', handleGetLogs);

  // ---------------- SETTINGS APIs ---------------- //
  app.get('/api/settings', (req, res) => {
    return res.json({ success: true, data: db.settings });
  });

  app.put('/api/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    db.logAction('sys', 'Admin', 'super_admin', 'UPDATE_SETTINGS', 'Settings', 'Updated store configuration and tax rates');
    return res.json({ success: true, data: db.settings });
  });

  // ---------------- SEO CRAWLERS & SITEMAP APIs ---------------- //
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const host = `${req.protocol}://${req.get('host')}`;
    const currentDate = new Date().toISOString().split('T')[0];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${host}/?tab=astrology</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${host}/?tab=inventory</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${host}/?tab=appointments</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    res.type('application/xml');
    res.send(sitemap);
  });

  // ---------------- LEAD MANAGEMENT & WHATSAPP CRM APIs ---------------- //

  // 1. WhatsApp Webhook Verification (Meta Graph API)
  app.get('/api/webhooks/whatsapp', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = db.leadSettings?.whatsappConfig?.webhookVerifyToken || 'astronexus_wa_verify_secure_2026';

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('✅ WhatsApp Webhook verified successfully');
        return res.status(200).send(challenge);
      } else {
        console.warn('❌ WhatsApp Webhook token mismatch:', token);
        return res.sendStatus(403);
      }
    }
    return res.status(200).json({ status: 'active', message: 'WhatsApp Webhook Endpoint Ready' });
  });

  // 2. WhatsApp Incoming Webhook Event Ingestion (Meta Click-to-WhatsApp Ads & Messages)
  app.post('/api/webhooks/whatsapp', (req, res) => {
    try {
      const body = req.body;
      console.log('📩 Incoming WhatsApp Webhook Payload:', JSON.stringify(body, null, 2));

      if (body.object === 'whatsapp_business_account' || body.entry) {
        const entries = body.entry || [];
        for (const entry of entries) {
          const changes = entry.changes || [];
          for (const change of changes) {
            const value = change.value;
            if (value && value.messages && value.messages.length > 0) {
              for (const msg of value.messages) {
                const senderPhone = '+' + (msg.from || '').replace(/[^0-9]/g, '');
                const contact = value.contacts?.find((c: any) => c.wa_id === msg.from);
                const senderName = contact?.profile?.name || 'WhatsApp Customer';

                let messageText = '';
                if (msg.type === 'text') {
                  messageText = msg.text?.body || '';
                } else if (msg.type === 'button') {
                  messageText = msg.button?.text || msg.button?.payload || '[Button Clicked]';
                } else if (msg.type === 'interactive') {
                  messageText = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || '[Interactive Response]';
                } else {
                  messageText = `[${msg.type || 'Media'} message]`;
                }

                // Extract referral info (Meta Ads click-to-WhatsApp)
                const referral = msg.referral || {};
                const source = referral.source_type === 'ad' ? 'Meta Ads' : 'WhatsApp';
                const campaign_name = referral.headline || referral.source_id || db.leadSettings.whatsappConfig.defaultCampaign || 'Meta_ClickToWhatsApp';
                const ad_name = referral.body || referral.source_url || '';

                // Find or create lead
                let lead = db.findLeadByPhone(senderPhone);
                const isNew = !lead;

                if (!lead) {
                  const leadId = `LEAD-${new Date().getFullYear()}-${1000 + db.leads.length + 1}`;
                  lead = {
                    lead_id: leadId,
                    name: senderName,
                    whatsapp_number: senderPhone,
                    source: source as any,
                    campaign_name: campaign_name,
                    ad_name: ad_name,
                    service_interested: 'Gemstone Consultation & Prescription',
                    requirement: messageText,
                    lead_status: 'NEW',
                    priority: 'HIGH',
                    assigned_to: db.leadSettings.whatsappConfig.defaultAssignedUserId || 'usr_astro_1',
                    assigned_to_name: 'Dr. Elena Rostova',
                    created_at: new Date().toISOString(),
                    last_contact_at: new Date().toISOString(),
                    next_followup_date: new Date().toISOString().split('T')[0],
                    notes: `Lead captured automatically from ${source}. First message: "${messageText}"`,
                    tags: ['WhatsApp Inbound', 'Meta Lead'],
                    created_by: 'WhatsApp Webhook',
                    updated_at: new Date().toISOString(),
                    unread_messages_count: 1,
                  };
                  db.leads.unshift(lead);

                  db.logLeadActivity(
                    lead.lead_id,
                    'lead_created',
                    'New Lead via WhatsApp',
                    `Inbound message from ${senderPhone} (${senderName}): "${messageText}"`,
                    'WhatsApp Webhook'
                  );
                } else {
                  lead.last_contact_at = new Date().toISOString();
                  lead.updated_at = new Date().toISOString();
                  lead.unread_messages_count = (lead.unread_messages_count || 0) + 1;
                  if (lead.lead_status === 'NO_RESPONSE' || lead.lead_status === 'LOST') {
                    lead.lead_status = 'CONTACTED';
                  }

                  db.logLeadActivity(
                    lead.lead_id,
                    'whatsapp_received',
                    'WhatsApp Message Received',
                    `"${messageText}"`,
                    senderName
                  );
                }

                // Store message record
                const newMsg: LeadMessage = {
                  message_id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                  lead_id: lead.lead_id,
                  direction: 'inbound',
                  sender_number: senderPhone,
                  sender_name: senderName,
                  recipient_number: db.leadSettings.whatsappConfig.businessPhoneNumber,
                  message_text: messageText,
                  timestamp: new Date().toISOString(),
                  status: 'received',
                  channel: 'whatsapp_cloud_api',
                  raw_payload: msg,
                };
                db.leadMessages.push(newMsg);
              }
            }
          }
        }
      }

      return res.status(200).json({ success: true, message: 'EVENT_RECEIVED' });
    } catch (err: any) {
      console.error('WhatsApp Webhook Error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Lead Dashboard Metrics
  app.get('/api/leads/dashboard/stats', (req, res) => {
    const stats = db.getLeadMetrics();
    return res.json({ success: true, data: stats });
  });

  // 4. Lead Settings
  app.get('/api/leads/settings', (req, res) => {
    return res.json({ success: true, data: db.leadSettings });
  });

  app.post('/api/leads/settings', (req, res) => {
    db.leadSettings = {
      ...db.leadSettings,
      ...req.body,
    };
    db.logAction('sys', 'Admin', 'super_admin', 'LEAD_SETTINGS_UPDATE', 'CRM', 'Updated CRM & WhatsApp configuration');
    return res.json({ success: true, data: db.leadSettings });
  });

  // 5. Check Duplicate
  app.get('/api/leads/check-duplicate', (req, res) => {
    const { phone, email } = req.query;
    if (!phone && !email) {
      return res.json({ success: true, duplicate: false });
    }

    let existingLead: Lead | undefined;
    if (phone && typeof phone === 'string') {
      existingLead = db.findLeadByPhone(phone);
    }
    if (!existingLead && email && typeof email === 'string') {
      existingLead = db.leads.find(l => l.email?.toLowerCase() === email.toLowerCase());
    }

    if (existingLead) {
      return res.json({
        success: true,
        duplicate: true,
        lead: existingLead,
        message: `A lead already exists with this contact (${existingLead.name} - ${existingLead.lead_id})`,
      });
    }
    return res.json({ success: true, duplicate: false });
  });

  // 6. Get All Leads (with filtering, search, sorting)
  app.get('/api/leads', (req, res) => {
    let result = [...db.leads];
    const { status, source, campaign, priority, assigned_to, q, date_from, date_to } = req.query;

    if (status && typeof status === 'string' && status !== 'ALL') {
      result = result.filter(l => l.lead_status === status);
    }
    if (source && typeof source === 'string' && source !== 'ALL') {
      result = result.filter(l => l.source === source);
    }
    if (campaign && typeof campaign === 'string' && campaign !== 'ALL') {
      result = result.filter(l => l.campaign_name === campaign);
    }
    if (priority && typeof priority === 'string' && priority !== 'ALL') {
      result = result.filter(l => l.priority === priority);
    }
    if (assigned_to && typeof assigned_to === 'string' && assigned_to !== 'ALL') {
      result = result.filter(l => l.assigned_to === assigned_to);
    }
    if (date_from && typeof date_from === 'string') {
      result = result.filter(l => (l.created_at || '').split('T')[0] >= date_from);
    }
    if (date_to && typeof date_to === 'string') {
      result = result.filter(l => (l.created_at || '').split('T')[0] <= date_to);
    }
    if (q && typeof q === 'string') {
      const search = q.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(search) ||
        l.whatsapp_number.includes(search) ||
        (l.email && l.email.toLowerCase().includes(search)) ||
        (l.lead_id && l.lead_id.toLowerCase().includes(search)) ||
        (l.service_interested && l.service_interested.toLowerCase().includes(search)) ||
        (l.notes && l.notes.toLowerCase().includes(search))
      );
    }

    // Sort by updated_at / created_at descending
    result.sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());

    return res.json({ success: true, data: result, total: result.length });
  });

  // 7. Create New Lead (Manual Entry or API)
  app.post('/api/leads', (req, res) => {
    const {
      name,
      whatsapp_number,
      alternate_phone,
      email,
      source,
      campaign_name,
      ad_set_name,
      ad_name,
      service_interested,
      requirement,
      lead_status,
      priority,
      assigned_to,
      assigned_to_name,
      next_followup_date,
      next_followup_time,
      notes,
      tags,
    } = req.body;

    if (!name || !whatsapp_number) {
      return res.status(400).json({ success: false, error: 'Full Name and WhatsApp number are required.' });
    }

    const normalizedPhone = db.normalizePhone(whatsapp_number);

    // Duplicate check
    const existing = db.findLeadByPhone(normalizedPhone);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Duplicate Lead: Phone number already exists under ${existing.name} (${existing.lead_id})`,
        lead: existing,
      });
    }

    const leadId = `LEAD-${new Date().getFullYear()}-${1000 + db.leads.length + 1}`;
    const newLead: Lead = {
      lead_id: leadId,
      name,
      whatsapp_number: normalizedPhone,
      alternate_phone: alternate_phone ? db.normalizePhone(alternate_phone) : undefined,
      email,
      source: source || 'Manual',
      campaign_name: campaign_name || 'Direct_WalkIn',
      ad_set_name,
      ad_name,
      service_interested: service_interested || 'Gemstone Consultation & Prescription',
      requirement: requirement || '',
      lead_status: lead_status || 'NEW',
      priority: priority || 'MEDIUM',
      assigned_to: assigned_to || 'usr_admin_1',
      assigned_to_name: assigned_to_name || 'Apex7 Admin',
      created_at: new Date().toISOString(),
      last_contact_at: new Date().toISOString(),
      next_followup_date,
      next_followup_time,
      notes: notes || '',
      tags: Array.isArray(tags) ? tags : ['Manual Lead'],
      created_by: 'Staff / Admin',
      updated_at: new Date().toISOString(),
      unread_messages_count: 0,
    };

    db.leads.unshift(newLead);

    // Log Activity
    db.logLeadActivity(
      newLead.lead_id,
      'lead_created',
      'Lead Created',
      `Manual lead created by staff for ${newLead.name} (${newLead.whatsapp_number})`,
      assigned_to_name || 'Staff'
    );

    // If followup date is specified, create followup item
    if (next_followup_date) {
      const followup: LeadFollowup = {
        followup_id: 'flw_' + Date.now(),
        lead_id: newLead.lead_id,
        lead_name: newLead.name,
        whatsapp_number: newLead.whatsapp_number,
        followup_date: next_followup_date,
        followup_time: next_followup_time || '11:00',
        type: 'WhatsApp',
        notes: notes || 'Initial follow-up',
        assigned_to: newLead.assigned_to,
        assigned_to_name: newLead.assigned_to_name,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      db.leadFollowups.unshift(followup);
    }

    return res.status(201).json({ success: true, data: newLead });
  });

  // 8. Get Single Lead with full details
  app.get('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    const lead = db.leads.find(l => l.lead_id === id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });

    const followups = db.leadFollowups.filter(f => f.lead_id === id);
    const activities = db.leadActivities.filter(a => a.lead_id === id);
    const messages = db.leadMessages.filter(m => m.lead_id === id);

    // Reset unread messages count on opening
    lead.unread_messages_count = 0;

    return res.json({
      success: true,
      data: {
        ...lead,
        followups,
        activities,
        messages,
      },
    });
  });

  // 9. Update Lead
  app.put('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    const index = db.leads.findIndex(l => l.lead_id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Lead not found' });

    const oldLead = db.leads[index];
    const updates = req.body;

    // Track status change activity
    if (updates.lead_status && updates.lead_status !== oldLead.lead_status) {
      db.logLeadActivity(
        id,
        'status_changed',
        `Status changed to ${updates.lead_status}`,
        `Moved from ${oldLead.lead_status} to ${updates.lead_status}`,
        updates.performer_name || 'Staff'
      );
    }

    // Track assignment change
    if (updates.assigned_to && updates.assigned_to !== oldLead.assigned_to) {
      db.logLeadActivity(
        id,
        'lead_assigned',
        `Lead Reassigned`,
        `Assigned to ${updates.assigned_to_name || updates.assigned_to}`,
        updates.performer_name || 'Admin'
      );
    }

    db.leads[index] = {
      ...oldLead,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return res.json({ success: true, data: db.leads[index] });
  });

  // 10. Delete Lead
  app.delete('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    const lead = db.leads.find(l => l.lead_id === id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });

    db.leads = db.leads.filter(l => l.lead_id !== id);
    db.leadFollowups = db.leadFollowups.filter(f => f.lead_id !== id);
    db.leadActivities = db.leadActivities.filter(a => a.lead_id !== id);
    db.leadMessages = db.leadMessages.filter(m => m.lead_id !== id);

    db.logAction('sys', 'Admin', 'super_admin', 'DELETE_LEAD', 'CRM', `Deleted lead ${lead.name} (${lead.lead_id})`);
    return res.json({ success: true, message: 'Lead deleted successfully' });
  });

  // 11. Convert Lead to Customer (Creates AstroERP Client and/or Invoice)
  app.post('/api/leads/:id/convert', (req, res) => {
    const { id } = req.params;
    const lead = db.leads.find(l => l.lead_id === id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });

    const { servicePurchased, paymentAmount, paymentMethod, notes, createClient = true } = req.body;

    let clientId = lead.customer_id;

    // Create client in AstroERP if requested or not already linked
    if (createClient && !clientId) {
      clientId = 'cli_' + Date.now();
      const newClient: Client = {
        id: clientId,
        name: lead.name,
        phone: lead.whatsapp_number || lead.phone || '',
        email: lead.email || '',
        gender: 'Other',
        address: '',
        dateOfBirth: '1995-01-01',
        timeOfBirth: '12:00',
        placeOfBirth: 'Bangalore, India',
        latitude: 12.9716,
        longitude: 77.5946,
        timezone: 5.5,
        notes: `Converted from Lead ${lead.lead_id}. Requirement: ${lead.requirement || 'Vedic consultation'}`,
        createdAt: new Date().toISOString(),
      };
      db.clients.unshift(newClient);
    }

    const amount = Number(paymentAmount) || 0;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${1000 + db.sales.length + 1}`;

    // Optionally create sales invoice
    if (amount > 0) {
      const newInvoice: SalesInvoice = {
        id: 'sale_' + Date.now(),
        invoiceNumber,
        clientId: clientId || 'cli_walkin',
        clientName: lead.name,
        clientPhone: lead.whatsapp_number || lead.phone || '',
        items: [
          {
            stoneId: 'srv_' + Date.now(),
            stoneName: servicePurchased || lead.service_interested || 'Vedic Astrology Consultation',
            sku: 'SRV-ASTRO',
            quantity: 1,
            unitPrice: amount,
            totalPrice: amount,
            total: amount,
          },
        ],
        subtotal: amount,
        taxAmount: 0,
        discountAmount: 0,
        grandTotal: amount,
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: 'paid',
        saleDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        notes: `Generated on Lead Conversion (${lead.lead_id})`,
      };
      db.sales.unshift(newInvoice);
    }

    // Update Lead state
    lead.lead_status = 'CONVERTED';
    lead.customer_id = clientId;
    lead.conversion_date = new Date().toISOString().split('T')[0];
    lead.converted_at = new Date().toISOString();
    lead.converted_value = amount;
    lead.conversion_details = {
      servicePurchased: servicePurchased || lead.service_interested,
      invoiceNumber: amount > 0 ? invoiceNumber : undefined,
      paymentAmount: amount,
      paymentMethod: paymentMethod || 'UPI',
      clientId,
    };
    lead.updated_at = new Date().toISOString();

    // Log Activity
    db.logLeadActivity(
      lead.lead_id,
      'lead_converted',
      'Lead Converted to Customer! 🎉',
      `Converted for ${servicePurchased || 'Service'} (₹${amount.toLocaleString('en-IN')}). Linked Client ID: ${clientId}`,
      req.body.performer_name || 'Staff'
    );

    return res.json({
      success: true,
      message: 'Lead converted successfully',
      data: {
        lead,
        clientId,
        invoiceNumber: amount > 0 ? invoiceNumber : undefined,
      },
    });
  });

  // 12. Mark Lead Lost / Rejected
  app.post('/api/leads/:id/reject', (req, res) => {
    const { id } = req.params;
    const lead = db.leads.find(l => l.lead_id === id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });

    const { reason, notes, isRejected = false } = req.body;

    lead.lead_status = isRejected ? 'REJECTED' : 'LOST';
    lead.lost_reason = reason || 'Not Interested';
    if (notes) {
      lead.notes = lead.notes ? `${lead.notes}\n[Lost Reason]: ${notes}` : `[Lost Reason]: ${notes}`;
    }
    lead.updated_at = new Date().toISOString();

    db.logLeadActivity(
      lead.lead_id,
      'lead_lost',
      `Lead Marked as ${lead.lead_status}`,
      `Reason: ${lead.lost_reason}. Notes: ${notes || 'None'}`,
      req.body.performer_name || 'Staff'
    );

    return res.json({ success: true, data: lead });
  });

  // 13. Follow-ups
  app.get('/api/leads/:id/followups', (req, res) => {
    const { id } = req.params;
    const followups = db.leadFollowups.filter(f => f.lead_id === id);
    return res.json({ success: true, data: followups });
  });

  app.post('/api/leads/:id/followups', (req, res) => {
    const { id } = req.params;
    const lead = db.leads.find(l => l.lead_id === id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });

    const { followup_date, followup_time, type, notes, assigned_to, assigned_to_name } = req.body;

    if (!followup_date) {
      return res.status(400).json({ success: false, error: 'Follow-up date is required.' });
    }

    const newFollowup: LeadFollowup = {
      followup_id: 'flw_' + Date.now(),
      lead_id: id,
      lead_name: lead.name,
      whatsapp_number: lead.whatsapp_number,
      followup_date,
      followup_time: followup_time || '12:00',
      type: type || 'WhatsApp',
      notes: notes || '',
      assigned_to: assigned_to || lead.assigned_to,
      assigned_to_name: assigned_to_name || lead.assigned_to_name,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    db.leadFollowups.unshift(newFollowup);

    // Update lead next follow-up date and status
    lead.next_followup_date = followup_date;
    lead.next_followup_time = followup_time;
    if (lead.lead_status === 'NEW' || lead.lead_status === 'CONTACTED') {
      lead.lead_status = 'FOLLOW_UP';
    }
    lead.updated_at = new Date().toISOString();

    db.logLeadActivity(
      id,
      'followup_scheduled',
      `Follow-up Scheduled (${newFollowup.type})`,
      `Scheduled for ${followup_date} at ${followup_time || '12:00'}. Note: "${notes || 'Follow up'}"`,
      assigned_to_name || 'Staff'
    );

    return res.status(201).json({ success: true, data: newFollowup });
  });

  app.put('/api/leads/:id/followups/:fId', (req, res) => {
    const { id, fId } = req.params;
    const followup = db.leadFollowups.find(f => f.followup_id === fId && f.lead_id === id);
    if (!followup) return res.status(404).json({ success: false, error: 'Follow-up not found' });

    const { status, outcome_notes } = req.body;
    if (status) followup.status = status;
    if (outcome_notes) followup.outcome_notes = outcome_notes;
    if (status === 'completed') {
      followup.completed_at = new Date().toISOString();
      db.logLeadActivity(
        id,
        'followup_completed',
        'Follow-up Completed',
        `Outcome: ${outcome_notes || 'Completed successfully'}`,
        req.body.performer_name || 'Staff'
      );
    }

    return res.json({ success: true, data: followup });
  });

  // 14. Lead Activities / Timeline
  app.get('/api/leads/:id/activities', (req, res) => {
    const { id } = req.params;
    const activities = db.leadActivities.filter(a => a.lead_id === id);
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return res.json({ success: true, data: activities });
  });

  app.post('/api/leads/:id/activities', (req, res) => {
    const { id } = req.params;
    const lead = db.leads.find(l => l.lead_id === id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });

    const { type, title, description, performer_name } = req.body;
    const activity = db.logLeadActivity(
      id,
      type || 'note_added',
      title || 'Timeline Note Added',
      description || '',
      performer_name || 'Staff'
    );

    return res.status(201).json({ success: true, data: activity });
  });

  // 15. Messages / WhatsApp Chat Thread
  app.get('/api/leads/:id/messages', (req, res) => {
    const { id } = req.params;
    const messages = db.leadMessages.filter(m => m.lead_id === id);
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return res.json({ success: true, data: messages });
  });

  app.post('/api/leads/:id/messages', (req, res) => {
    const { id } = req.params;
    const lead = db.leads.find(l => l.lead_id === id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });

    const { message_text, media_url, media_type, sender_name } = req.body;
    if (!message_text && !media_url) {
      return res.status(400).json({ success: false, error: 'Message text is required.' });
    }

    const newMsg: LeadMessage = {
      message_id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      lead_id: id,
      direction: 'outbound',
      sender_number: db.leadSettings.whatsappConfig.businessPhoneNumber,
      sender_name: sender_name || 'AstroNexus Jyotish Astrologer',
      recipient_number: lead.whatsapp_number,
      message_text: message_text || '',
      media_url,
      media_type,
      timestamp: new Date().toISOString(),
      status: 'sent',
      channel: 'whatsapp_cloud_api',
    };

    db.leadMessages.push(newMsg);

    // Update lead contact time and status
    lead.last_contact_at = new Date().toISOString();
    lead.updated_at = new Date().toISOString();
    if (lead.lead_status === 'NEW') {
      lead.lead_status = 'CONTACTED';
    }

    // Log Activity
    db.logLeadActivity(
      id,
      'whatsapp_sent',
      'WhatsApp Message Sent',
      `"${message_text}"`,
      sender_name || 'Staff'
    );

    return res.status(201).json({
      success: true,
      data: newMsg,
      message: 'WhatsApp message dispatched and logged in CRM history.',
    });
  });

  // API 404 handler - MUST be before frontend middleware so API calls never return index.html
  app.use('/api', (req, res) => {
    res.status(404).json({ success: false, error: `API endpoint ${req.method} ${req.originalUrl} not found` });
  });

  // ---------------- VITE / FRONTEND MIDDLEWARE ---------------- //
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ AstroERP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal Server Startup Error:', err);
});
