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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Convert Lead to Customer</h3>
              <p className="text-xs text-emerald-400/90 font-mono">
                {lead.name} • {lead.whatsapp_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3.5 text-xs text-emerald-300">
            Converting this lead will mark its status as <span className="font-semibold text-white">CONVERTED</span>, record attributed revenue, and sync client records into AstroERP.
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Service / Gemstone Purchased <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={servicePurchased}
              onChange={e => setServicePurchased(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. 5.25 Ratti Ceylon Pukhraj + Ring Setting"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Amount Paid ({currencySymbol}) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">{currencySymbol}</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Payment Mode <span className="text-emerald-400">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
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

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-300">
              <input
                type="checkbox"
                checked={createClient}
                onChange={e => setCreateClient(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
              />
              <span>Create or link Client Profile in AstroERP CRM</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Conversion Notes / Order Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Ring size 16, Panchdhatu setting, energization scheduled on Shukla Paksha Thursday."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition"
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
