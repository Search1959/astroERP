/**
 * Purchase Entry Modal
 * Record supplier purchases, add batch items, and restock inventory
 */

import React, { useState } from 'react';
import { Purchase, InventoryItem, PurchaseItem } from '../../types';
import { X, ShoppingBag, Plus, Trash2, DollarSign, Calendar, Truck } from 'lucide-react';

interface PurchaseEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (purchase: Partial<Purchase>) => void;
  inventory: InventoryItem[];
}

export const PurchaseEntryModal: React.FC<PurchaseEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  inventory,
}) => {
  if (!isOpen) return null;

  const [supplierName, setSupplierName] = useState('Ceylon Gemstone Exporters Ltd (Colombo)');
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState(`PO-${Math.floor(10000 + Math.random() * 90000)}`);
  const [invoiceReference, setInvoiceReference] = useState(`INV-SUP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | 'partial'>('paid');
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire Transfer');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<PurchaseItem[]>([
    {
      stoneId: inventory[0]?.id || 'gem-1',
      stoneName: inventory[0]?.name || 'Natural Yellow Sapphire',
      sku: inventory[0]?.sku || 'YEL-SAP-01',
      quantity: 5,
      unitCost: 350,
      totalCost: 1750,
    },
  ]);

  const handleAddItem = () => {
    const defaultItem = inventory[0];
    setItems([
      ...items,
      {
        stoneId: defaultItem?.id || 'custom',
        stoneName: defaultItem?.name || 'Ceylon Ruby Lot',
        sku: defaultItem?.sku || 'RUB-01',
        quantity: 2,
        unitCost: 200,
        totalCost: 400,
      },
    ]);
  };

  const handleItemChange = (index: number, field: keyof PurchaseItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    if (field === 'stoneId') {
      const selected = inventory.find(i => i.id === value);
      if (selected) {
        item.stoneName = selected.name;
        item.sku = selected.sku;
        item.unitCost = selected.costPrice ?? selected.purchasePrice ?? 100;
      }
    }

    if (field === 'quantity' || field === 'unitCost') {
      item.totalCost = (parseFloat(item.quantity as any) || 0) * (parseFloat(item.unitCost as any) || 0);
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, i) => sum + i.totalCost, 0);
  const taxAmount = parseFloat((subtotal * 0.05).toFixed(2));
  const grandTotal = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName.trim() || items.length === 0) return;

    onSubmit({
      supplierName,
      purchaseOrderNumber,
      invoiceReference,
      purchaseDate,
      items,
      subtotal,
      taxAmount,
      grandTotal,
      status: 'received',
      paymentStatus,
      paymentMethod,
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
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            Record Dealer Purchase Order & Stock Inward
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
              <label className="font-semibold text-slate-300">Supplier / Gemstone Dealer Name *</label>
              <input
                type="text"
                required
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                placeholder="e.g. Jaipur Gems & Rough Exports"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Purchase Date *</label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">PO Number</label>
              <input
                type="text"
                value={purchaseOrderNumber}
                onChange={e => setPurchaseOrderNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Supplier Invoice Ref</label>
              <input
                type="text"
                value={invoiceReference}
                onChange={e => setInvoiceReference(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid / Credit</option>
                <option value="partial">Partial Payment</option>
              </select>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">Purchase Line Items (Auto-Restocks Inventory)</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Line Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-12 gap-2 items-center text-xs"
                >
                  <div className="col-span-5">
                    <label className="text-[10px] text-slate-500 block mb-1">Select Stone / Lot</label>
                    <select
                      value={item.stoneId}
                      onChange={e => handleItemChange(idx, 'stoneId', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    >
                      {inventory.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} ({inv.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500 block mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500 block mb-1">Unit Cost ($)</label>
                    <input
                      type="number"
                      value={item.unitCost}
                      onChange={e => handleItemChange(idx, 'unitCost', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500 block mb-1">Total</label>
                    <div className="font-bold text-amber-400 py-1.5">
                      ${item.totalCost.toLocaleString()}
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
              ))}
            </div>
          </div>

          {/* Subtotals & Grand Total */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-end">
            <div className="w-64 space-y-1.5 text-right">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Import Duties / Tax (5%):</span>
                <span className="font-mono text-white">${taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-amber-400 border-t border-slate-800 pt-1.5">
                <span>Grand Total:</span>
                <span className="font-mono">${grandTotal.toLocaleString()}</span>
              </div>
            </div>
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
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg transition cursor-pointer"
            >
              Confirm Purchase & Restock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
