import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import {
  Gem,
  Search,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface MobileInventoryTabProps {
  inventory: InventoryItem[];
  currencySymbol: string;
  onOpenNewStoneModal: () => void;
  onQuickSellStone?: (stone: InventoryItem) => void;
}

export const MobileInventoryTab: React.FC<MobileInventoryTabProps> = ({
  inventory = [],
  currencySymbol = '₹',
  onOpenNewStoneModal,
  onQuickSellStone,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState<string>('ALL');

  const PLANET_FILTERS = ['ALL', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  const filteredInventory = inventory.filter(item => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (item.name || '').toLowerCase().includes(q) || (item.sanskritName || '').toLowerCase().includes(q);
    const skuMatch = (item.sku || '').toLowerCase().includes(q);
    const planetMatch = selectedPlanet === 'ALL' || (item.associatedPlanet || '').toLowerCase() === selectedPlanet.toLowerCase();
    return (nameMatch || skuMatch) && planetMatch;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Gemstone Vault (Ratna Shastra)</h2>
              <p className="text-[11px] text-slate-400">{inventory.length} Certified Stones in Stock</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNewStoneModal}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Gem</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Pukhraj, Neelam, Manik, Panna..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Planetary Filters */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
          {PLANET_FILTERS.map(planet => (
            <button
              type="button"
              key={planet}
              onClick={() => setSelectedPlanet(planet)}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedPlanet === planet
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {planet}
            </button>
          ))}
        </div>
      </div>

      {/* Gemstone Items List */}
      <div className="space-y-3">
        {filteredInventory.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <Gem className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-400">No gemstones found.</p>
          </div>
        ) : (
          filteredInventory.map(item => {
            const price = item.sellingPrice || item.salePrice || 0;
            const inStock = (item.stockQuantity || 0) > 0;

            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      {item.sanskritName && (
                        <span className="text-[11px] text-amber-300 font-serif">({item.sanskritName})</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Planet: <strong className="text-indigo-300">{item.associatedPlanet || item.rulingPlanet || 'Jupiter'}</strong> •{' '}
                      {item.weightCarats || 4.5} Carats ({item.weightRatti || 4.95} Ratti)
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Lab: {item.certificationLab || 'Govt Certified'}
                      </span>
                      {item.isCertified && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-0.5 font-medium">
                          <Sparkles className="w-2.5 h-2.5" /> Certified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400 block">
                      {currencySymbol}{price.toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
                        inStock
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {inStock ? `${item.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Sell / Dispense Action */}
                {onQuickSellStone && inStock && (
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => onQuickSellStone(item)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Gem className="w-3.5 h-3.5" />
                      <span>Dispense & Create Invoice ({currencySymbol}{price.toLocaleString('en-IN')})</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
