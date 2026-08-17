import React, { useState } from 'react';
import { Lead } from '../../types';
import { XCircle, AlertTriangle, X } from 'lucide-react';

interface LeadLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onConfirmLost: (leadId: string, reason: string, notes: string, isRejected: boolean) => void;
  lostReasons?: string[];
}

export const LeadLostModal: React.FC<LeadLostModalProps> = ({
  isOpen,
  onClose,
  lead,
  onConfirmLost,
  lostReasons = [
    'Price Too High / Budget Constraint',
    'Not Interested / Changed Mind',
    'No Response After Multiple Follow-ups',
    'Wrong Number / Invalid Contact',
    'Purchased From Local Jeweller / Competitor',
    'Duplicate Enquiry',
    'Service Not Offered',
    'Looking For Free Consultation Only',
    'Other',
  ],
}) => {
  if (!isOpen || !lead) return null;

  const [reason, setReason] = useState(lostReasons[0] || 'Not Interested');
  const [notes, setNotes] = useState('');
  const [isRejected, setIsRejected] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmLost(lead.lead_id, reason, notes, isRejected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-[#0e0307] border border-red-900/60 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#120408] px-6 py-4 border-b border-red-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-red-800 text-white flex items-center justify-center shadow-md border border-rose-500/40">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">Mark Lead as Lost / Rejected</h3>
              <p className="text-xs text-rose-400 font-mono">
                {lead.name} • {lead.lead_id}
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reason for Loss / Closure <span className="text-rose-400">*</span>
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs"
            >
              {lostReasons.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 py-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="radio"
                name="stage_type"
                checked={!isRejected}
                onChange={() => setIsRejected(false)}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span>Mark as <strong className="text-white">LOST</strong> (Opportunity Closed)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="radio"
                name="stage_type"
                checked={isRejected}
                onChange={() => setIsRejected(true)}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span>Mark as <strong className="text-white">REJECTED</strong> (Disqualified / Spam)</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Additional Details / Client Feedback
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Client mentioned budget was under ₹5,000 for natural emerald. Suggested semi-precious alternative or deferred to next quarter."
              className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs resize-none"
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white text-xs font-bold shadow-lg shadow-rose-950/50 flex items-center gap-2 transition cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              Confirm Status Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
