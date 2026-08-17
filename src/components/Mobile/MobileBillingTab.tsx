import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Client, InventoryItem, Sale, StoreSettings } from '../../types';
import {
  QrCode,
  CreditCard,
  CheckCircle2,
  Share2,
  Printer,
  MessageSquare,
  Plus,
  ArrowRight,
  Sparkles,
  Gem,
  Smartphone,
  Copy,
} from 'lucide-react';

interface MobileBillingTabProps {
  sales: Sale[];
  clients: Client[];
  inventory: InventoryItem[];
  currencySymbol: string;
  settings: StoreSettings | null;
  onCreateSale: (newSale: Partial<Sale>) => void;
}

export const MobileBillingTab: React.FC<MobileBillingTabProps> = ({
  sales = [],
  clients = [],
  inventory = [],
  currencySymbol = '₹',
  settings,
  onCreateSale,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceName, setServiceName] = useState('Vedic Astrology Consultation');
  const [amount, setAmount] = useState<number>(1100);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Cash' | 'Card' | 'Online'>('UPI');
  const [showQrModal, setShowQrModal] = useState(false);
  const [lastGeneratedSale, setLastGeneratedSale] = useState<Sale | null>(null);

  // Common quick service presets for Indian Astrologers
  const PRESETS = [
    { name: 'Kundli Consultation (Basic)', amount: 1100 },
    { name: 'Detailed Kundli + Remedies (Premium)', amount: 2100 },
    { name: 'Kundli Milan (Horoscope Matching)', amount: 1500 },
    { name: 'Energized Rudraksha / Gemstone Ring', amount: 5500 },
    { name: 'Navagraha Shanti Pooja / Anushthan', amount: 5100 },
    { name: 'Vastu Consultation (Site Visit / Floorplan)', amount: 7500 },
  ];

  const upiId = 'vedicastro.gems@okhdfcbank';
  const businessName = settings?.businessName || settings?.storeName || 'VedicAstro Studio';

  // Standard UPI URI format: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
  const upiPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    businessName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(serviceName)}`;

  const handleGenerateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || amount <= 0) return;

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];

    const newSaleData: Partial<Sale> = {
      invoiceNumber,
      clientName,
      clientPhone,
      clientId: 'cli_' + Date.now(),
      items: [
        {
          stoneId: 'srv_' + Date.now(),
          stoneName: serviceName,
          sku: 'SRV-ASTRO',
          quantity: 1,
          unitPrice: amount,
          total: amount,
        },
      ],
      subtotal: amount,
      taxAmount: 0,
      discountAmount: 0,
      grandTotal: amount,
      paymentMethod: paymentMode,
      paymentStatus: 'paid',
      saleDate: today,
      createdAt: new Date().toISOString(),
      notes: `Instant Mobile Bill generated via AstroERP Android app.`,
    };

    onCreateSale(newSaleData);
    setLastGeneratedSale(newSaleData as Sale);
    setShowQrModal(true);
  };

  const getWhatsAppReceiptText = (sale: Sale) => {
    return (
      `🧾 *TAX INVOICE / RECEIPT - ${businessName}*\n\n` +
      `🔖 *Invoice No:* ${sale.invoiceNumber}\n` +
      `📅 *Date:* ${sale.saleDate}\n` +
      `👤 *Client Name:* ${sale.clientName}\n\n` +
      `📋 *Service / Item:* ${sale.items?.[0]?.stoneName || serviceName}\n` +
      `💰 *Amount Paid:* ${currencySymbol}${sale.grandTotal.toLocaleString('en-IN')}\n` +
      `💳 *Payment Mode:* ${sale.paymentMethod || 'UPI'}\n` +
      `✅ *Status:* PAID (Complete)\n\n` +
      `_Thank you for choosing ${businessName}. All gemstones and remedies are astrologically energized with Pran Pratishtha._`
    );
  };

  const handleShareReceiptWhatsApp = (sale: Sale) => {
    const rawPhone = sale.clientPhone || clientPhone || '';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;
    const text = getWhatsAppReceiptText(sale);

    if (cleanPhone) {
      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Quick Billing Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Quick Billing & UPI QR Code</h2>
            <p className="text-[11px] text-slate-400">Instant Invoicing for GPay, PhonePe, Paytm</p>
          </div>
        </div>

        <form onSubmit={handleGenerateBill} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Client Full Name *</label>
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="e.g. Vikram Patel"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">WhatsApp / Mobile Number</label>
            <input
              type="tel"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Service / Gemstone</label>
            <input
              type="text"
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              placeholder="e.g. Kundli Consultation"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* Quick Presets Carousel */}
          <div>
            <span className="block text-[10px] text-slate-400 mb-1.5 font-medium">Quick Presets:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setServiceName(p.name);
                    setAmount(p.amount);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10px] text-slate-300 whitespace-nowrap cursor-pointer"
                >
                  {p.name.split(' ')[0]} ({currencySymbol}{p.amount})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Amount ({currencySymbol}) *</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-purple-500"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="UPI">UPI (QR / GPay / PhonePe)</option>
                <option value="Cash">Cash in Hand</option>
                <option value="Card">Debit / Credit Card (POS)</option>
                <option value="Online">Net Banking / NEFT</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate Bill & Show UPI QR</span>
          </button>
        </form>
      </div>

      {/* Generated UPI QR Code Modal / Card */}
      {showQrModal && lastGeneratedSale && (
        <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="text-left">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Invoice #{lastGeneratedSale.invoiceNumber}
              </span>
              <h3 className="text-xs font-bold text-white">{lastGeneratedSale.clientName}</h3>
            </div>
            <span className="text-sm font-bold text-emerald-400">
              {currencySymbol}{lastGeneratedSale.grandTotal.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Dynamic QR Code */}
          <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-lg">
            <QRCodeSVG value={upiPayload} size={170} level="H" includeMargin={true} />
            <p className="text-[10px] text-slate-800 font-bold mt-1">Scan with GPay / PhonePe / Paytm</p>
          </div>

          <div className="text-xs text-slate-300">
            <p className="font-mono text-[11px] text-slate-400">UPI ID: <strong className="text-white">{upiId}</strong></p>
            <p className="text-[10px] text-slate-400 mt-0.5">Amount: <strong className="text-emerald-400">{currencySymbol}{lastGeneratedSale.grandTotal}</strong></p>
          </div>

          {/* 1-Tap Share Receipt */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => handleShareReceiptWhatsApp(lastGeneratedSale)}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Receipt</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      {/* Recent Invoices Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Recent Invoices ({sales.length})
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {sales.slice(0, 10).map(s => (
            <div
              key={s.id || s.invoiceNumber}
              className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{s.clientName}</span>
                  <span className="text-[10px] text-slate-400">#{s.invoiceNumber}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {s.items?.[0]?.stoneName || 'Consultation'} • {s.paymentMethod || 'UPI'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 block">
                  {currencySymbol}{(s.grandTotal || 0).toLocaleString('en-IN')}
                </span>
                <button
                  type="button"
                  onClick={() => handleShareReceiptWhatsApp(s)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer mt-0.5 inline-flex items-center gap-0.5"
                >
                  <Share2 className="w-2.5 h-2.5" /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
