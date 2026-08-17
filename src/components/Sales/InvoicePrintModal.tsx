/**
 * Printable Gemstone Sales Invoice Modal
 */

import React from 'react';
import { Sale } from '../../types';
import { Printer, X, Gem, ShieldCheck, CheckCircle2, DollarSign } from 'lucide-react';

interface InvoicePrintModalProps {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  currencySymbol?: string;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  sale,
  isOpen,
  onClose,
  currencySymbol = '₹',
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-600" />
            Official Gemstone Sales Invoice Preview
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white font-sans text-xs">
          {/* Invoice Header */}
          <div className="flex flex-wrap items-start justify-between border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Gem className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-black text-slate-900 tracking-tight">AstroERP Gems & Vedic Sanctuary</h1>
              </div>
              <p className="text-slate-600 text-xs mt-1">
                Govt. Certified Astrological Gemstones & Vedic Consultation Vault
              </p>
              <p className="text-slate-500 text-[11px]">
                Reg. No: ASTRO-VAULT-2024-UK • support@astroerp.com
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
                TAX INVOICE
              </span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">#{sale.invoiceNumber}</div>
              <div className="text-slate-600 text-xs">Date: {sale.saleDate}</div>
              <div className="text-slate-500 text-[11px]">Payment: {sale.paymentMethod}</div>
            </div>
          </div>

          {/* Client Details */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Billed To:
              </span>
              <div className="text-base font-bold text-slate-900">{sale.clientName}</div>
              <div className="text-slate-500">Client ID: {sale.clientId}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Invoice Status:
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs uppercase">
                {sale.paymentStatus}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4">SKU / Certificate</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sale.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.stoneName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {item.sku} {item.certificateNumber ? `[Cert: ${item.certificateNumber}]` : ''}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 font-mono">
                      {currencySymbol}{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700 font-mono">
                      {currencySymbol}{item.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-72 space-y-2 text-right">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-900 font-medium">{currencySymbol}{sale.subtotal.toLocaleString()}</span>
              </div>
              {sale.discountAmount > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Discount Applied:</span>
                  <span className="font-mono">-{currencySymbol}{sale.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Tax / GST:</span>
                <span className="font-mono text-slate-900 font-medium">{currencySymbol}{sale.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-emerald-700 border-t border-slate-200 pt-2">
                <span>Total Amount Paid:</span>
                <span className="font-mono">{currencySymbol}{sale.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Authenticity Guarantee Notice */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-bold text-slate-900 block mb-0.5">Vedic Authenticity & Consecration Guarantee</span>
              All gemstones sold are 100% natural, unheated, and untreated Jyotish grade stones. Accompanied by official third-party gemological laboratory certificates and Vedic energization (Pran Pratishtha) certificates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
