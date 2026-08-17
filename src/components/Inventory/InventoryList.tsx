/**
 * Astrological Gemstone & Stone Inventory Roster
 * Filter by Planet, Category, Origin, Certification, Low-Stock Alerts
 * Enhanced with Camera Barcode Scanner & 1-Click Auto-Procure Reordering.
 */

import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import {
  Gem,
  Search,
  AlertTriangle,
  Plus,
  ShieldCheck,
  Download,
  Upload,
  Filter,
  Tag,
  ArrowUpRight,
  Edit3,
  Trash2,
  Camera,
  Sparkles,
  RefreshCw,
  Zap
} from 'lucide-react';

interface InventoryListProps {
  inventory: InventoryItem[];
  onOpenAddStoneModal: () => void;
  onEditStone: (item: InventoryItem) => void;
  onDeleteStone: (itemId: string) => void;
  onOpenCsvImportModal: () => void;
  onOpenScanner?: () => void;
  onAutoRestockAll?: () => void;
  onIssueSaleForStone?: (item: InventoryItem) => void;
  currencySymbol?: string;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  inventory,
  onOpenAddStoneModal,
  onEditStone,
  onDeleteStone,
  onOpenCsvImportModal,
  onOpenScanner,
  onAutoRestockAll,
  onIssueSaleForStone,
  currencySymbol = '$',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [planetFilter, setPlanetFilter] = useState('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const categories = Array.from(new Set(inventory.map(i => i.category || i.categoryName || 'Gemstone')));
  const planets = Array.from(new Set(inventory.map(i => i.associatedPlanet || i.rulingPlanet).filter(Boolean))) as string[];

  const filteredItems = inventory.filter(item => {
    const itemName = (item.name || '').toLowerCase();
    const itemSku = (item.sku || '').toLowerCase();
    const itemSanskrit = (item.sanskritName || '').toLowerCase();
    const itemOrigin = (item.origin || '').toLowerCase();
    const itemCert = (item.certificateNumber || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      itemName.includes(q) ||
      itemSku.includes(q) ||
      itemSanskrit.includes(q) ||
      itemOrigin.includes(q) ||
      itemCert.includes(q);

    const itemCat = item.category || item.categoryName || 'Gemstone';
    const itemPln = item.associatedPlanet || item.rulingPlanet || '';

    const matchesCategory = categoryFilter === 'all' || itemCat === categoryFilter;
    const matchesPlanet = planetFilter === 'all' || itemPln === planetFilter;
    const matchesLowStock = !showLowStockOnly || (item.stockQuantity || 0) <= (item.minStockThreshold || 0);

    return matchesSearch && matchesCategory && matchesPlanet && matchesLowStock;
  });

  const lowStockCount = inventory.filter(i => (i.stockQuantity || 0) <= (i.minStockThreshold || 1)).length;

  const totalVaultValue = filteredItems.reduce((sum, item) => {
    const price = item.sellingPrice ?? item.salePrice ?? 0;
    const qty = item.stockQuantity || 0;
    return sum + (price * qty);
  }, 0);

  const totalCostValue = filteredItems.reduce((sum, item) => {
    const cost = item.costPrice ?? item.purchasePrice ?? 0;
    const qty = item.stockQuantity || 0;
    return sum + (cost * qty);
  }, 0);

  const exportInventoryCSV = () => {
    const headers = ['SKU,Name,SanskritName,Category,WeightCarats,Ratti,Planet,Origin,CostPrice,SellingPrice,StockQuantity,MinStock,CertificationLab,CertificateNo'];
    const rows = filteredItems.map(i => {
      const price = i.sellingPrice ?? i.salePrice ?? 0;
      const cost = i.costPrice ?? i.purchasePrice ?? 0;
      const cat = i.category || i.categoryName || 'Gemstone';
      const pln = i.associatedPlanet || i.rulingPlanet || '';
      return `"${i.sku || ''}","${i.name || ''}","${i.sanskritName || ''}","${cat}",${i.weightCarats || ''},${i.weightRatti || ''},"${pln}","${i.origin || ''}",${cost},${price},${i.stockQuantity || 0},${i.minStockThreshold || 0},"${i.certificationLab || ''}","${i.certificateNumber || ''}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AstroERP_Gemstone_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header and Controls */}
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Jyotish Gemstone & Vault Inventory
            </h2>
            <span className="text-[11px] bg-[#250813] text-orange-300 font-bold px-2 py-0.5 rounded-md border border-orange-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-orange-400" />
              Auto-Purchases Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Certified natural gemstones, planetary talismans, rudraksha beads, and remedial inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-2 bg-[#1c060e] hover:bg-[#2a0914] text-orange-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-orange-500/30 transition cursor-pointer shadow-xs"
            >
              <Camera className="w-4 h-4 text-orange-400" />
              Camera / Barcode Scan
            </button>
          )}

          <button
            onClick={onOpenCsvImportModal}
            className="px-3.5 py-2 bg-[#14050a] hover:bg-[#1f0710] text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-red-950/80 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-orange-400" />
            Import Excel (.xlsx) / CSV
          </button>

          <button
            onClick={exportInventoryCSV}
            className="px-3.5 py-2 bg-[#14050a] hover:bg-[#1f0710] text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-red-950/80 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            Export CSV
          </button>

          <button
            id="btn-add-stone-inventory"
            onClick={onOpenAddStoneModal}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Add Gemstone / Lot
          </button>
        </div>
      </div>

      {/* Low Stock Auto-Procure Callout Banner */}
      {lowStockCount > 0 && onAutoRestockAll && (
        <div className="bg-gradient-to-r from-red-950/60 via-orange-950/40 to-[#14050a] border border-orange-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-['Outfit',sans-serif]">
                {lowStockCount} Gemstone Lots Below Min Stock Threshold
              </h4>
              <p className="text-[11px] text-orange-200/80">
                Replenish all depleted items with 1 click. Zero manual data entry needed for supplier orders.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAutoRestockAll}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            ⚡ Auto-Procure & Restock All ({lowStockCount} Lots)
          </button>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Filtered Items</span>
            <div className="text-2xl font-bold text-white mt-1 font-['Cinzel',serif]">{filteredItems.length} Lots</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#250813] flex items-center justify-center text-orange-400 border border-orange-500/20">
            <Gem className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Vault Retail Valuation</span>
            <div className="text-2xl font-bold text-orange-400 mt-1 font-['Cinzel',serif]">
              {currencySymbol}{totalVaultValue.toLocaleString()}
            </div>
            <span className="text-xs text-slate-500">Cost: {currencySymbol}{totalCostValue.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#250813] flex items-center justify-center text-orange-400 border border-orange-500/20">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Depleted / Reorder Alerts</span>
            <div className="text-2xl font-bold text-red-400 mt-1 font-['Cinzel',serif]">
              {lowStockCount} Items
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#250813] flex items-center justify-center text-red-400 border border-red-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="w-4 h-4 text-orange-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-inventory-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, Stone name, Planet, Lab Cert..."
            className="w-full pl-10 pr-4 py-2 bg-[#0e0307] border border-red-950/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-[#0e0307] border border-red-950/80 text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Planet Filter */}
          <select
            value={planetFilter}
            onChange={e => setPlanetFilter(e.target.value)}
            className="bg-[#0e0307] border border-red-950/80 text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
          >
            <option value="all">All Astrological Planets</option>
            {planets.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              showLowStockOnly
                ? 'bg-[#2a0914] text-orange-300 border-orange-500/40'
                : 'bg-[#14050a] text-slate-300 border-red-950/80 hover:bg-[#1f0710]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            Low Stock Only
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#14050a] text-orange-200 uppercase font-semibold tracking-wider border-b border-red-950/80 font-['Outfit',sans-serif]">
                <th className="py-3 px-4">SKU & Gemstone Name</th>
                <th className="py-3 px-4">Planet & Remedy</th>
                <th className="py-3 px-4">Weight & Origin</th>
                <th className="py-3 px-4">Lab Certification</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4">Price / Unit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-950/50 font-medium text-slate-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                    <Gem className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="font-semibold text-slate-300">No gemstone lots found.</p>
                    <p className="text-xs text-slate-500">Add manually, import from Excel (.xlsx), or scan with camera.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isLow = (item.stockQuantity || 0) <= (item.minStockThreshold || 1);

                  return (
                    <tr key={item.id} className="hover:bg-[#1a070e]/60 transition">
                      {/* Name & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm flex items-center gap-2 font-['Outfit',sans-serif]">
                          <span>{item.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c060e] text-orange-400 border border-red-900/60">
                            {item.sku}
                          </span>
                        </div>
                        {item.sanskritName && (
                          <div className="text-orange-300 text-[11px] font-serif mt-0.5">
                            {item.sanskritName} • {item.category || item.categoryName || 'Gemstone'}
                          </div>
                        )}
                      </td>

                      {/* Planet & Jyotish association */}
                      <td className="py-3.5 px-4">
                        {(item.associatedPlanet || item.rulingPlanet) ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                            <span className="text-white font-semibold">{item.associatedPlanet || item.rulingPlanet}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.color || ''}</div>
                      </td>

                      {/* Weight & Origin */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="text-white">{item.weightCarats ? `${item.weightCarats} Carat` : ''} {item.weightRatti ? `(${item.weightRatti} Ratti)` : ''}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.origin || 'Natural / Mine'}</div>
                      </td>

                      {/* Certification */}
                      <td className="py-3.5 px-4">
                        {item.isCertified || item.certificationLab ? (
                          <div className="space-y-0.5">
                            <span className="text-orange-300 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                              {item.certificationLab || 'Certified'}
                            </span>
                            {item.certificateNumber && (
                              <span className="text-[10px] font-mono text-slate-500 block">
                                #{item.certificateNumber}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Uncertified</span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${isLow ? 'text-red-400' : 'text-orange-300'}`}>
                            {item.stockQuantity ?? 0} in stock
                          </span>
                          {isLow && (
                            <span className="text-[10px] bg-[#2a0914] text-red-300 px-1.5 py-0.5 rounded border border-red-800 font-bold">
                              Low (Min: {item.minStockThreshold ?? 1})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-orange-400 text-sm font-['Cinzel',serif]">
                          {currencySymbol}{(item.sellingPrice ?? item.salePrice ?? 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Cost: {currencySymbol}{(item.costPrice ?? item.purchasePrice ?? 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onIssueSaleForStone && (
                            <button
                              onClick={() => onIssueSaleForStone(item)}
                              title="Sell / Invoice this Stone"
                              className="px-2.5 py-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
                            >
                              Sell
                            </button>
                          )}
                          <button
                            onClick={() => onEditStone(item)}
                            title="Edit Stone"
                            className="p-1.5 bg-[#14050a] hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 rounded-lg border border-red-950 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteStone(item.id)}
                            title="Delete Item"
                            className="p-1.5 bg-[#14050a] hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg border border-red-950 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
