import React, { useState } from 'react';
import { LeadSettingsData } from '../../types';
import { Settings, Key, Shield, MessageSquare, Plus, Trash2, CheckCircle2, X } from 'lucide-react';

interface LeadSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LeadSettingsData;
  onSaveSettings: (newSettings: LeadSettingsData) => void;
}

export const LeadSettingsModal: React.FC<LeadSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<LeadSettingsData>(settings);
  const [activeTab, setActiveTab] = useState<'api' | 'templates' | 'rules'>('api');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim() || !newTemplateContent.trim()) return;

    const newTpl = {
      id: 'tpl_' + Date.now(),
      name: newTemplateName.trim(),
      category: 'General',
      content: newTemplateContent.trim(),
    };

    setFormData(prev => ({
      ...prev,
      templates: [...(prev.templates || []), newTpl],
    }));

    setNewTemplateName('');
    setNewTemplateContent('');
  };

  const handleDeleteTemplate = (id: string) => {
    setFormData(prev => ({
      ...prev,
      templates: (prev.templates || []).filter(t => t.id !== id),
    }));
  };

  const handleSave = () => {
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-[#0e0307] border border-red-900/60 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#120408] px-6 py-4 border-b border-red-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 border border-orange-500/50 text-white flex items-center justify-center shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">WhatsApp CRM & Webhook Settings</h3>
              <p className="text-xs text-slate-400">
                Configure Meta Cloud API credentials, auto-assignment, & canned templates
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

        {/* Tab Selection */}
        <div className="flex items-center gap-4 px-6 border-b border-red-950/80 bg-[#16050b] text-xs shrink-0">
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'api'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Meta API & Webhook
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-3 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'templates'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Canned WhatsApp Templates ({formData.templates?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'rules'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Auto-Assignment & Reasons
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs bg-[#0e0307]">
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="bg-[#120408] border border-red-950/80 rounded-xl p-4 space-y-2">
                <div className="font-bold text-orange-400 flex items-center gap-1.5 font-['Outfit',sans-serif]">
                  <Shield className="w-4 h-4 text-orange-400" />
                  Meta Webhook Callback URL:
                </div>
                <div className="bg-[#16050b] border border-red-950 px-3 py-2 rounded-lg font-mono text-slate-200 text-xs select-all">
                  https://your-domain.com/api/webhooks/whatsapp
                </div>
                <p className="text-[11px] text-slate-400">
                  Configure this in your Meta Business Suite App Dashboard under WhatsApp &gt; Configuration &gt; Callback URL.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Webhook Verify Token</label>
                  <input
                    type="text"
                    value={formData.whatsapp_verify_token}
                    onChange={e => setFormData({ ...formData, whatsapp_verify_token: e.target.value })}
                    className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">WhatsApp Phone Number ID</label>
                  <input
                    type="text"
                    value={formData.whatsapp_phone_number_id}
                    onChange={e => setFormData({ ...formData, whatsapp_phone_number_id: e.target.value })}
                    className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Business Account ID (WABA ID)</label>
                <input
                  type="text"
                  value={formData.whatsapp_business_account_id}
                  onChange={e => setFormData({ ...formData, whatsapp_business_account_id: e.target.value })}
                  className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Permanent Meta Graph API Access Token</label>
                <input
                  type="password"
                  value={formData.whatsapp_access_token}
                  onChange={e => setFormData({ ...formData, whatsapp_access_token: e.target.value })}
                  placeholder="EAAG..."
                  className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              {/* Add Template Form */}
              <form onSubmit={handleAddTemplate} className="bg-[#120408] border border-red-950/80 rounded-xl p-4 space-y-3">
                <div className="font-bold text-white font-['Outfit',sans-serif]">Add New WhatsApp Response Template</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Template Name / Keyword</label>
                    <input
                      type="text"
                      required
                      value={newTemplateName}
                      onChange={e => setNewTemplateName(e.target.value)}
                      placeholder="e.g. Gemstone Lab Certificate Info"
                      className="w-full bg-[#16050b] border border-red-950/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-300 mb-1">Supported Dynamic Placeholders:</span>
                    <div className="text-[10px] text-orange-400 font-mono pt-1">
                      {"{{name}}"}, {"{{lead_id}}"}, {"{{time}}"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Message Text</label>
                  <textarea
                    rows={3}
                    required
                    value={newTemplateContent}
                    onChange={e => setNewTemplateContent(e.target.value)}
                    placeholder="Namaste {{name}} Ji! Here is the certified Astro lab report..."
                    className="w-full bg-[#16050b] border border-red-950/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Template
                  </button>
                </div>
              </form>

              {/* Existing Templates */}
              <div className="space-y-2">
                {(formData.templates || []).map(t => (
                  <div key={t.id} className="bg-[#120408] border border-red-950/80 rounded-xl p-3.5 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-bold text-white flex items-center gap-2 font-['Outfit',sans-serif]">
                        <span>{t.name}</span>
                        <span className="text-[10px] bg-[#1c060e] text-orange-300 border border-red-950 px-2 py-0.5 rounded">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-slate-300 whitespace-pre-wrap font-sans text-xs">{t.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTemplate(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/60 transition shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-[#120408] border border-red-950/80 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.auto_assign_enabled}
                    onChange={e => setFormData({ ...formData, auto_assign_enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-[#16050b] border-red-950"
                  />
                  <div>
                    <span className="font-bold text-white block font-['Outfit',sans-serif]">Auto-Assign Incoming WhatsApp Leads</span>
                    <span className="text-[11px] text-slate-400 block">
                      Distribute new Meta Ads leads to staff astrologers sequentially
                    </span>
                  </div>
                </label>

                {formData.auto_assign_enabled && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Distribution Method</label>
                    <select
                      value={formData.auto_assign_rule}
                      onChange={e => setFormData({ ...formData, auto_assign_rule: e.target.value as any })}
                      className="w-full bg-[#16050b] border border-red-950/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="round_robin">Round Robin (Even Rotation)</option>
                      <option value="specific_user">Default Primary Astrologer</option>
                      <option value="unassigned">Keep in Open Queue</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Custom Reasons for Lost / Closed Leads (One per line)
                </label>
                <textarea
                  rows={4}
                  value={(formData.lost_reasons || []).join('\n')}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      lost_reasons: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className="w-full bg-[#16050b] border border-red-950/80 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-red-950/80 bg-[#120408] flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1c060e] hover:bg-[#280814] text-slate-300 hover:text-white border border-red-950 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
