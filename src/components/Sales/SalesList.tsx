/**
 * Sales Invoicing Roster & Financial Ledger
 */

import React, { useState } from 'react';
import { Sale, Client, InventoryItem } from '../../types';
import { DollarSign, Plus, Search, FileText, Printer, CheckCircle2, ShieldCheck, Calendar, Download } from 'lucide-react';
import { InvoicePrintModal } from './InvoicePrintModal';

interface SalesListProps {
  sales: Sale[];
  clients: Client[];
  inventory: InventoryItem[];
  onOpenNewSaleModal: () => void;
  currencySymbol?: string;
}

export const SalesList: React.FC<SalesListProps> = ({
  sales,
  clients,
  inventory,
  onOpenNewSaleModal,
  currencySymbol = '$',
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
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Sales Invoicing & Gemstone Billing
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Issue authenticated gemstone invoices with GST/VAT calculations and lab certificate linkage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportSalesCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            id="btn-new-sale-invoice"
            onClick={onOpenNewSaleModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Issue New Invoice
          </button>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Invoices Issued</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{sales.length} Invoices</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Gross Sales Revenue</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {currencySymbol}{totalSalesRevenue.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Average Order Value</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {currencySymbol}{sales.length ? Math.round(totalSalesRevenue / sales.length).toLocaleString() : '0'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
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
          placeholder="Search by client name, invoice number, or stone..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Sales Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Invoice # & Client</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Sold Gemstones / Items</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No sales invoices found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{sale.clientName}</div>
                      <div className="text-[11px] font-mono text-indigo-600 mt-0.5 font-semibold">#{sale.invoiceNumber}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {sale.saleDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {(sale.items || []).map((item, idx) => (
                          <div key={idx} className="text-slate-700">
                            <span className="font-semibold text-slate-900">{item.stoneName}</span> • {item.quantity}x @ {currencySymbol}{item.unitPrice}
                            {item.certificateNumber && (
                              <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                                [Cert: {item.certificateNumber}]
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold">
                        {sale.paymentMethod || 'Credit Card'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-base font-bold text-emerald-700">
                        {currencySymbol}{(sale.grandTotal || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Tax: {currencySymbol}{sale.taxAmount || 0}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoiceForPrint(sale)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ml-auto border border-slate-200 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-indigo-600" />
                        Print Invoice
                      </button>
                    </td>
                  </tr>
                ))
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
