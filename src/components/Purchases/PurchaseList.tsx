/**
 * Gemstone Purchase Procurement Roster
 */

import React, { useState } from 'react';
import { Purchase, InventoryItem } from '../../types';
import { ShoppingBag, Plus, Search, Truck, DollarSign, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface PurchaseListProps {
  purchases: Purchase[];
  inventory: InventoryItem[];
  onOpenNewPurchaseModal: () => void;
  currencySymbol?: string;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({
  purchases,
  inventory,
  onOpenNewPurchaseModal,
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

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Gemstone Procurement & Dealer Purchases
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track rough & polished stone batch acquisitions from Ceylon, Jaipur, and global gem dealers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-new-purchase-order"
            onClick={onOpenNewPurchaseModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Record Supplier Purchase
          </button>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Purchase Orders</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{purchases.length} Orders</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Procurement Expenditure</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {currencySymbol}{totalSpentOnProcurement.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Active Supply Channels</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {Array.from(new Set(purchases.map(p => p.supplierName))).length} Dealers
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by supplier name or PO number..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Purchases Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">PO # & Supplier</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Acquired Items</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{p.supplierName}</div>
                      <div className="text-[11px] font-mono text-indigo-600 mt-0.5 font-semibold">#{p.purchaseOrderNumber || p.invoiceNumber || 'PO-RECORD'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {p.purchaseDate}
                      </div>
                      {p.invoiceReference && (
                        <div className="text-[10px] text-slate-400 mt-0.5">Ref: {p.invoiceReference}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {(p.items || []).map((item, idx) => (
                          <div key={idx} className="text-slate-700">
                            <span className="font-semibold text-slate-900">{item.stoneName}</span> • {item.quantity} units @ {currencySymbol}{item.unitCost}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        (p.status || '').toLowerCase() === 'received' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        (p.status || '').toLowerCase() === 'ordered' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {(p.status || 'Received').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <span className={`text-[11px] font-semibold ${
                        (p.paymentStatus || '').toLowerCase() === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {(p.paymentStatus || 'Paid').toUpperCase()}
                      </span>
                      <div className="text-[10px] text-slate-400">{p.paymentMethod || 'Bank Wire'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="text-base font-bold text-slate-900">
                        {currencySymbol}{(p.grandTotal || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Tax: {currencySymbol}{p.taxAmount || 0}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
