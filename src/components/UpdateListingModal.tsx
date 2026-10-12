import React, { useState, useEffect } from 'react';
import {
  X,
  Edit,
  DollarSign,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  Tag,
  Phone,
  Building,
  Upload,
  Trash2,
  MapPin,
  Lock,
  Sparkles,
  Plus,
  Check,
} from 'lucide-react';
import { Listing, ListingStatus, ListingType } from '../types/listing';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { compressImage } from '../utils/imageCompressor';

const COMMON_FACILITIES = [
  'One Gate System',
  'Keamanan 24 Jam',
  'Carport 2 Mobil',
  'Kolam Renang',
  'Club House',
  'Taman Bermain Anak',
  'Dekat Pintu Tol',
  'Dekat Stasiun KRL',
  'Dekat Mall / Sekolah',
  'Bebas Banjir',
  'Smart Home System',
  'Full Furnished',
  'Listrik 2200W+',
  'Air PDAM',
];

interface UpdateListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: string,
    updates: Partial<Listing>,
    currentListing: Listing
  ) => Promise<void>;
}

export const UpdateListingModal: React.FC<UpdateListingModalProps> = ({
  listing,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [vendorPrice, setVendorPrice] = useState<number>(listing?.vendorPrice ?? 0);
  const [status, setStatus] = useState<ListingStatus>(listing?.status ?? 'available');
  const [propertyType, setPropertyType] = useState<ListingType>(listing?.propertyType ?? 'jual');
  const [area, setArea] = useState<string>(listing?.area ?? '');
  const [fullAddress, setFullAddress] = useState<string>(listing?.fullAddress ?? '');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(listing?.facilities ?? []);
  const [customFacility, setCustomFacility] = useState<string>('');

  const [buildingArea, setBuildingArea] = useState<number>(listing?.buildingArea ?? 0);
  const [landArea, setLandArea] = useState<number>(listing?.landArea ?? 0);
  const [vendorPhone, setVendorPhone] = useState<string>(listing?.vendorPhone ?? '');
  const [vendorName, setVendorName] = useState<string>(listing?.vendorName ?? '');
  const [notes, setNotes] = useState<string>(listing?.notes ?? '');
  const [images, setImages] = useState<string[]>(listing?.images ?? []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if listing changes
  useEffect(() => {
    if (listing) {
      setVendorPrice(listing.vendorPrice);
      setStatus(listing.status);
      setPropertyType(listing.propertyType);
      setArea(listing.area || '');
      setFullAddress(listing.fullAddress || '');
      setSelectedFacilities(listing.facilities || []);
      setBuildingArea(listing.buildingArea);
      setLandArea(listing.landArea);
      setVendorPhone(listing.vendorPhone);
      setVendorName(listing.vendorName || '');
      setNotes(listing.notes || '');
      setImages(listing.images || []);
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const priceDiff = vendorPrice - listing.vendorPrice;

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleAddCustomFacility = () => {
    const trimmed = customFacility.trim();
    if (trimmed && !selectedFacilities.includes(trimmed)) {
      setSelectedFacilities((prev) => [...prev, trimmed]);
      setCustomFacility('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setErrorMessage('Maksimal 5 foto per listing.');
      return;
    }

    setErrorMessage(null);
    setIsCompressing(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (images.length + newImages.length >= 5) break;
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImage(file, 1200, 0.75);
        newImages.push(compressed);
      }
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    } catch {
      setErrorMessage('Gagal memproses gambar tambahan.');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!vendorPrice || vendorPrice <= 0) {
      setErrorMessage('Harga vendor harus lebih dari 0.');
      return;
    }
    if (!vendorPhone.trim()) {
      setErrorMessage('Nomor HP vendor tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(
        listing.id,
        {
          vendorPrice: Number(vendorPrice),
          status,
          propertyType,
          area: area.trim(),
          fullAddress: fullAddress.trim(),
          facilities: selectedFacilities,
          buildingArea: Number(buildingArea),
          landArea: Number(landArea),
          vendorPhone: vendorPhone.trim(),
          vendorName: vendorName.trim(),
          notes: notes.trim(),
          images: images.slice(0, 5),
        },
        listing
      );
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setErrorMessage('Gagal memperbarui listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Menu Update Listing</h2>
              <p className="text-xs text-slate-400 truncate max-w-sm">
                Perbarui harga atau status: {listing.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Update Status (Available, Terjual, Tersewa) */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Ubah Status Ketersediaan Listing
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Pilih status terbaru properti apakah masih tersedia, sudah laku terjual, atau tersewa.
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Available */}
              <button
                type="button"
                onClick={() => setStatus('available')}
                className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                  status === 'available'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${status === 'available' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span>AVAILABLE</span>
                <span className="text-[10px] font-normal text-slate-400">Siap Pasarkan</span>
              </button>

              {/* Terjual */}
              <button
                type="button"
                onClick={() => setStatus('terjual')}
                className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                  status === 'terjual'
                    ? 'bg-rose-500/15 border-rose-500 text-rose-400 ring-2 ring-rose-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${status === 'terjual' ? 'bg-rose-400' : 'bg-slate-600'}`} />
                <span>TERJUAL</span>
                <span className="text-[10px] font-normal text-slate-400">Sold Out</span>
              </button>

              {/* Tersewa */}
              <button
                type="button"
                onClick={() => setStatus('tersewa')}
                className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                  status === 'tersewa'
                    ? 'bg-sky-500/15 border-sky-500 text-sky-400 ring-2 ring-sky-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${status === 'tersewa' ? 'bg-sky-400' : 'bg-slate-600'}`} />
                <span>TERSEWA</span>
                <span className="text-[10px] font-normal text-slate-400">Rented Out</span>
              </button>
            </div>
          </div>

          {/* Section 2: Update Harga Vendor */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Ubah Harga Vendor</span>
              </label>
              <div className="text-xs text-slate-400">
                Harga sebelumnya: <span className="font-semibold text-slate-200">{formatRupiah(listing.vendorPrice)}</span>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={vendorPrice === 0 ? '' : vendorPrice}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?!$)/, '');
                  setVendorPrice(raw === '' ? 0 : Number(raw));
                }}
                className="w-full pl-10 pr-3.5 py-3 bg-slate-900 border border-slate-700 rounded-xl text-base font-bold text-amber-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Price change indicator */}
            {priceDiff !== 0 && (
              <div className={`p-2.5 rounded-xl text-xs flex items-center space-x-2 ${
                priceDiff < 0
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
              }`}>
                {priceDiff < 0 ? (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    <span>Turun harga sebesar: <strong>{formatRupiah(Math.abs(priceDiff))}</strong></span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>Naik harga sebesar: <strong>{formatRupiah(priceDiff)}</strong></span>
                  </>
                )}
              </div>
            )}

            {/* Price History if available */}
            {listing.priceHistory && listing.priceHistory.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Riwayat Perubahan Harga:</span>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {listing.priceHistory.map((hist, idx) => (
                    <div key={idx} className="text-[11px] flex items-center justify-between text-slate-400 bg-slate-900 px-2 py-1 rounded-lg">
                      <span>{formatDateIndo(hist.date)}</span>
                      <span className="text-slate-300 font-semibold">{formatRupiah(hist.newPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Nama Daerah (Publik) vs Alamat Lengkap (Rahasia Agen) */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Nama Daerah / Kawasan</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Tercopy di Penawaran
                </span>
              </div>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Misal: Cileungsi, Cibubur, Bogor, BSD..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Alamat Lengkap Properti (Rahasia Agen)</span>
                </label>
                <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  🔒 TIDAK Tercopy di Penawaran
                </span>
              </div>
              <textarea
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="Alamat jalan, blok, nomor rumah (arsip rahasia)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>

          {/* Section 4: Fasilitas Properti */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Fasilitas Properti</span>
              </label>
              <span className="text-[11px] text-slate-400 font-semibold">
                {selectedFacilities.length} Fasilitas Dipilih
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_FACILITIES.map((facility) => {
                const isSelected = selectedFacilities.includes(facility);
                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => toggleFacility(facility)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-bold shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{facility}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customFacility}
                onChange={(e) => setCustomFacility(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomFacility();
                  }
                }}
                placeholder="Tambah fasilitas lain..."
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddCustomFacility}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Section 5: Update Detail Lain (LB, LT, Kontak) */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Spesifikasi & Kontak Vendor
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Luas Bangunan (LB)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={buildingArea}
                    onChange={(e) => setBuildingArea(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">m²</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Luas Tanah (LT)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={landArea}
                    onChange={(e) => setLandArea(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">m²</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">No HP Vendor</label>
                <input
                  type="tel"
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Nama Vendor</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Catatan Tambahan</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 resize-none"
              />
            </div>
          </div>

          {/* Section 6: Foto Listing (maksimal 5 foto) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Kelola Foto Listing ({images.length}/5)
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-rose-600/90 hover:bg-rose-600 text-white shadow cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-400/60 bg-slate-950/50 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isCompressing || images.length >= 5}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[10px] text-slate-300">
                    {isCompressing ? '...' : '+ Tambah'}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 disabled:opacity-50 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
