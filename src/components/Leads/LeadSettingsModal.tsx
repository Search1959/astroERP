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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">WhatsApp CRM & Webhook Settings</h3>
              <p className="text-xs text-slate-400">
                Configure Meta Cloud API credentials, auto-assignment, & canned templates
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

        {/* Tab Selection */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-800 bg-slate-950/40 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 font-semibold border-b-2 transition ${
              activeTab === 'api'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Meta API & Webhook
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-3 font-semibold border-b-2 transition ${
              activeTab === 'templates'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Canned WhatsApp Templates ({formData.templates?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 font-semibold border-b-2 transition ${
              activeTab === 'rules'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Auto-Assignment & Reasons
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Meta Webhook Callback URL:
                </div>
                <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg font-mono text-slate-300 text-xs select-all">
                  https://your-domain.com/api/webhooks/whatsapp
                </div>
                <p className="text-[11px] text-slate-500">
                  Configure this in your Meta Business Suite App Dashboard under WhatsApp &gt; Configuration &gt; Callback URL.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Webhook Verify Token</label>
                  <input
                    type="text"
                    value={formData.whatsapp_verify_token}
                    onChange={e => setFormData({ ...formData, whatsapp_verify_token: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">WhatsApp Phone Number ID</label>
                  <input
                    type="text"
                    value={formData.whatsapp_phone_number_id}
                    onChange={e => setFormData({ ...formData, whatsapp_phone_number_id: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Business Account ID (WABA ID)</label>
                <input
                  type="text"
                  value={formData.whatsapp_business_account_id}
                  onChange={e => setFormData({ ...formData, whatsapp_business_account_id: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Permanent Meta Graph API Access Token</label>
                <input
                  type="password"
                  value={formData.whatsapp_access_token}
                  onChange={e => setFormData({ ...formData, whatsapp_access_token: e.target.value })}
                  placeholder="EAAG..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              {/* Add Template Form */}
              <form onSubmit={handleAddTemplate} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="font-semibold text-white">Add New WhatsApp Response Template</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Template Name / Keyword</label>
                    <input
                      type="text"
                      required
                      value={newTemplateName}
                      onChange={e => setNewTemplateName(e.target.value)}
                      placeholder="e.g. Gemstone Lab Certificate Info"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400 mb-1">Supported Dynamic Placeholders:</span>
                    <div className="text-[10px] text-indigo-400 font-mono">
                      {"{{name}}"}, {"{{lead_id}}"}, {"{{time}}"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Message Text</label>
                  <textarea
                    rows={3}
                    required
                    value={newTemplateContent}
                    onChange={e => setNewTemplateContent(e.target.value)}
                    placeholder="Namaste {{name}} Ji! Here is the certified Astro lab report..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Template
                  </button>
                </div>
              </form>

              {/* Existing Templates */}
              <div className="space-y-2">
                {(formData.templates || []).map(t => (
                  <div key={t.id} className="bg-slate-850 bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{t.name}</span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-slate-300 whitespace-pre-wrap font-sans text-xs">{t.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTemplate(t.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition shrink-0"
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
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.auto_assign_enabled}
                    onChange={e => setFormData({ ...formData, auto_assign_enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700"
                  />
                  <div>
                    <span className="font-semibold text-white block">Auto-Assign Incoming WhatsApp Leads</span>
                    <span className="text-[11px] text-slate-400 block">
                      Distribute new Meta Ads leads to staff astrologers sequentially
                    </span>
                  </div>
                </label>

                {formData.auto_assign_enabled && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Distribution Method</label>
                    <select
                      value={formData.auto_assign_rule}
                      onChange={e => setFormData({ ...formData, auto_assign_rule: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="round_robin">Round Robin (Even Rotation)</option>
                      <option value="specific_user">Default Primary Astrologer</option>
                      <option value="unassigned">Keep in Open Queue</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Custom Reasons for Lost / Closed Leads (Comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={(formData.lost_reasons || []).join('\n')}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      lost_reasons: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className="w-full bg-slate-850 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-lg transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
