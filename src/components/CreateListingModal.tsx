import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Building,
  DollarSign,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  MapPin,
  Lock,
  Plus,
  Check,
} from 'lucide-react';
import { ListingFormData, ListingType } from '../types/listing';
import { compressImage } from '../utils/imageCompressor';
import { formatRupiah } from '../utils/formatters';

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

const SUGGESTED_AREAS = [
  'Cileungsi',
  'Cibubur',
  'Bogor',
  'Depok',
  'Bekasi',
  'BSD City',
  'Bintaro',
  'Kemang',
  'Jakarta Selatan',
];

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ListingFormData) => Promise<void>;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [customFacility, setCustomFacility] = useState('');

  const [propertyType, setPropertyType] = useState<ListingType>('jual');
  const [buildingArea, setBuildingArea] = useState<number | ''>('');
  const [landArea, setLandArea] = useState<number | ''>('');
  const [vendorPrice, setVendorPrice] = useState<number | ''>('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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
      setErrorMessage('Maksimal upload 5 foto per listing.');
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
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMessage('Gagal memproses gambar. Pastikan format JPG/PNG.');
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

    if (!title.trim()) {
      setErrorMessage('Silakan isi judul atau nama properti listing.');
      return;
    }
    if (!area.trim()) {
      setErrorMessage('Silakan isi nama daerah / kawasan (misal: Cileungsi, Cibubur, Bogor).');
      return;
    }
    if (!vendorPhone.trim()) {
      setErrorMessage('Silakan isi nomor HP Vendor.');
      return;
    }
    if (!vendorPrice || Number(vendorPrice) <= 0) {
      setErrorMessage('Silakan isi harga vendor yang valid.');
      return;
    }
    if (buildingArea === '' || Number(buildingArea) <= 0) {
      setErrorMessage('Silakan isi luas bangunan (m²).');
      return;
    }
    if (landArea === '' || Number(landArea) <= 0) {
      setErrorMessage('Silakan isi luas tanah (m²).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        area: area.trim(),
        fullAddress: fullAddress.trim(),
        facilities: selectedFacilities,
        propertyType,
        buildingArea: Number(buildingArea),
        landArea: Number(landArea),
        vendorPrice: Number(vendorPrice),
        vendorPhone: vendorPhone.trim(),
        vendorName: vendorName.trim(),
        status: 'available', // Enforced requirement: all new entries are "available"
        images,
        notes: notes.trim(),
      });
      // Reset form
      setTitle('');
      setArea('');
      setFullAddress('');
      setSelectedFacilities([]);
      setPropertyType('jual');
      setBuildingArea('');
      setLandArea('');
      setVendorPrice('');
      setVendorPhone('');
      setVendorName('');
      setNotes('');
      setImages([]);
      onClose();
    } catch (err: unknown) {
      console.error('Submit listing error:', err);
      setErrorMessage('Terjadi kesalahan saat menyimpan listing.');
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
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Input Arsip Listing Baru</h2>
              <p className="text-xs text-slate-400">Data listing otomatis berstatus Available</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Upload Foto Maksimal 5 Foto */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Foto Listing (Maksimal 5 Foto)</span>
              </label>
              <span className={`text-xs font-semibold ${images.length >= 5 ? 'text-amber-400' : 'text-slate-400'}`}>
                {images.length} / 5 Foto Terunggah
              </span>
            </div>

            {/* Photo Previews and Upload Box */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 group bg-slate-950">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded">
                    Foto {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Hapus Foto"
                    className="absolute top-1 right-1 p-1 rounded-md bg-rose-600/90 hover:bg-rose-600 text-white transition shadow cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="relative aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-400/60 bg-slate-950/50 hover:bg-slate-800/40 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isCompressing || images.length >= 5}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-300">
                    {isCompressing ? 'Memproses...' : '+ Tambah'}
                  </span>
                  <span className="text-[9px] text-slate-500">Maks. 5</span>
                </label>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Tips: Foto dikompresi otomatis untuk kecepatan akses di lapangan.
            </p>
          </div>

          {/* Section 2: Tipe Listing & Status Notification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status Transaksi Properti
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPropertyType('jual')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    propertyType === 'jual'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DIJUAL
                </button>
                <button
                  type="button"
                  onClick={() => setPropertyType('sewa')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    propertyType === 'sewa'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DISEWA
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status Ketersediaan
              </label>
              <div className="py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>AVAILABLE (Sesuai Ketentuan Baru)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Judul Listing */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Judul Listing Properti <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Rumah Minimalis 2 Lantai Siap Huni Cluster Aster"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70"
            />
          </div>

          {/* Section 4: NAMA DAERAH (Publik untuk Penawaran) vs ALAMAT LENGKAP (Privat Agen) */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Nama Daerah / Kawasan (Tercopy di Penawaran)</span>
                  <span className="text-amber-400">*</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Publik di Penawaran
                </span>
              </div>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Misal: Cileungsi, Cibubur, Bogor, BSD City..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
              />
              {/* Suggested Area Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 self-center mr-1">Pilihan Cepat:</span>
                {SUGGESTED_AREAS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setArea(sug)}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Alamat Lengkap Property - Rahasia Agen */}
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
                placeholder="Contoh: Jl. Rafflesia Blok C3 No. 12, RT 02/05, Desa Cileungsi Kidul (Hanya untuk arsip internal agen & survey)"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                🔒 Alamat lengkap ini dijaga ketat di arsip internal dan <strong>TIDAK AKAN PERNAH dicopy</strong> dalam teks penawaran ke pembeli.
              </p>
            </div>
          </div>

          {/* Section 5: FASILITAS PROPERTI */}
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
            <p className="text-[11px] text-slate-400">
              Pilih fasilitas yang ada pada properti untuk ditambahkan ke poin keunggulan penawaran:
            </p>

            {/* Facility Chips Selection */}
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

            {/* Custom Facility Input */}
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
                placeholder="Tambah fasilitas lain (misal: Gazebo, Roof Garden)..."
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

          {/* Section 6: Luas Bangunan & Luas Tanah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Luas Bangunan (LB) <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  value={buildingArea}
                  onChange={(e) => setBuildingArea(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Misal: 120"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70 pr-12"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  m²
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Luas Tanah (LT) <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Misal: 150"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70 pr-12"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  m²
                </span>
              </div>
            </div>
          </div>

          {/* Section 7: Harga Vendor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Harga Vendor <span className="text-amber-400">*</span>
              </label>
              {vendorPrice ? (
                <span className="text-xs font-black text-amber-300">
                  {formatRupiah(vendorPrice)}
                </span>
              ) : null}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={vendorPrice}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?!$)/, '');
                  setVendorPrice(raw === '' ? '' : Number(raw));
                }}
                placeholder="Contoh: 1500000000 (1.5 Miliar)"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70"
              />
            </div>
          </div>

          {/* Section 8: Kontak Vendor (HP & Nama) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nomor HP Vendor <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nama Vendor (Pemilik Rumah)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="Pak Budi / Ibu Siti"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70"
                />
              </div>
            </div>
          </div>

          {/* Section 9: Catatan Agen */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Catatan Spesifikasi Properti (Opsional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: SHM, Hadap Selatan, Semi furnished, Carport 2 mobil, Nego tipis"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70 resize-none"
            />
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Listing (Available)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
