/**
 * Client Profile Drawer / Modal
 * Displays personal details, attached natal charts (with one-click full interactive chart inspection),
 * notes editor, and consultation/gemstone purchase timeline with 1-Click Auto-Dispensing.
 * Styled in the Executive Command Center Theme (#0e0307 background, red/orange accents, Outfit/Cinzel typography)
 */

import React, { useState } from 'react';
import { Client, AttachedNatalChart, GemstoneRecommendation } from '../../types';
import { NatalWheelChart } from '../PublicAstrology/NatalWheelChart';
import { InterpretationView } from '../PublicAstrology/InterpretationView';
import { PredictionsView } from '../PublicAstrology/PredictionsView';
import { GemstonePrescription } from '../PublicAstrology/GemstonePrescription';
import { PrintableReportModal } from '../PublicAstrology/PrintableReportModal';
import { X, Sparkles, Calendar, Gem, Mail, Phone, MapPin, CheckCircle2, Flame } from 'lucide-react';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNotes: (clientId: string, notes: string) => void;
  onBookAppointment: (client: Client) => void;
  onAutoDispenseGemstone?: (recommendation: GemstoneRecommendation, client: Client) => void;
  currencySymbol?: string;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  isOpen,
  onClose,
  onUpdateNotes,
  onBookAppointment,
  onAutoDispenseGemstone,
  currencySymbol = '$',
}) => {
  if (!isOpen || !client) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'chart' | 'prescriptions'>('profile');
  const [selectedChartIndex, setSelectedChartIndex] = useState<number>(0);
  const [notes, setNotes] = useState(client.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const currentChart = client.attachedCharts && client.attachedCharts.length > 0 ? client.attachedCharts[selectedChartIndex] : null;

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    onUpdateNotes(client.id, notes);
    setTimeout(() => setIsSavingNotes(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-[#0e0307] border border-red-900/60 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-950/80 bg-[#120408]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 border border-orange-500/50 flex items-center justify-center font-bold text-white text-lg font-['Outfit',sans-serif] shadow-md">
              {client.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit',sans-serif]">
                <span>{client.name}</span>
                {client.tags && client.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1c060e] text-orange-300 border border-orange-600/40 font-semibold">
                    {t}
                  </span>
                ))}
              </h3>
              <p className="text-xs text-slate-400">
                DOB: {client.dateOfBirth} at {client.timeOfBirth} • {client.placeOfBirth}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookAppointment(client)}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Reading</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-rose-950/80 hover:text-rose-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-red-950/80 bg-[#120408]/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer font-['Outfit',sans-serif] ${
              activeTab === 'profile' ? 'border-orange-500 text-orange-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Client Profile & Notes
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer font-['Outfit',sans-serif] ${
              activeTab === 'chart' ? 'border-orange-500 text-orange-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Attached Kundli Charts ({client.attachedCharts ? client.attachedCharts.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer font-['Outfit',sans-serif] ${
              activeTab === 'prescriptions' ? 'border-orange-500 text-orange-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Gemstone Prescriptions & Dispensing
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs bg-[#0e0307]">
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#120408] p-4 rounded-2xl border border-red-900/60 flex items-center gap-3 shadow-sm">
                  <div className="p-2 bg-[#1c060e] rounded-xl text-orange-400 border border-orange-600/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Email</span>
                    <div className="text-white font-medium">{client.email || 'None'}</div>
                  </div>
                </div>
                <div className="bg-[#120408] p-4 rounded-2xl border border-red-900/60 flex items-center gap-3 shadow-sm">
                  <div className="p-2 bg-[#1c060e] rounded-xl text-orange-400 border border-orange-600/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Phone</span>
                    <div className="text-white font-medium">{client.phone || 'None'}</div>
                  </div>
                </div>
                <div className="bg-[#120408] p-4 rounded-2xl border border-red-900/60 flex items-center gap-3 shadow-sm">
                  <div className="p-2 bg-[#1c060e] rounded-xl text-orange-400 border border-orange-600/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Birthplace</span>
                    <div className="text-white font-medium">{client.placeOfBirth || 'None'}</div>
                  </div>
                </div>
              </div>

              {/* Astrological Quick Summary */}
              {client.ascendant && (
                <div className="bg-[#1a060e] p-4 rounded-2xl border border-orange-600/40 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider font-['Outfit',sans-serif]">Primary Astrological Markers</span>
                    <div className="text-sm font-bold text-white mt-0.5">
                      Lagna: <span className="text-orange-400">{client.ascendant}</span> • Rashi: <span className="text-orange-400">{client.moonSign}</span> • Nakshatra: <span className="text-amber-300">{client.nakshatra}</span>
                    </div>
                  </div>
                  <Sparkles className="w-6 h-6 text-orange-400" />
                </div>
              )}

              {/* Astrologer Private Clinical Notes */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-200 flex items-center justify-between font-['Outfit',sans-serif]">
                  <span>Astrologer Consultation & Remedial Notes:</span>
                  <span className="text-[10px] text-slate-400">Private clinical records</span>
                </label>
                <textarea
                  rows={6}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Record natal transits discussed, gemstone wearing instructions, mantra diksha details..."
                  className="w-full bg-[#120408] border border-red-900/60 rounded-2xl p-4 text-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none font-sans shadow-inner"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSavingNotes ? 'Saving Notes...' : 'Save Private Notes'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Attached Kundli Charts */}
          {activeTab === 'chart' && (
            <div className="space-y-6">
              {currentChart ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-[#120408] p-4 rounded-2xl border border-red-900/60 shadow-xl">
                    <div>
                      <h4 className="font-bold text-white text-sm font-['Outfit',sans-serif]">{currentChart.name}</h4>
                      <p className="text-xs text-slate-400">
                        Calculated: {new Date(currentChart.calculatedAt).toLocaleDateString()} • Sun in {currentChart.sunSign}, Moon in {currentChart.moonSign}, {currentChart.ascendantSign} Rising
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPdfModal(true)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Export Full PDF Report</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-6 flex justify-center">
                      <NatalWheelChart chartData={currentChart.chartData} size={480} />
                    </div>
                    <div className="lg:col-span-6">
                      <InterpretationView interpretations={currentChart.chartData.interpretations} subjectName={client.name} />
                    </div>
                  </div>

                  <PredictionsView chartData={currentChart.chartData} />
                </>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No natal chart currently attached. You can generate one via the Public Chart Engine or by editing the client profile.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Gemstone Remedies */}
          {activeTab === 'prescriptions' && (
            <div>
              {currentChart ? (
                <GemstonePrescription
                  recommendations={currentChart.chartData.interpretations.gemstoneRecommendations}
                  subjectName={client.name}
                  onAutoDispense={rec => {
                    if (onAutoDispenseGemstone) {
                      onAutoDispenseGemstone(rec, client);
                    }
                  }}
                />
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Please calculate and attach a natal chart to view personalized gemstone prescriptions.
                </div>
              )}
            </div>
          )}
        </div>

        {/* PDF Modal if opened */}
        {currentChart && (
          <PrintableReportModal
            chartData={currentChart.chartData}
            isOpen={showPdfModal}
            onClose={() => setShowPdfModal(false)}
            currencySymbol={currencySymbol}
          />
        )}
      </div>
    </div>
  );
};
