/**
 * Sales Invoicing Roster & Financial Ledger
 * Enhanced with Camera Scanning & Astrological Auto-Dispensing.
 */

import React, { useState } from 'react';
import { Sale, Client, InventoryItem } from '../../types';
import {
  DollarSign,
  Plus,
  Search,
  FileText,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Download,
  Camera,
  Sparkles,
  Zap
} from 'lucide-react';
import { InvoicePrintModal } from './InvoicePrintModal';

interface SalesListProps {
  sales: Sale[];
  clients: Client[];
  inventory: InventoryItem[];
  onOpenNewSaleModal: () => void;
  onOpenScanner?: () => void;
  currencySymbol?: string;
}

export const SalesList: React.FC<SalesListProps> = ({
  sales,
  clients,
  inventory,
  onOpenNewSaleModal,
  onOpenScanner,
  currencySymbol = '₹',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Sale | null>(null);

  const filteredSales = sales.filter(s => {
    const client = (s.clientName || '').toLowerCase();
    const invNo = (s.invoiceNumber || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const itemsMatch = (s.items || []).some(i => (i.stoneName || '').toLowerCase().includes(q));
    return client.includes(q) || invNo.includes(q) || itemsMatch;
  });

  const totalSalesRevenue = sales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);

  const exportSalesCSV = () => {
    const headers = ['InvoiceNo,ClientName,Date,PaymentMethod,Subtotal,Tax,Discount,GrandTotal,Items'];
    const rows = filteredSales.map(s =>
      `"${s.invoiceNumber || ''}","${s.clientName || ''}","${s.saleDate || ''}","${s.paymentMethod || ''}",${s.subtotal || 0},${s.taxAmount || 0},${s.discountAmount || 0},${s.grandTotal || 0},"${(s.items || []).map(i => `${i.stoneName || 'Gemstone'} (x${i.quantity || 1})`).join('; ')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AstroERP_Sales_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header and Controls */}
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Sales Invoicing & Gemstone Billing
            </h2>
            <span className="text-[11px] bg-[#250813] text-orange-300 font-bold px-2 py-0.5 rounded-md border border-orange-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-orange-400" />
              Auto-Dispensing Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Issue authenticated gemstone invoices with GST/VAT calculations and lab certificate linkage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-2 bg-[#1c060e] hover:bg-[#2a0914] text-orange-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-orange-500/30 transition cursor-pointer shadow-xs"
            >
              <Camera className="w-4 h-4 text-orange-400" />
              Scan to Invoice
            </button>
          )}

          <button
            onClick={exportSalesCSV}
            className="px-3.5 py-2 bg-[#14050a] hover:bg-[#1f0710] text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-red-950/80 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            Export CSV
          </button>

          <button
            id="btn-new-sale-invoice"
            onClick={onOpenNewSaleModal}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Issue New Invoice
          </button>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Invoices Issued</span>
            <div className="text-2xl font-bold text-white mt-1 font-['Cinzel',serif]">{sales.length} Invoices</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#250813] flex items-center justify-center text-orange-400 border border-orange-500/20">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Gross Sales Revenue</span>
            <div className="text-2xl font-bold text-orange-400 mt-1 font-['Cinzel',serif]">
              {currencySymbol}{totalSalesRevenue.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#250813] flex items-center justify-center text-orange-400 border border-orange-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Order Value</span>
            <div className="text-2xl font-bold text-white mt-1 font-['Cinzel',serif]">
              {currencySymbol}{sales.length ? Math.round(totalSalesRevenue / sales.length).toLocaleString() : '0'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#250813] flex items-center justify-center text-orange-400 border border-orange-500/20">
            <ShieldCheck className="w-5 h-5" />
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
          placeholder="Search by client name, invoice number, or stone..."
          className="w-full pl-10 pr-4 py-2 bg-[#0e0307] border border-red-950/80 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
      </div>

      {/* Sales Invoices Table */}
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#14050a] text-orange-200 uppercase font-semibold tracking-wider border-b border-red-950/80 font-['Outfit',sans-serif]">
                <th className="py-3 px-4">Invoice # & Client</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Sold Gemstones / Items</th>
                <th className="py-3 px-4">Type & Payment</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-950/50 font-medium text-slate-300">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 space-y-2">
                    <DollarSign className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="font-semibold text-slate-300">No sales invoices found.</p>
                    <p className="text-xs text-slate-500">Issue an invoice manually, scan with camera, or auto-dispense from Astrological Chart recommendations.</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => {
                  const isAuto = (sale.id || '').includes('auto') || (sale.notes || '').includes('AUTO');

                  return (
                    <tr key={sale.id} className="hover:bg-[#1a070e]/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm font-['Outfit',sans-serif]">{sale.clientName}</div>
                        <div className="text-[11px] font-mono text-orange-400 mt-0.5 font-semibold">#{sale.invoiceNumber}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-400/80" />
                          {sale.saleDate}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {(sale.items || []).map((item, idx) => (
                            <div key={idx} className="text-slate-300">
                              <span className="font-semibold text-white">{item.stoneName}</span> • {item.quantity}x @ {currencySymbol}{item.unitPrice}
                              {item.certificateNumber && (
                                <span className="text-[10px] text-orange-300/80 ml-1.5 font-mono">
                                  [Cert: {item.certificateNumber}]
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded-full bg-[#1c060e] text-orange-300 border border-red-900/60 text-[10px] font-semibold inline-block">
                            {sale.paymentMethod || 'Credit Card'}
                          </span>
                          {isAuto && (
                            <span className="text-[10px] bg-[#250813] text-orange-300 px-2 py-0.5 rounded-md border border-orange-500/30 font-bold block w-fit">
                              ⚡ Auto-Dispensed
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-base font-bold text-orange-400 font-['Cinzel',serif]">
                          {currencySymbol}{(sale.grandTotal || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Tax: {currencySymbol}{sale.taxAmount || 0}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoiceForPrint(sale)}
                          className="px-3 py-1.5 bg-[#14050a] hover:bg-orange-500/20 text-slate-200 hover:text-orange-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ml-auto border border-red-950 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-orange-400" />
                          Print Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Print & Download Modal */}
      {selectedInvoiceForPrint && (
        <InvoicePrintModal
          sale={selectedInvoiceForPrint}
          isOpen={!!selectedInvoiceForPrint}
          onClose={() => setSelectedInvoiceForPrint(null)}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
};
