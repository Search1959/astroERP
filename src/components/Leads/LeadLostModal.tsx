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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 px-6 py-4 border-b border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Mark Lead as Lost / Rejected</h3>
              <p className="text-xs text-rose-400/90 font-mono">
                {lead.name} • {lead.lead_id}
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
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Reason for Loss / Closure <span className="text-rose-400">*</span>
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500 text-xs"
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
              <span>Mark as <strong>LOST</strong> (Opportunity Closed)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="radio"
                name="stage_type"
                checked={isRejected}
                onChange={() => setIsRejected(true)}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span>Mark as <strong>REJECTED</strong> (Disqualified / Spam)</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Additional Details / Client Feedback
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Client mentioned budget was under ₹5,000 for natural emerald. Suggested semi-precious alternative or deferred to next quarter."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
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
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/30 flex items-center gap-2 transition"
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
