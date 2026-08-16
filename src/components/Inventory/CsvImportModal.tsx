/**
 * Excel (.xlsx, .xls) & CSV Bulk Gemstone Inventory Importer
 * Powered by SheetJS (xlsx) for native Excel support.
 * Includes downloadable sample Excel file, interactive table preview,
 * and Auto-Purchase Generation for zero human intervention.
 */

import React, { useState } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle2, AlertCircle, Download, Sparkles, ShieldCheck, Gem } from 'lucide-react';
import { InventoryItem } from '../../types';
import * as XLSX from 'xlsx';

interface ExcelAndCsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: Partial<InventoryItem>[], autoGeneratePurchases?: boolean) => void;
  currencySymbol?: string;
}

export const CsvImportModal: React.FC<ExcelAndCsvImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currencySymbol = '$',
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [parseError, setParseError] = useState('');
  const [parsedItems, setParsedItems] = useState<Partial<InventoryItem>[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [autoGeneratePurchases, setAutoGeneratePurchases] = useState<boolean>(true);

  const sampleCsv = `SKU,Name,SanskritName,Category,WeightCarats,Planet,CostPrice,SellingPrice,StockQuantity,MinStock,Origin,CertificationLab,CertificateNo,Clarity,Cut
GEM-9001,Natural Ceylon Yellow Sapphire (Pukhraj),Pushparag,Precious Gemstones,5.2,Jupiter,600,1250,5,2,Ceylon (Sri Lanka),GIA,GIA-948201,VVS1,Oval Brilliant
GEM-9002,Burmese Pigeon Blood Ruby (Manik),Manikya,Precious Gemstones,3.8,Sun,800,1750,3,1,Mogok (Burma),IGI,IGI-774019,Transparent Red,Cushion Cut
GEM-9003,Colombian Royal Emerald (Panna),Marakata,Precious Gemstones,4.5,Mercury,480,980,6,2,Muzo (Colombia),GRS,GRS-883012,Eye Clean,Emerald Cut
GEM-9004,Royal Blue Kashmir Sapphire (Neelam),Indraneelam,Precious Gemstones,4.9,Saturn,950,2100,2,1,Kashmir,GTL,GTL-551029,VVS,Oval Mixed Cut
GEM-9005,Natural South Sea Pearl (Moti),Mukta,Precious Gemstones,7.0,Moon,140,320,12,3,South Sea,Govt Lab,GGL-19402,High Orient,Round Sphere
GEM-9006,Italian Red Coral (Moonga),Praval,Precious Gemstones,6.5,Mars,180,420,8,2,Mediterranean Sea,IGI,IGI-332019,Natural Red,Capsule Cabochon`;

  // Download Sample Excel (.xlsx) Template
  const handleDownloadExcelTemplate = () => {
    const data = [
      {
        SKU: 'GEM-9001',
        Name: 'Natural Ceylon Yellow Sapphire (Pukhraj)',
        SanskritName: 'Pushparag',
        Category: 'Precious Gemstones',
        WeightCarats: 5.2,
        WeightRatti: 5.72,
        Planet: 'Jupiter',
        CostPrice: 600,
        SellingPrice: 1250,
        StockQuantity: 5,
        MinStock: 2,
        Origin: 'Ceylon (Sri Lanka)',
        CertificationLab: 'GIA',
        CertificateNo: 'GIA-948201',
        Clarity: 'VVS1',
        Cut: 'Oval Brilliant',
      },
      {
        SKU: 'GEM-9002',
        Name: 'Burmese Pigeon Blood Ruby (Manik)',
        SanskritName: 'Manikya',
        Category: 'Precious Gemstones',
        WeightCarats: 3.8,
        WeightRatti: 4.18,
        Planet: 'Sun',
        CostPrice: 800,
        SellingPrice: 1750,
        StockQuantity: 3,
        MinStock: 1,
        Origin: 'Mogok (Burma)',
        CertificationLab: 'IGI',
        CertificateNo: 'IGI-774019',
        Clarity: 'Transparent Red',
        Cut: 'Cushion Cut',
      },
      {
        SKU: 'GEM-9003',
        Name: 'Colombian Royal Emerald (Panna)',
        SanskritName: 'Marakata',
        Category: 'Precious Gemstones',
        WeightCarats: 4.5,
        WeightRatti: 4.95,
        Planet: 'Mercury',
        CostPrice: 480,
        SellingPrice: 980,
        StockQuantity: 6,
        MinStock: 2,
        Origin: 'Muzo (Colombia)',
        CertificationLab: 'GRS',
        CertificateNo: 'GRS-883012',
        Clarity: 'Eye Clean',
        Cut: 'Emerald Cut',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gemstone Inventory');
    XLSX.writeFile(wb, `AstroERP_Gemstone_Import_Template.xlsx`);
  };

  const handleLoadSample = () => {
    setFileName('Sample_Gemstones.csv');
    setRawText(sampleCsv);
    handleParseCsv(sampleCsv);
  };

  const processRowObjects = (rows: any[]) => {
    const items: Partial<InventoryItem>[] = [];

    rows.forEach((row, idx) => {
      const keys = Object.keys(row);
      const item: any = {};

      keys.forEach(k => {
        const lowerK = k.toLowerCase().replace(/[^a-z]/g, '');
        const val = row[k];
        if (val === undefined || val === null || val === '') return;

        if (lowerK.includes('sku')) item.sku = String(val).trim();
        else if (lowerK.includes('sanskrit')) item.sanskritName = String(val).trim();
        else if (lowerK.includes('name')) item.name = String(val).trim();
        else if (lowerK.includes('category')) item.category = String(val).trim();
        else if (lowerK.includes('planet')) item.associatedPlanet = String(val).trim();
        else if (lowerK.includes('ratti')) item.weightRatti = parseFloat(val) || 0;
        else if (lowerK.includes('carat') || lowerK.includes('weight')) item.weightCarats = parseFloat(val) || 0;
        else if (lowerK.includes('cost') || lowerK.includes('purchase')) item.costPrice = parseFloat(val) || 0;
        else if (lowerK.includes('selling') || lowerK.includes('price') || lowerK.includes('sale')) item.sellingPrice = parseFloat(val) || 0;
        else if (lowerK.includes('stock') || lowerK.includes('quantity') || lowerK.includes('qty')) item.stockQuantity = parseInt(val) || 1;
        else if (lowerK.includes('min') || lowerK.includes('threshold')) item.minStockThreshold = parseInt(val) || 1;
        else if (lowerK.includes('origin')) item.origin = String(val).trim();
        else if (lowerK.includes('lab') || lowerK.includes('certlab')) item.certificationLab = String(val).trim();
        else if (lowerK.includes('cert') || lowerK.includes('certno')) item.certificateNumber = String(val).trim();
        else if (lowerK.includes('clarity')) item.clarity = String(val).trim();
        else if (lowerK.includes('cut') || lowerK.includes('shape')) item.shapeCut = String(val).trim();
      });

      if (item.name) {
        if (!item.sku) item.sku = `IMP-${Math.floor(1000 + Math.random() * 9000 + idx)}`;
        if (!item.category) item.category = 'Precious Gemstones';
        if (!item.costPrice) item.costPrice = 300;
        if (!item.sellingPrice) item.sellingPrice = 750;
        if (item.stockQuantity === undefined) item.stockQuantity = 1;
        if (!item.weightCarats) item.weightCarats = 4.5;
        if (!item.weightRatti) item.weightRatti = parseFloat((item.weightCarats * 1.1).toFixed(2));
        if (!item.associatedPlanet) item.associatedPlanet = 'Jupiter';
        item.rulingPlanet = item.associatedPlanet;
        item.isCertified = true;
        if (!item.certificationLab) item.certificationLab = 'GIA';
        if (!item.certificateNumber) item.certificateNumber = `CERT-${Math.floor(100000 + Math.random() * 900000)}`;
        items.push(item);
      }
    });

    setParsedItems(items);
  };

  const handleParseCsv = (csv: string) => {
    try {
      setParseError('');
      const workbook = XLSX.read(csv, { type: 'string' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (rows.length === 0) {
        setParseError('No gemstone data rows found. Please check column format.');
        setParsedItems([]);
        return;
      }

      processRowObjects(rows);
    } catch (err: any) {
      setParseError(`Failed to parse file: ${err.message}`);
      setParsedItems([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = event => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet);
          processRowObjects(rows);
        } catch (err: any) {
          setParseError(`Excel read error: ${err.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = event => {
        const content = event.target?.result as string;
        setRawText(content);
        handleParseCsv(content);
      };
      reader.readAsText(file);
    }
  };

  const handleImportConfirm = () => {
    if (parsedItems.length === 0) return;
    onImport(parsedItems, autoGeneratePurchases);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Import Gemstone Stock via Excel (.xlsx) or CSV
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Auto-Purchase Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Bulk upload gemstone lots with automatic dealer purchase order creation and inventory ledger balancing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* File Upload / Action Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition flex items-center gap-2 shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                Upload Excel / CSV File
                <input type="file" accept=".xlsx, .xls, .csv, .tsv, .txt" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={handleDownloadExcelTemplate}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download .XLSX Template
              </button>

              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Load Sample Data
              </button>
            </div>

            {fileName && (
              <div className="text-[11px] text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                Active File: <span className="font-mono text-emerald-400 font-bold">{fileName}</span>
              </div>
            )}
          </div>

          {/* Raw Text Fallback */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span>Or Paste Tab / Comma Separated Values:</span>
              <span className="text-[10px] text-slate-500">Supports headers: SKU, Name, WeightCarats, Planet, CostPrice, SellingPrice, etc.</span>
            </label>
            <textarea
              rows={4}
              value={rawText}
              onChange={e => {
                setRawText(e.target.value);
                handleParseCsv(e.target.value);
              }}
              placeholder="Paste CSV rows here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {parseError && (
            <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Ready to Ingest ({parsedItems.length} Gemstone Lots)
                </span>
                <span className="text-[11px] text-slate-400">
                  Total Valuation: <strong className="text-emerald-400">{currencySymbol}{parsedItems.reduce((s, i) => s + ((i.sellingPrice || 0) * (i.stockQuantity || 1)), 0).toLocaleString()}</strong>
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900 text-slate-400 sticky top-0 text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5">Gemstone Variety</th>
                      <th className="p-2.5">Planet</th>
                      <th className="p-2.5">Carats (Ratti)</th>
                      <th className="p-2.5">Cost</th>
                      <th className="p-2.5">Price</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5">Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px] text-slate-300">
                    {parsedItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60">
                        <td className="p-2.5 font-mono text-indigo-400 font-semibold">{item.sku}</td>
                        <td className="p-2.5 font-medium text-white">{item.name}</td>
                        <td className="p-2.5 text-amber-400 font-semibold">{item.associatedPlanet}</td>
                        <td className="p-2.5">{item.weightCarats} ct ({item.weightRatti} R)</td>
                        <td className="p-2.5 text-slate-400">{currencySymbol}{item.costPrice}</td>
                        <td className="p-2.5 text-emerald-400 font-semibold">{currencySymbol}{item.sellingPrice}</td>
                        <td className="p-2.5 font-bold text-white">{item.stockQuantity}</td>
                        <td className="p-2.5 text-slate-400">{item.certificationLab} ({item.certificateNumber})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Zero Human Contribution Automation Checkbox */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoGeneratePurchases}
                onChange={e => setAutoGeneratePurchases(e.target.checked)}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div>
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Auto-Generate Supplier Purchase Order / Ledger Entry
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Automatically creates verified Supplier Purchase records for all imported lots and updates the accounting ledger with zero duplicate data entry.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={parsedItems.length === 0}
            onClick={handleImportConfirm}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer ${
              parsedItems.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Ingest {parsedItems.length} Gemstone Lots & Auto-Balance Purchases
          </button>
        </div>
      </div>
    </div>
  );
};
