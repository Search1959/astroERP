import React, { useState } from 'react';
import { Send, Smartphone, Sparkles, X, MessageSquare, Target } from 'lucide-react';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateInbound: (payload: {
    senderPhone: string;
    senderName: string;
    messageText: string;
    source: string;
    campaign: string;
    adName?: string;
  }) => void;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose,
  onSimulateInbound,
}) => {
  if (!isOpen) return null;

  const [senderName, setSenderName] = useState('Ankit Dave');
  const [senderPhone, setSenderPhone] = useState('+91 98200 77889');
  const [messageText, setMessageText] = useState(
    'Hi, I saw your Facebook Ad for Ceylon Yellow Sapphire (Pukhraj). Can you check my horoscope compatibility and share price details?'
  );
  const [source, setSource] = useState('Meta Ads');
  const [campaign, setCampaign] = useState('Meta_ClickToWhatsApp_Gemstone_Q1');
  const [adName, setAdName] = useState('Ad_Pukhraj_YellowSapphire_Video');

  const presetScenarios = [
    {
      title: 'Meta Ad: Ceylon Pukhraj',
      name: 'Aditi Deshpande',
      phone: '+91 98190 33445',
      source: 'Meta Ads',
      campaign: 'Meta_ClickToWhatsApp_Gemstone_Q1',
      ad: 'Ad_Pukhraj_YellowSapphire_Video',
      msg: 'Namaste, saw your ad on Yellow Sapphire for Sagittarius lagna. Please advise consultation slots for today.',
    },
    {
      title: 'Instagram Reel: Kundli Milan',
      name: 'Rohan Joshi',
      phone: '+91 99300 44556',
      source: 'Instagram',
      campaign: 'Instagram_Reels_Kundli_Milan',
      ad: 'Reel_GunMilan_DoshaRemedy',
      msg: 'Hello! I need 36-Guna Kundli matching for my marriage proposal next week. How much time does it take?',
    },
    {
      title: 'Facebook: Shani Sade Sati',
      name: 'Manish Tyagi',
      phone: '+91 98110 55667',
      source: 'Facebook',
      campaign: 'FB_LeadGen_Career_Horoscope',
      ad: 'Carousel_10thHouse_CareerGrowth',
      msg: 'Going through Shani Sade Sati Dhaiya. Looking for Saturday Telabhishek puja and certified Blue Sapphire.',
    },
  ];

  const handleApplyPreset = (p: typeof presetScenarios[0]) => {
    setSenderName(p.name);
    setSenderPhone(p.phone);
    setSource(p.source);
    setCampaign(p.campaign);
    setAdName(p.ad);
    setMessageText(p.msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulateInbound({
      senderName,
      senderPhone,
      messageText,
      source,
      campaign,
      adName,
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
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Meta / WhatsApp Lead Simulator</h3>
              <p className="text-xs text-emerald-400/90">
                Test incoming Click-to-WhatsApp Ads webhook payload & auto-lead creation
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

        {/* Preset Quick Chips */}
        <div className="px-6 pt-4 pb-2 bg-slate-950/40 border-b border-slate-800">
          <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Presets (1-Click Fill):
          </div>
          <div className="flex flex-wrap gap-2">
            {presetScenarios.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:border-emerald-500/40 border border-slate-700 text-xs text-slate-300 hover:text-emerald-300 transition"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Customer Full Name</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">WhatsApp Number (+Country)</label>
              <input
                type="text"
                required
                value={senderPhone}
                onChange={e => setSenderPhone(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Source Platform</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Meta Ads">Meta Ads (Click-to-WA)</option>
                <option value="Instagram">Instagram Direct / Reel</option>
                <option value="Facebook">Facebook Page</option>
                <option value="WhatsApp">Direct WhatsApp</option>
                <option value="Google Ads">Google Search Ad</option>
                <option value="Website">Website Floating Chat</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Campaign Tag</label>
              <input
                type="text"
                value={campaign}
                onChange={e => setCampaign(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Ad Creative / Reel Name</label>
            <input
              type="text"
              value={adName}
              onChange={e => setAdName(e.target.value)}
              placeholder="e.g. Ad_Pukhraj_YellowSapphire_Video"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Incoming WhatsApp Message Body</label>
            <textarea
              rows={3}
              required
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              Simulate Inbound WhatsApp Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
