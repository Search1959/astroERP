/**
 * CSV Import Modal for Inventory Items
 */

import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { InventoryItem } from '../../types';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: Partial<InventoryItem>[]) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [parseError, setParseError] = useState('');
  const [parsedItems, setParsedItems] = useState<Partial<InventoryItem>[]>([]);

  const sampleCsv = `SKU,Name,Category,WeightCarats,Planet,CostPrice,SellingPrice,StockQuantity,MinStock
GEM-9001,Ceylon Blue Sapphire,Precious Gemstones,5.2,Saturn,600,1200,4,2
GEM-9002,Burmese Ruby (Manik),Precious Gemstones,3.8,Sun,800,1650,2,1
GEM-9003,Colombian Emerald,Precious Gemstones,4.1,Mercury,450,900,5,2
GEM-9004,Natural Pearl (Moti),Precious Gemstones,6.5,Moon,120,280,10,3`;

  const handleLoadSample = () => {
    setRawText(sampleCsv);
    handleParseCsv(sampleCsv);
  };

  const handleParseCsv = (csv: string) => {
    try {
      setParseError('');
      const lines = csv.trim().split('\n').filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        setParseError('CSV must include a header row and at least one data row.');
        setParsedItems([]);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const items: Partial<InventoryItem>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        const item: any = {};

        headers.forEach((header, index) => {
          const val = values[index];
          if (!val) return;

          const h = header.toLowerCase();
          if (h.includes('sku')) item.sku = val;
          else if (h.includes('name')) item.name = val;
          else if (h.includes('category')) item.category = val;
          else if (h.includes('planet')) item.associatedPlanet = val;
          else if (h.includes('carat')) item.weightCarats = parseFloat(val) || 0;
          else if (h.includes('cost')) item.costPrice = parseFloat(val) || 0;
          else if (h.includes('selling') || h.includes('price')) item.sellingPrice = parseFloat(val) || 0;
          else if (h.includes('stock') || h.includes('quantity')) item.stockQuantity = parseInt(val) || 0;
          else if (h.includes('min') || h.includes('threshold')) item.minStockThreshold = parseInt(val) || 1;
        });

        if (item.name) {
          if (!item.sku) item.sku = `IMP-${Math.floor(1000 + Math.random() * 9000)}`;
          if (!item.category) item.category = 'Precious Gemstones';
          if (!item.costPrice) item.costPrice = 100;
          if (!item.sellingPrice) item.sellingPrice = 250;
          if (item.stockQuantity === undefined) item.stockQuantity = 1;
          if (!item.minStockThreshold) item.minStockThreshold = 1;
          item.isCertified = true;
          item.certificationLab = 'GIA';
          items.push(item);
        }
      }

      setParsedItems(items);
    } catch (err: any) {
      setParseError(`Failed to parse CSV: ${err.message}`);
      setParsedItems([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      setRawText(content);
      handleParseCsv(content);
    };
    reader.readAsText(file);
  };

  const handleImportConfirm = () => {
    if (parsedItems.length === 0) return;
    onImport(parsedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            Bulk CSV Gemstone Inventory Import
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-300">
              Paste CSV Data or Upload a File:
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Load Sample CSV
              </button>
              <label className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition">
                Choose File
                <input type="file" accept=".csv, .txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <textarea
            rows={7}
            value={rawText}
            onChange={e => {
              setRawText(e.target.value);
              handleParseCsv(e.target.value);
            }}
            placeholder="SKU,Name,Category,WeightCarats,Planet,CostPrice,SellingPrice,StockQuantity,MinStock..."
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-[11px] focus:ring-2 focus:ring-indigo-500"
          />

          {parseError && (
            <div className="p-3 bg-rose-950/70 border border-rose-800 rounded-xl text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {parsedItems.length > 0 && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Ready to import <strong>{parsedItems.length} gemstone lots</strong> into inventory.</span>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={parsedItems.length === 0}
              onClick={handleImportConfirm}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg transition cursor-pointer"
            >
              Import {parsedItems.length} Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
