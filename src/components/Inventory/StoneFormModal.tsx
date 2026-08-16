/**
 * Gemstone Lot Add / Edit Form Modal
 */

import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types';
import { X, Gem, ShieldCheck, DollarSign, Tag, Scale } from 'lucide-react';

interface StoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stoneData: Partial<InventoryItem>) => void;
  editingStone?: InventoryItem | null;
}

export const StoneFormModal: React.FC<StoneFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingStone = null,
}) => {
  if (!isOpen) return null;

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [sanskritName, setSanskritName] = useState('');
  const [category, setCategory] = useState('Precious Gemstones');
  const [associatedPlanet, setAssociatedPlanet] = useState('Jupiter');
  const [color, setColor] = useState('');
  const [weightCarats, setWeightCarats] = useState<number>(4.5);
  const [weightRatti, setWeightRatti] = useState<number>(4.9);
  const [costPrice, setCostPrice] = useState<number>(300);
  const [sellingPrice, setSellingPrice] = useState<number>(650);
  const [stockQuantity, setStockQuantity] = useState<number>(5);
  const [minStockThreshold, setMinStockThreshold] = useState<number>(2);
  const [isCertified, setIsCertified] = useState<boolean>(true);
  const [certificationLab, setCertificationLab] = useState('GIA');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [origin, setOrigin] = useState('Ceylon (Sri Lanka)');
  const [clarity, setClarity] = useState('Eye Clean (VVS)');
  const [cut, setCut] = useState('Cushion Mixed Cut');
  const [description, setDescription] = useState('');

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
      setIsCertified(editingStone.isCertified ?? true);
      setCertificationLab(editingStone.certificationLab || 'GIA');
      setCertificateNumber(editingStone.certificateNumber || '');
      setOrigin(editingStone.origin || '');
      setClarity(editingStone.clarity || '');
      setCut(editingStone.cut || editingStone.shapeCut || '');
      setDescription(editingStone.description || editingStone.notes || '');
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
      setStockQuantity(6);
      setMinStockThreshold(2);
      setIsCertified(true);
      setCertificationLab('GIA / IGI');
      setCertificateNumber(`CERT-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrigin('Ceylon (Sri Lanka)');
      setClarity('VVS / Eye Clean');
      setCut('Oval Brilliant');
      setDescription('Unheated and untreated astrological grade gemstone.');
    }
  }, [editingStone, isOpen]);

  const handleCaratChange = (c: number) => {
    setWeightCarats(c);
    // 1 Carat = 1.1 Ratti (approx standard Vedic conversion)
    setWeightRatti(parseFloat((c * 1.1).toFixed(2)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim()) return;

    onSubmit({
      sku,
      name,
      sanskritName,
      category,
      associatedPlanet,
      color,
      weightCarats,
      weightRatti,
      costPrice,
      sellingPrice,
      stockQuantity,
      minStockThreshold,
      isCertified,
      certificationLab: isCertified ? certificationLab : undefined,
      certificateNumber: isCertified ? certificateNumber : undefined,
      origin,
      clarity,
      cut,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-400" />
            {editingStone ? `Edit Gemstone: ${editingStone.name}` : 'Add Gemstone Lot to Inventory'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">SKU / Item Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-amber-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-300">Gemstone English Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Natural Blue Sapphire"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Vedic / Sanskrit Name</label>
              <input
                type="text"
                value={sanskritName}
                onChange={e => setSanskritName(e.target.value)}
                placeholder="e.g. Neelam / Manik"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="Precious Gemstones">Precious Gemstones</option>
                <option value="Semi-Precious Gemstones">Semi-Precious Gemstones (Upratna)</option>
                <option value="Rudraksha Beads">Rudraksha Beads</option>
                <option value="Planetary Yantras">Planetary Yantras & Talismans</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Associated Astrological Planet</label>
              <select
                value={associatedPlanet}
                onChange={e => setAssociatedPlanet(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="Sun">Sun (Surya - Ruby)</option>
                <option value="Moon">Moon (Chandra - Pearl)</option>
                <option value="Mars">Mars (Mangal - Red Coral)</option>
                <option value="Mercury">Mercury (Budha - Emerald)</option>
                <option value="Jupiter">Jupiter (Guru - Yellow Sapphire)</option>
                <option value="Venus">Venus (Shukra - Diamond/Opal)</option>
                <option value="Saturn">Saturn (Shani - Blue Sapphire)</option>
                <option value="Rahu">Rahu (Hessonite Garnet)</option>
                <option value="Ketu">Ketu (Cat's Eye Chrysoberyl)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Weight (Carats)</label>
              <input
                type="number"
                step="0.01"
                value={weightCarats}
                onChange={e => handleCaratChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Weight (Ratti)</label>
              <input
                type="number"
                step="0.01"
                value={weightRatti}
                onChange={e => setWeightRatti(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Origin / Mining Region</label>
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                placeholder="e.g. Ceylon, Burma, Zambia"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Color Shade</label>
              <input
                type="text"
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="e.g. Royal Blue / Vivid Red"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Cost Price / Unit ($)</label>
              <input
                type="number"
                value={costPrice}
                onChange={e => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Selling Price / Unit ($) *</label>
              <input
                type="number"
                required
                value={sellingPrice}
                onChange={e => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-bold font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">In Stock Quantity *</label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={e => setStockQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Low Stock Alert Level</label>
              <input
                type="number"
                value={minStockThreshold}
                onChange={e => setMinStockThreshold(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-rose-300 font-bold"
              />
            </div>
          </div>

          {/* Certification Details */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCertifiedCheck"
                checked={isCertified}
                onChange={e => setIsCertified(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
              />
              <label htmlFor="isCertifiedCheck" className="text-white font-semibold flex items-center gap-1.5 cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Gemological Lab Certified Natural
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
                    placeholder="e.g. GIA, IGI, GII, Govt Lab"
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

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Stone Description / Astrological Suitability</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Treatment details, lustre quality, Vedic ritual consecration status..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

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
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg transition cursor-pointer"
            >
              {editingStone ? 'Save Stone Details' : 'Add to Vault Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
