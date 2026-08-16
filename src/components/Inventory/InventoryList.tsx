/**
 * Astrological Gemstone & Stone Inventory Roster
 * Filter by Planet, Category, Origin, Certification, Low-Stock Alerts
 */

import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { Gem, Search, AlertTriangle, Plus, ShieldCheck, Download, Upload, Filter, Tag, ArrowUpRight, Edit3, Trash2 } from 'lucide-react';

interface InventoryListProps {
  inventory: InventoryItem[];
  onOpenAddStoneModal: () => void;
  onEditStone: (item: InventoryItem) => void;
  onDeleteStone: (itemId: string) => void;
  onOpenCsvImportModal: () => void;
  onIssueSaleForStone?: (item: InventoryItem) => void;
  currencySymbol?: string;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  inventory,
  onOpenAddStoneModal,
  onEditStone,
  onDeleteStone,
  onOpenCsvImportModal,
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
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Jyotish Gemstone & Vault Inventory
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified natural gemstones, planetary talismans, rudraksha beads, and remedial inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenCsvImportModal}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>
          <button
            onClick={exportInventoryCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            id="btn-add-stone-inventory"
            onClick={onOpenAddStoneModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Add Gemstone / Lot
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Filtered Items</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{filteredItems.length} Lots</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Gem className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Vault Retail Valuation</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {currencySymbol}{totalVaultValue.toLocaleString()}
            </div>
            <span className="text-xs text-slate-400">Cost: {currencySymbol}{totalCostValue.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Low Stock Reorders</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">
              {inventory.filter(i => i.stockQuantity <= i.minStockThreshold).length} Items
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-inventory-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, Stone name, Planet, Lab Cert..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Planet Filter */}
          <select
            value={planetFilter}
            onChange={e => setPlanetFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Astrological Planets</option>
            {planets.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              showLowStockOnly
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Low Stock Only
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">SKU & Gemstone Name</th>
                <th className="py-3 px-4">Planet & Remedy</th>
                <th className="py-3 px-4">Weight & Origin</th>
                <th className="py-3 px-4">Lab Certification</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4">Price / Unit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No gemstone items found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isLow = item.stockQuantity <= item.minStockThreshold;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      {/* Name & SKU */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{item.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 border border-slate-200">
                            {item.sku}
                          </span>
                        </div>
                        {item.sanskritName && (
                          <div className="text-indigo-600 text-[11px] font-serif mt-0.5">
                            {item.sanskritName} • {item.category || item.categoryName || 'Gemstone'}
                          </div>
                        )}
                      </td>

                      {/* Planet & Jyotish association */}
                      <td className="py-3 px-4">
                        {(item.associatedPlanet || item.rulingPlanet) ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-600" />
                            <span className="text-slate-900 font-semibold">{item.associatedPlanet || item.rulingPlanet}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.color || ''}</div>
                      </td>

                      {/* Weight & Origin */}
                      <td className="py-3 px-4 text-slate-700">
                        <div>{item.weightCarats ? `${item.weightCarats} Carat` : ''} {item.weightRatti ? `(${item.weightRatti} Ratti)` : ''}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.origin || 'Natural / Mine'}</div>
                      </td>

                      {/* Certification */}
                      <td className="py-3 px-4">
                        {item.isCertified || item.certificationLab ? (
                          <div className="space-y-0.5">
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              {item.certificationLab || 'Certified'}
                            </span>
                            {item.certificateNumber && (
                              <span className="text-[10px] font-mono text-slate-400 block">
                                #{item.certificateNumber}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Uncertified</span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${isLow ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {item.stockQuantity ?? 0} in stock
                          </span>
                          {isLow && (
                            <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 font-bold">
                              Low (Min: {item.minStockThreshold ?? 0})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-emerald-700 text-sm">
                          {currencySymbol}{(item.sellingPrice ?? item.salePrice ?? 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Cost: {currencySymbol}{(item.costPrice ?? item.purchasePrice ?? 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onIssueSaleForStone && (
                            <button
                              onClick={() => onIssueSaleForStone(item)}
                              title="Sell / Invoice this Stone"
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 transition cursor-pointer"
                            >
                              Sell
                            </button>
                          )}
                          <button
                            onClick={() => onEditStone(item)}
                            title="Edit Stone"
                            className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg border border-slate-200 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteStone(item.id)}
                            title="Delete Item"
                            className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg border border-slate-200 transition cursor-pointer"
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
