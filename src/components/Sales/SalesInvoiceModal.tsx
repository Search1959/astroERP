/**
 * Sales Invoice Creation Modal
 * Select Client, Add Stones with Auto Price / Certificate lookup, Tax & Discount calculation
 */

import React, { useState, useEffect } from 'react';
import { Sale, Client, InventoryItem, SaleItem } from '../../types';
import { X, DollarSign, Plus, Trash2, ShieldCheck, User, Calendar, Tag } from 'lucide-react';

interface SalesInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (saleData: Partial<Sale>) => void;
  clients: Client[];
  inventory: InventoryItem[];
  prefillStone?: InventoryItem | null;
}

export const SalesInvoiceModal: React.FC<SalesInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clients,
  inventory,
  prefillStone = null,
}) => {
  if (!isOpen) return null;

  const getStonePrice = (item?: InventoryItem | null): number => {
    if (!item) return 100;
    return item.sellingPrice ?? item.salePrice ?? 100;
  };

  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(10000 + Math.random() * 90000)}`);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / Stripe');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | 'partial'>('paid');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<SaleItem[]>([]);

  useEffect(() => {
    if (!clientId && clients.length > 0) {
      setClientId(clients[0].id);
    }
  }, [clients, clientId]);

  useEffect(() => {
    if (prefillStone) {
      const price = getStonePrice(prefillStone);
      setItems([
        {
          stoneId: prefillStone.id,
          stoneName: prefillStone.name,
          sku: prefillStone.sku,
          quantity: 1,
          unitPrice: price,
          totalPrice: price,
          certificateNumber: prefillStone.certificateNumber,
        },
      ]);
    } else if (inventory.length > 0 && items.length === 0) {
      const first = inventory[0];
      const price = getStonePrice(first);
      setItems([
        {
          stoneId: first.id,
          stoneName: first.name,
          sku: first.sku,
          quantity: 1,
          unitPrice: price,
          totalPrice: price,
          certificateNumber: first.certificateNumber,
        },
      ]);
    }
  }, [prefillStone, inventory, isOpen]);

  const selectedClient = clients.find(c => c.id === clientId);

  const handleAddItem = () => {
    const defaultItem = inventory[0];
    const price = getStonePrice(defaultItem);
    setItems([
      ...items,
      {
        stoneId: defaultItem?.id || '',
        stoneName: defaultItem?.name || 'Selected Gemstone',
        sku: defaultItem?.sku || '',
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
        certificateNumber: defaultItem?.certificateNumber,
      },
    ]);
  };

  const handleItemChange = (index: number, field: keyof SaleItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    if (field === 'stoneId') {
      const selected = inventory.find(i => i.id === value);
      if (selected) {
        item.stoneName = selected.name;
        item.sku = selected.sku;
        item.unitPrice = getStonePrice(selected);
        item.certificateNumber = selected.certificateNumber;
        item.totalPrice = item.unitPrice * (item.quantity || 1);
      }
    }

    if (field === 'quantity' || field === 'unitPrice') {
      const qty = parseInt(item.quantity as any) || 0;
      const price = parseFloat(item.unitPrice as any) || 0;
      item.totalPrice = qty * price;
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
  const taxAmount = parseFloat((Math.max(0, subtotal - discountAmount) * (taxPercent / 100)).toFixed(2));
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || items.length === 0) return;

    onSubmit({
      clientId,
      clientName: selectedClient?.name || 'Valued Client',
      invoiceNumber,
      saleDate,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      grandTotal,
      paymentMethod,
      paymentStatus,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Issue Gemstone Retail Invoice & Sales Receipt
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Bill To Client *
              </label>
              <select
                required
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email || c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Invoice Date *
              </label>
              <input
                type="date"
                required
                value={saleDate}
                onChange={e => setSaleDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Payment Channel</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              >
                <option value="Credit Card / Stripe">Credit Card (Stripe)</option>
                <option value="Bank Wire / NEFT">Bank Wire Transfer</option>
                <option value="Cash / POS">Cash at Office POS</option>
                <option value="Crypto (USDT/BTC)">Crypto Asset</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              >
                <option value="paid">Fully Paid</option>
                <option value="unpaid">Unpaid / Due</option>
                <option value="partial">Partial Advance</option>
              </select>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">Invoice Line Items (Auto-Deducts Stock)</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Gemstone
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => {
                const stockItem = inventory.find(i => i.id === item.stoneId);
                const isOverStock = stockItem && item.quantity > stockItem.stockQuantity;

                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-12 gap-2 items-center text-xs"
                  >
                    <div className="col-span-5">
                      <label className="text-[10px] text-slate-500 block mb-1">Select Stone From Vault</label>
                      <select
                        value={item.stoneId}
                        onChange={e => handleItemChange(idx, 'stoneId', e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      >
                        {inventory.map(inv => (
                          <option key={inv.id} value={inv.id}>
                            {inv.name} (Stock: {inv.stockQuantity}) - ${(inv.sellingPrice ?? inv.salePrice ?? 0).toLocaleString()}
                          </option>
                        ))}
                      </select>
                      {item.certificateNumber && (
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Cert: {item.certificateNumber}
                        </div>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-1">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                        className={`w-full px-2 py-1.5 bg-slate-900 border rounded-lg text-white font-bold ${
                          isOverStock ? 'border-rose-500 text-rose-300' : 'border-slate-700'
                        }`}
                      />
                      {isOverStock && (
                        <span className="text-[9px] text-rose-400 block mt-0.5">Exceeds stock!</span>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={e => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-1">Total</label>
                      <div className="font-bold text-emerald-400 py-1.5 font-mono">
                        ${item.totalPrice.toLocaleString()}
                      </div>
                    </div>

                    <div className="col-span-1 text-right pt-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Adjustments & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Discount Amount ($)</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">GST / Sales Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Calculations Total Box */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-right flex flex-col justify-center">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">${subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Discount:</span>
                  <span className="font-mono">-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Sales Tax ({taxPercent}%):</span>
                <span className="font-mono text-white">${taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-emerald-400 border-t border-slate-800 pt-2">
                <span>Grand Total:</span>
                <span className="font-mono">${grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Invoice Terms & Astrological Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Pran Pratishtha consecration certificate included. Natural unheated guarantee..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition cursor-pointer"
            >
              Create & Issue Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
