/**
 * Client Profile Drawer / Modal
 * Displays personal details, attached natal charts (with one-click full interactive chart inspection),
 * notes editor, and consultation/gemstone purchase timeline.
 */

import React, { useState } from 'react';
import { Client, AttachedNatalChart } from '../../types';
import { NatalWheelChart } from '../PublicAstrology/NatalWheelChart';
import { InterpretationView } from '../PublicAstrology/InterpretationView';
import { PredictionsView } from '../PublicAstrology/PredictionsView';
import { GemstonePrescription } from '../PublicAstrology/GemstonePrescription';
import { PrintableReportModal } from '../PublicAstrology/PrintableReportModal';
import { X, Sparkles, Calendar, DollarSign, Gem, User, MapPin, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNotes: (clientId: string, notes: string) => void;
  onBookAppointment: (client: Client) => void;
  currencySymbol?: string;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  isOpen,
  onClose,
  onUpdateNotes,
  onBookAppointment,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center font-bold text-indigo-400 text-lg">
              {client.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {client.name}
                {client.tags && client.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
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
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule Reading
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-950/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer ${
              activeTab === 'profile' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Client Profile & Notes
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'chart' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Attached Natal Chart ({client.attachedCharts?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'prescriptions' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Gem className="w-3.5 h-3.5 text-emerald-400" />
            Gemstone Remedies
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Profile & Notes */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info Card */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  Personal Information
                </h4>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email:</span>
                    <span className="font-semibold text-white">{client.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone:</span>
                    <span className="font-semibold text-white">{client.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Birth Location:</span>
                    <span className="font-semibold text-white">{client.placeOfBirth}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Gender & Occupation:</span>
                    <span className="font-semibold text-white">{client.gender} • {client.occupation || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Lifetime Spend:</span>
                    <span className="font-bold text-emerald-400 text-sm">{currencySymbol}{(client.totalSpent ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Astrologer Consultation Notes */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Astrologer Consultation & Remedial Notes
                  </h4>
                  <textarea
                    rows={6}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Record notes on transit observations, recommended gemstones, muhurta dates..."
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  >
                    {isSavingNotes ? 'Saved!' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Attached Natal Chart */}
          {activeTab === 'chart' && (
            <div className="space-y-6">
              {currentChart ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <h4 className="font-bold text-white text-sm">{currentChart.name}</h4>
                      <p className="text-xs text-slate-400">
                        Calculated: {new Date(currentChart.calculatedAt).toLocaleDateString()} • Sun in {currentChart.sunSign}, Moon in {currentChart.moonSign}, {currentChart.ascendantSign} Rising
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPdfModal(true)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Export Full PDF Report
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
