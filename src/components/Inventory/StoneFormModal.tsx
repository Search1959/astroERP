/**
 * Gemstone Lot Add / Edit Form Modal
 * Streamlined manual stock entry with Quick Jyotish Presets,
 * Camera Scan integration, and Auto-Purchase Generation (Zero Human Overhead).
 */

import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types';
import { X, Gem, ShieldCheck, DollarSign, Tag, Scale, Camera, Sparkles, Truck } from 'lucide-react';
import { FieldHelp } from '../Common/FieldHelp';

interface StoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stoneData: Partial<InventoryItem>, autoCreatePurchase?: boolean) => void;
  editingStone?: InventoryItem | null;
  onOpenScanner?: () => void;
  currencySymbol?: string;
}

const JYOTISH_PRESETS = [
  { name: 'Yellow Sapphire (Pukhraj)', sanskrit: 'Pushparag', planet: 'Jupiter', carats: 4.5, cost: 400, price: 850, lab: 'GIA' },
  { name: 'Blue Sapphire (Neelam)', sanskrit: 'Indraneelam', planet: 'Saturn', carats: 5.2, cost: 650, price: 1450, lab: 'IGI' },
  { name: 'Burmese Ruby (Manik)', sanskrit: 'Manikya', planet: 'Sun', carats: 3.8, cost: 550, price: 1200, lab: 'GRS' },
  { name: 'Colombian Emerald (Panna)', sanskrit: 'Marakata', planet: 'Mercury', carats: 4.2, cost: 380, price: 890, lab: 'GTL' },
  { name: 'Natural Pearl (Moti)', sanskrit: 'Mukta', planet: 'Moon', carats: 6.5, cost: 130, price: 320, lab: 'Govt Lab' },
  { name: 'Red Coral (Moonga)', sanskrit: 'Praval', planet: 'Mars', carats: 6.0, cost: 160, price: 390, lab: 'IGI' },
  { name: 'Diamond / White Zircon (Heera)', sanskrit: 'Vajra', planet: 'Venus', carats: 2.1, cost: 700, price: 1600, lab: 'GIA' },
  { name: 'Hessonite Garnet (Gomed)', sanskrit: 'Gomedaka', planet: 'Rahu', carats: 5.5, cost: 180, price: 420, lab: 'IGI' },
  { name: "Cat's Eye Chrysoberyl (Lehsunia)", sanskrit: 'Vaidurya', planet: 'Ketu', carats: 4.0, cost: 220, price: 540, lab: 'GTL' },
];

