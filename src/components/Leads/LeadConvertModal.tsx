import React, { useState } from 'react';
import { Lead } from '../../types';
import { CheckCircle2, DollarSign, UserCheck, FileText, X } from 'lucide-react';

interface LeadConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onConvert: (leadId: string, conversionData: {
    servicePurchased: string;
    paymentAmount: number;
    paymentMethod: string;
    notes?: string;
    createClient: boolean;
  }) => void;
  currencySymbol?: string;
}

export const LeadConvertModal: React.FC<LeadConvertModalProps> = ({
  isOpen,
  onClose,
  lead,
  onConvert,
  currencySymbol = '₹',
}) => {
  if (!isOpen || !lead) return null;

  const [servicePurchased, setServicePurchased] = useState(
    lead.service_interested || 'Gemstone Consultation & Prescription'
  );
  const [paymentAmount, setPaymentAmount] = useState<number | ''>(5000);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [createClient, setCreateClient] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConvert(lead.lead_id, {
      servicePurchased,
      paymentAmount: Number(paymentAmount) || 0,
      paymentMethod,
      notes,
      createClient,
    });
    onClose();
  };  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-[#0e0307] border border-emerald-900/60 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#120408] px-6 py-4 border-b border-red-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md border border-emerald-500/40">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">Convert Lead to Customer</h3>
              <p className="text-xs text-emerald-400 font-mono">
                {lead.name} • {lead.whatsapp_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-950/80 hover:text-rose-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm bg-[#0e0307]">
          <div className="bg-[#16050b] border border-emerald-900/40 rounded-xl p-3.5 text-xs text-emerald-300">
            Converting this lead will mark its status as <span className="font-semibold text-white">CONVERTED</span>, record attributed revenue, and sync client records into AstroERP.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Service / Gemstone Purchased <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={servicePurchased}
              onChange={e => setServicePurchased(e.target.value)}
              className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. 5.25 Ratti Ceylon Pukhraj + Ring Setting"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount Paid ({currencySymbol}) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">{currencySymbol}</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#16050b] border border-red-950/80 rounded-xl pl-8 pr-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payment Mode <span className="text-emerald-400">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Cash">Cash at Studio</option>
                <option value="Bank Transfer">Bank Wire / NEFT / IMPS</option>
                <option value="Cheque">Cheque</option>
                <option value="Other">Other Gateway</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-red-950/80">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-300">
              <input
                type="checkbox"
                checked={createClient}
                onChange={e => setCreateClient(e.target.checked)}
                className="w-4 h-4 rounded border-red-950 bg-[#16050b] text-emerald-500 focus:ring-emerald-500"
              />
              <span>Create or link Client Profile in AstroERP CRM</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Conversion Notes / Order Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Ring size 16, Panchdhatu setting, energization scheduled on Shukla Paksha Thursday."
              className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-red-950/80 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1c060e] hover:bg-[#280814] text-slate-300 hover:text-white border border-red-950 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Conversion & Log Revenue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
