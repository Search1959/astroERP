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
import { Client, GemstoneItem, SalesInvoice, PurchaseEntry, Appointment, User } from './src/types';

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
