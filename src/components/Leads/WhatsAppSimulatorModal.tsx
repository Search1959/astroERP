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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-[#0e0307] border border-red-900/60 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#120408] px-6 py-4 border-b border-red-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 border border-orange-500/50 text-white flex items-center justify-center shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">Meta / WhatsApp Lead Simulator</h3>
              <p className="text-xs text-slate-400">
                Test incoming Click-to-WhatsApp Ads webhook payload & auto-lead creation
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

        {/* Preset Quick Chips */}
        <div className="px-6 pt-4 pb-3 bg-[#16050b] border-b border-red-950/80 shrink-0">
          <div className="text-[11px] font-bold text-orange-400 mb-2 flex items-center gap-1.5 font-['Outfit',sans-serif]">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Quick Presets (1-Click Fill):
          </div>
          <div className="flex flex-wrap gap-2">
            {presetScenarios.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-lg bg-[#1c060e] hover:bg-[#280814] hover:border-orange-500/50 border border-red-950 text-xs text-slate-300 hover:text-orange-300 transition cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-3.5 text-xs bg-[#0e0307]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Customer Full Name</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">WhatsApp Number (+Country)</label>
              <input
                type="text"
                required
                value={senderPhone}
                onChange={e => setSenderPhone(e.target.value)}
                className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Source Platform</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
              <label className="block font-semibold text-slate-300 mb-1">Campaign Tag</label>
              <input
                type="text"
                value={campaign}
                onChange={e => setCampaign(e.target.value)}
                className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Ad Creative / Reel Name</label>
            <input
              type="text"
              value={adName}
              onChange={e => setAdName(e.target.value)}
              placeholder="e.g. Ad_Pukhraj_YellowSapphire_Video"
              className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Incoming WhatsApp Message Body</label>
            <textarea
              rows={3}
              required
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              className="w-full bg-[#16050b] border border-red-950/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
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
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition cursor-pointer"
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