export const StoneFormModal: React.FC<StoneFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingStone = null,
  onOpenScanner,
  currencySymbol = '$',
}) => {
  if (!isOpen) return null;

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [sanskritName, setSanskritName] = useState('');
  const [category, setCategory] = useState('Precious Gemstones');
  const [associatedPlanet, setAssociatedPlanet] = useState('Jupiter');
  const [color, setColor] = useState('');
  const [weightCarats, setWeightCarats] = useState<number>(4.5);
  const [weightRatti, setWeightRatti] = useState<number>(4.95);
  const [costPrice, setCostPrice] = useState<number>(400);
  const [sellingPrice, setSellingPrice] = useState<number>(850);
  const [stockQuantity, setStockQuantity] = useState<number>(5);
  const [minStockThreshold, setMinStockThreshold] = useState<number>(2);
  const [supplier, setSupplier] = useState<string>('Ceylon & Jaipur Gem Traders Consortium');
  const [isCertified, setIsCertified] = useState<boolean>(true);
  const [certificationLab, setCertificationLab] = useState('GIA / IGI');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [origin, setOrigin] = useState('Ceylon (Sri Lanka)');
  const [clarity, setClarity] = useState('Eye Clean (VVS)');
  const [cut, setCut] = useState('Oval Brilliant');
  const [description, setDescription] = useState('');
  const [autoGeneratePurchase, setAutoGeneratePurchase] = useState<boolean>(true);

  useEffect(() => {
    if (editingStone) {
      setSku(editingStone.sku || '');
      setName(editingStone.name || '');
      setSanskritName(editingStone.sanskritName || '');
      setCategory(editingStone.category || editingStone.categoryName || 'Precious Gemstones');
      setAssociatedPlanet(editingStone.associatedPlanet || editingStone.rulingPlanet || 'Jupiter');
      setColor(editingStone.color || '');
      setWeightCarats(editingStone.weightCarats || 0);
      setWeightRatti(editingStone.weightRatti || 0);
      setCostPrice(editingStone.costPrice ?? editingStone.purchasePrice ?? 300);
      setSellingPrice(editingStone.sellingPrice ?? editingStone.salePrice ?? 650);
      setStockQuantity(editingStone.stockQuantity ?? 1);
      setMinStockThreshold(editingStone.minStockThreshold ?? 1);
      setSupplier(editingStone.supplier || 'Ceylon & Jaipur Gem Traders Consortium');
      setIsCertified(editingStone.isCertified ?? true);
      setCertificationLab(editingStone.certificationLab || 'GIA');
      setCertificateNumber(editingStone.certificateNumber || '');
      setOrigin(editingStone.origin || '');
      setClarity(editingStone.clarity || '');
      setCut(editingStone.cut || editingStone.shapeCut || '');
      setDescription(editingStone.description || editingStone.notes || '');
      setAutoGeneratePurchase(false); // don't duplicate on edit
    } else {
      const randomSku = `GEM-${Math.floor(1000 + Math.random() * 9000)}`;
      setSku(randomSku);
      setName('Natural Yellow Sapphire (Pukhraj)');
      setSanskritName('Pushparag');
      setCategory('Precious Gemstones');
      setAssociatedPlanet('Jupiter');
      setColor('Bright Golden Yellow');
      setWeightCarats(4.5);
      setWeightRatti(4.95);
      setCostPrice(400);
      setSellingPrice(850);
      setStockQuantity(5);
      setMinStockThreshold(2);
      setSupplier('Ceylon & Jaipur Gem Traders Consortium');
      setIsCertified(true);
      setCertificationLab('GIA / IGI');
      setCertificateNumber(`CERT-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrigin('Ceylon (Sri Lanka)');
      setClarity('VVS / Eye Clean');
      setCut('Oval Brilliant');
      setDescription('Unheated and untreated astrological grade gemstone.');
      setAutoGeneratePurchase(true);
    }
  }, [editingStone, isOpen]);

  const handleCaratChange = (c: number) => {
    setWeightCarats(c);
    setWeightRatti(parseFloat((c * 1.1).toFixed(2)));
  };

  const applyPreset = (preset: typeof JYOTISH_PRESETS[0]) => {
    setName(`Natural ${preset.name}`);
    setSanskritName(preset.sanskrit);
    setAssociatedPlanet(preset.planet);
    setWeightCarats(preset.carats);
    setWeightRatti(parseFloat((preset.carats * 1.1).toFixed(2)));
    setCostPrice(preset.cost);
    setSellingPrice(preset.price);
    setCertificationLab(preset.lab);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim()) return;

    onSubmit(
      {
        sku,
        name,
        sanskritName,
        category,
        categoryName: category,
        associatedPlanet,
        rulingPlanet: associatedPlanet,
        color,
        weightCarats,
        weightRatti,
        costPrice,
        purchasePrice: costPrice,
        sellingPrice,
        salePrice: sellingPrice,
        stockQuantity,
        minStockThreshold,
        supplier,
        isCertified,
        certificationLab: isCertified ? certificationLab : undefined,
        certificateNumber: isCertified ? certificateNumber : undefined,
        origin,
        clarity,
        shapeCut: cut,
        cut,
        description,
        notes: description,
      },
      !editingStone && autoGeneratePurchase
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {editingStone ? `Edit Gemstone: ${editingStone.name}` : 'Add Gemstone Stock / Lot'}
                {!editingStone && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Auto-Purchase Sync
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Single manual stock entry with automatic supplier purchase recording and inventory ledger balancing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editingStone && onOpenScanner && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenScanner();
                }}
                className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                Scan via Camera / Barcode
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Quick Jyotish Presets */}
          {!editingStone && (
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                1-Click Quick Presets (Vedic Navaratna)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {JYOTISH_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/60 rounded-lg text-[11px] text-slate-300 hover:text-white font-medium transition cursor-pointer"
                  >
                    {preset.planet}: <strong className="text-amber-400">{preset.sanskrit}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">SKU / Item Code *</label>
                <FieldHelp
                  text="Unique barcoded inventory stock-keeping unit for track and trace."
                  example="GEM-4029"
                />
              </div>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-amber-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Gemstone English Name *</label>
                <FieldHelp
                  text="Full commercial name of the mineral or gemstone."
                  example="Natural Ceylon Yellow Sapphire (Pukhraj)"
                />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Natural Ceylon Yellow Sapphire (Pukhraj)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Sanskrit / Vedic Name</label>
                <FieldHelp
                  text="Traditional Ayurvedic/Vedic Sanskrit term for prescription lookup."
                  example="Pushparag, Manikya, Neelam"
                />
              </div>
              <input
                type="text"
                value={sanskritName}
                onChange={e => setSanskritName(e.target.value)}
                placeholder="e.g. Pushparag / Neelam / Manikya"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-serif"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Category</label>
                <FieldHelp
                  text="Inventory category (Maharatna precious, Uparatna semi-precious, beads, yantras)."
                />
              </div>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              >
                <option value="Precious Gemstones">Precious Gemstones (Maharatna)</option>
                <option value="Semi-Precious Gemstones">Semi-Precious (Uparatna)</option>
                <option value="Rudraksha Beads">Rudraksha Beads</option>
                <option value="Yantras & Metal Talismans">Yantras & Metal Talismans</option>
                <option value="Ritual Consecration Items">Ritual Items</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Associated Ruling Planet (Graha)</label>
                <FieldHelp
                  text="Vedic planetary lord for automatic Jyotish recommendation matching."
                />
              </div>
              <select
                value={associatedPlanet}
                onChange={e => setAssociatedPlanet(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-semibold"
              >
                <option value="Sun">Sun (Surya) - Ruby</option>
                <option value="Moon">Moon (Chandra) - Pearl</option>
                <option value="Mars">Mars (Mangal) - Red Coral</option>
                <option value="Mercury">Mercury (Budha) - Emerald</option>
                <option value="Jupiter">Jupiter (Guru/Brihaspati) - Yellow Sapphire</option>
                <option value="Venus">Venus (Shukra) - Diamond</option>
                <option value="Saturn">Saturn (Shani) - Blue Sapphire</option>
                <option value="Rahu">Rahu (North Node) - Hessonite</option>
                <option value="Ketu">Ketu (South Node) - Cat's Eye</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  Weight in Carats (ct)
                </label>
                <FieldHelp
                  text="Metric weight in carats (1 carat = 200mg). Auto-synchronizes Vedic Ratti."
                  example="4.5"
                />
              </div>
              <input
                type="number"
                step="0.01"
                required
                value={weightCarats}
                onChange={e => handleCaratChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-indigo-400" />
                  Vedic Weight (Ratti)
                </label>
                <FieldHelp
                  text="Traditional Indian Vedic weight measure (1 Carat ≈ 1.1 Ratti standard conversion)."
                  example="4.95"
                />
              </div>
              <input
                type="number"
                step="0.01"
                value={weightRatti}
                onChange={e => setWeightRatti(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-indigo-300 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Geographic Origin</label>
                <FieldHelp
                  text="Mining origin location (e.g. Ceylon, Burma, Colombia, Kashmir)."
                  example="Ceylon (Sri Lanka)"
                />
              </div>
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                placeholder="e.g. Ceylon (Sri Lanka) / Burma / Colombia"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Dealer Cost / Unit ({currencySymbol})</label>
                <FieldHelp
                  text="Procurement cost per unit from dealer/supplier."
                />
              </div>
              <input
                type="number"
                value={costPrice}
                onChange={e => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold font-mono"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Selling Price / Unit ({currencySymbol}) *</label>
                <FieldHelp
                  text="Retail selling price per unit shown on client estimates and invoices."
                />
              </div>
              <input
                type="number"
                required
                value={sellingPrice}
                onChange={e => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-bold font-mono"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Stock Quantity (Units) *</label>
                <FieldHelp
                  text="Current available inventory quantity in your vault."
                />
              </div>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={e => setStockQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Low Stock Threshold</label>
                <FieldHelp
                  text="Minimum safety threshold before triggering a restock alert."
                />
              </div>
              <input
                type="number"
                value={minStockThreshold}
                onChange={e => setMinStockThreshold(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-rose-300 font-bold"
              />
            </div>
          </div>

          {/* Supplier Info */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              Procurement Supplier / Dealer Source
            </label>
            <input
              type="text"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
              placeholder="e.g. Ceylon & Jaipur Gem Traders Consortium"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
            />
          </div>

          {/* Certification Details */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCertifiedCheck"
                checked={isCertified}
                onChange={e => setIsCertified(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
              <label htmlFor="isCertifiedCheck" className="text-white font-semibold flex items-center gap-1.5 cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Gemological Lab Certified Natural Gemstone
              </label>
            </div>

            {isCertified && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-400">Testing Lab</label>
                  <input
                    type="text"
                    value={certificationLab}
                    onChange={e => setCertificationLab(e.target.value)}
                    placeholder="e.g. GIA, IGI, GTL, Govt Lab"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-400">Certificate / Report Number</label>
                  <input
                    type="text"
                    value={certificateNumber}
                    onChange={e => setCertificateNumber(e.target.value)}
                    placeholder="e.g. GIA-92837190"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Auto-Purchase Automation Checkbox */}
          {!editingStone && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoGeneratePurchase}
                  onChange={e => setAutoGeneratePurchase(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    ⚡ Auto-Generate Verified Supplier Purchase Record
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Automatically balance purchases ledger ({currencySymbol}{(costPrice * stockQuantity).toLocaleString()}) with zero duplicate data entry.
                  </span>
                </div>
              </label>
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
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              <Gem className="w-4 h-4" />
              {editingStone ? 'Save Gemstone Details' : 'Add to Stock & Auto-Sync Purchases'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
