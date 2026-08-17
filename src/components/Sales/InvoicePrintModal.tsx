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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-[#0e0307] border border-red-900/60 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-950/80 bg-[#120408]">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit',sans-serif]">
            <Printer className="w-5 h-5 text-orange-400" />
            Official Gemstone Sales Invoice Preview
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-600/20 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-rose-950/80 hover:text-rose-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#0e0307] font-sans text-xs print:bg-white print:text-black">
          {/* Invoice Header */}
          <div className="flex flex-wrap items-start justify-between border-b border-red-950/80 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1c060e] border border-red-950 flex items-center justify-center text-orange-400">
                  <Gem className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-black text-white tracking-tight font-['Outfit',sans-serif]">AstroERP Gems & Vedic Sanctuary</h1>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Govt. Certified Astrological Gemstones & Vedic Consultation Vault
              </p>
              <p className="text-slate-500 text-[11px]">
                Reg. No: ASTRO-VAULT-2024-UK • support@astroerp.com
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block font-['Outfit',sans-serif]">
                TAX INVOICE
              </span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">#{sale.invoiceNumber}</div>
              <div className="text-slate-400 text-xs">Date: {sale.saleDate}</div>
              <div className="text-slate-500 text-[11px]">Payment: {sale.paymentMethod}</div>
            </div>
          </div>

          {/* Client Details */}
          <div className="p-4 bg-[#120408] rounded-2xl border border-red-950/80 flex flex-wrap justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1 font-['Outfit',sans-serif]">
                Billed To:
              </span>
              <div className="text-base font-bold text-white">{sale.clientName}</div>
              <div className="text-slate-400 text-[11px]">Client ID: {sale.clientId}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1 font-['Outfit',sans-serif]">
                Invoice Status:
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold text-xs uppercase">
                {sale.paymentStatus}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-red-950/80 rounded-2xl overflow-hidden bg-[#120408]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#16050b] text-slate-400 uppercase font-semibold text-[11px] border-b border-red-950">
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4">SKU / Certificate</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-950/60 text-xs">
                {sale.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#1a060f]">
                    <td className="py-3 px-4 font-bold text-white">
                      {item.stoneName}
                    </td>
                    <td className="py-3 px-4 text-orange-300 font-mono text-[11px]">
                      {item.sku} {item.certificateNumber ? `[Cert: ${item.certificateNumber}]` : ''}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 font-mono">
                      {currencySymbol}{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400 font-mono">
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
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white font-medium">{currencySymbol}{sale.subtotal.toLocaleString()}</span>
              </div>
              {sale.discountAmount > 0 && (
                <div className="flex justify-between text-orange-400 font-medium">
                  <span>Discount Applied:</span>
                  <span className="font-mono">-{currencySymbol}{sale.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Tax / GST:</span>
                <span className="font-mono text-white font-medium">{currencySymbol}{sale.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-emerald-400 border-t border-red-950/80 pt-2 font-['Outfit',sans-serif]">
                <span>Total Amount Paid:</span>
                <span className="font-mono">{currencySymbol}{sale.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Authenticity Guarantee Notice */}
          <div className="p-4 bg-[#120408] rounded-2xl border border-red-950/80 text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-bold text-white block mb-0.5 font-['Outfit',sans-serif]">Vedic Authenticity & Consecration Guarantee</span>
              All gemstones sold are 100% natural, unheated, and untreated Jyotish grade stones. Accompanied by official third-party gemological laboratory certificates and Vedic energization (Pran Pratishtha) certificates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
