/**
 * Gemstone Purchase Procurement Roster
 * Enhanced with Camera Inbound Scanning & 1-Click Auto-Procurement.
 */

import React, { useState } from 'react';
import { Purchase, InventoryItem } from '../../types';
import {
  ShoppingBag,
  Plus,
  Search,
  Truck,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle2,
  Camera,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface PurchaseListProps {
  purchases: Purchase[];
  inventory: InventoryItem[];
  onOpenNewPurchaseModal: () => void;
  onOpenScanner?: () => void;
  onAutoRestockAll?: () => void;
  currencySymbol?: string;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({
  purchases,
  inventory,
  onOpenNewPurchaseModal,
  onOpenScanner,
  onAutoRestockAll,
  currencySymbol = '$',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPurchases = purchases.filter(p => {
    const supplier = (p.supplierName || '').toLowerCase();
    const poNum = (p.purchaseOrderNumber || p.invoiceNumber || '').toLowerCase();
    const ref = (p.invoiceReference || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return supplier.includes(q) || poNum.includes(q) || ref.includes(q);
  });

  const totalSpentOnProcurement = purchases.reduce((sum, p) => sum + (p.grandTotal || 0), 0);
  const lowStockCount = inventory.filter(i => (i.stockQuantity || 0) <= (i.minStockThreshold || 1)).length;

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header and Controls */}
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Gemstone Procurement & Dealer Purchases
            </h2>
            <span className="text-[11px] bg-[#250813] text-orange-300 font-bold px-2 py-0.5 rounded-md border border-orange-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-orange-400" />
              Zero Human Overhead
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supplier purchases are automatically synchronized whenever gemstone stock is added or scanned.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-2 bg-[#1c060e] hover:bg-[#2a0914] text-orange-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-orange-500/30 transition cursor-pointer shadow-xs"
            >
              <Camera className="w-4 h-4 text-orange-400" />
              Scan Inbound Lot
            </button>
          )}

          {lowStockCount > 0 && onAutoRestockAll && (
            <button
              onClick={onAutoRestockAll}
              className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              Auto-Procure ({lowStockCount} Low Stock)
            </button>
          )}

          <button
            id="btn-new-purchase-order"
            onClick={onOpenNewPurchaseModal}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Manual Purchase
          </button>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Purchase Orders</span>
            <div className="text-2xl font-bold text-white mt-1 font-['Cinzel',serif]">{purchases.length} Orders</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#250813] flex items-center justify-center text-orange-400 border border-orange-500/20">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Procurement Expenditure</span>
            <div className="text-2xl font-bold text-orange-400 mt-1 font-['Cinzel',serif]">
              {currencySymbol}{totalSpentOnProcurement.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#250813] flex items-center justify-center text-orange-400 border border-orange-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Active Supply Channels</span>
            <div className="text-2xl font-bold text-white mt-1 font-['Cinzel',serif]">
              {Array.from(new Set(purchases.map(p => p.supplierName))).length} Dealers
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#250813] flex items-center justify-center text-orange-400 border border-orange-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-orange-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by supplier name, reference, or PO number..."
          className="w-full pl-10 pr-4 py-2 bg-[#0e0307] border border-red-950/80 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
      </div>

      {/* Purchases Table */}
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#14050a] text-orange-200 uppercase font-semibold tracking-wider border-b border-red-950/80 font-['Outfit',sans-serif]">
                <th className="py-3 px-4">PO # & Supplier</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Acquired Items</th>
                <th className="py-3 px-4">Type & Automation</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-950/50 font-medium text-slate-300">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="font-semibold text-slate-300">No purchase records found.</p>
                    <p className="text-xs text-slate-500">Purchases will be auto-generated whenever gemstone stock is added or scanned.</p>
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(p => {
                  const isAuto = (p.id || '').includes('auto') || (p.notes || '').includes('AUTO');

                  return (
                    <tr key={p.id} className="hover:bg-[#1a070e]/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm font-['Outfit',sans-serif]">{p.supplierName}</div>
                        <div className="text-[11px] font-mono text-orange-400 mt-0.5 font-semibold">#{p.purchaseOrderNumber || p.invoiceNumber || 'PO-RECORD'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-400/80" />
                          {p.purchaseDate}
                        </div>
                        {p.invoiceReference && (
                          <div className="text-[10px] text-slate-500 mt-0.5">Ref: {p.invoiceReference}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {(p.items || []).map((item, idx) => (
                            <div key={idx} className="text-slate-300">
                              <span className="font-semibold text-white">{item.stoneName}</span> • {item.quantity} units @ {currencySymbol}{item.unitCost}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            (p.status || '').toLowerCase() === 'received' ? 'bg-[#1c060e] text-orange-300 border border-orange-500/40' :
                            (p.status || '').toLowerCase() === 'ordered' ? 'bg-[#250813] text-orange-200 border border-red-900/60' :
                            'bg-[#14050a] text-slate-400 border border-red-950'
                          }`}>
                            {(p.status || 'Received').toUpperCase()}
                          </span>
                          {isAuto && (
                            <span className="text-[10px] bg-[#250813] text-orange-300 px-2 py-0.5 rounded-md border border-orange-500/30 font-bold block w-fit">
                              ⚡ Auto-Balanced
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <span className={`text-[11px] font-semibold ${
                          (p.paymentStatus || '').toLowerCase() === 'paid' ? 'text-orange-300' : 'text-amber-400'
                        }`}>
                          {(p.paymentStatus || 'Paid').toUpperCase()}
                        </span>
                        <div className="text-[10px] text-slate-500">{p.paymentMethod || 'Bank Wire'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="text-base font-bold text-orange-400 font-['Cinzel',serif]">
                          {currencySymbol}{(p.grandTotal || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Tax: {currencySymbol}{p.taxAmount || 0}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
