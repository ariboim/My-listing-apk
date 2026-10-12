import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Building,
  DollarSign,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Edit,
  Share2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Images,
  Lock,
} from 'lucide-react';
import { Listing } from '../types/listing';
import {
  formatRupiah,
  formatNumber,
  formatDateIndo,
  cleanPhoneForWA,
  formatPhoneDisplay,
} from '../utils/formatters';

interface ListingDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenUpdate: (listing: Listing) => void;
  onOpenShare?: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  onOpenUpdate,
  onOpenShare,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedShareText, setCopiedShareText] = useState(false);

  if (!isOpen || !listing) return null;

  const images = listing.images || [];
  const currentPhoto = images[activePhotoIndex] || null;

  const pricePerMeterLand = listing.landArea > 0 ? Math.round(listing.vendorPrice / listing.landArea) : 0;
  const pricePerMeterBuilding = listing.buildingArea > 0 ? Math.round(listing.vendorPrice / listing.buildingArea) : 0;

  // WhatsApp to Vendor
  const waPhone = cleanPhoneForWA(listing.vendorPhone);
  const waVendorText = encodeURIComponent(
    `Halo Pak/Bu ${listing.vendorName || 'Vendor'}, salam hormat. Saya agen properti terkait listing: "${listing.title}" (LB: ${listing.buildingArea}m², LT: ${listing.landArea}m² - Harga ${formatRupiah(listing.vendorPrice)}). Ingin menanyakan apakah unit ini masih available? Terima kasih.`
  );
  const waVendorUrl = `https://wa.me/${waPhone}?text=${waVendorText}`;

  // Copy Clean Specification for Buyer (strictly excludes Vendor contact & full address)
  const buyerShareText = `🏡 *FOR ${listing.propertyType.toUpperCase()}: ${listing.title}*
${listing.area ? `📍 Daerah / Kawasan: *${listing.area}*\n` : ''}
📍 *Spesifikasi Properti:*
• Luas Tanah (LT): ${listing.landArea} m²
• Luas Bangunan (LB): ${listing.buildingArea} m²
• Harga: *${formatRupiah(listing.vendorPrice)}* ${listing.propertyType === 'jual' ? '(Nego)' : '/ tahun (Nego)'}
${listing.facilities && listing.facilities.length > 0 ? `• Fasilitas: ${listing.facilities.join(', ')}\n` : ''}${listing.notes ? `• Keterangan: ${listing.notes}\n` : ''}• Status: *${listing.status.toUpperCase()}*

Untuk jadwal survey lokasi & info lengkap silakan hubungi kontak kami. Terima kasih!`;

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(buyerShareText);
      setCopiedShareText(true);
      setTimeout(() => setCopiedShareText(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 z-10">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                listing.status === 'available'
                  ? 'bg-emerald-500 text-slate-950'
                  : listing.status === 'terjual'
                  ? 'bg-rose-500 text-white'
                  : 'bg-sky-500 text-slate-950'
              }`}
            >
              {listing.status.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 uppercase">
              {listing.propertyType === 'jual' ? 'DIJUAL' : 'DISEWA'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenShare && (
              <button
                onClick={() => {
                  onClose();
                  onOpenShare(listing);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Harga Agen</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onOpenUpdate(listing);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Update Listing</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Photo Gallery Carousel (up to 5 photos) */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt={listing.title}
                  className="w-full h-full object-contain bg-slate-950"
                />
              ) : (
                <div className="text-center text-slate-500">
                  <Images className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Tidak ada foto terunggah</p>
                </div>
              )}

              {/* Navigation arrows if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActivePhotoIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-black text-white border border-slate-700 shadow-lg cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActivePhotoIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-black text-white border border-slate-700 shadow-lg cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {images.length > 0 && (
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
                  {activePhotoIndex + 1} / {images.length} Foto
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer transition ${
                      activePhotoIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title and Price */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                {listing.area && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Daerah: {listing.area}</span>
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {listing.title}
              </h1>
              <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Diarsipkan: {formatDateIndo(listing.createdAt)}</span>
                {listing.updatedAt !== listing.createdAt && (
                  <span>• Diupdate: {formatDateIndo(listing.updatedAt)}</span>
                )}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Harga Vendor
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300">
                {formatRupiah(listing.vendorPrice)}
              </div>
              <span className="text-[11px] text-slate-400">
                {listing.propertyType === 'jual' ? 'Estimasi Harga Jual' : 'Sewa per Tahun'}
              </span>
            </div>
          </div>

          {/* Alamat Lengkap (Privat Agen) Notice */}
          {listing.fullAddress && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 block uppercase tracking-wider">
                  Alamat Lengkap Properti (Privat Agen - Tidak Tercopy di Penawaran)
                </span>
                <p className="text-xs text-slate-200 mt-0.5 font-medium leading-relaxed">
                  {listing.fullAddress}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  *Hanya disimpan di arsip internal untuk jadwal survey agen.
                </p>
              </div>
            </div>
          )}

          {/* Fasilitas Properti */}
          {listing.facilities && listing.facilities.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Fasilitas Properti</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {listing.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 font-medium"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Luas Bangunan (LB)
              </span>
              <span className="text-lg font-black text-white">
                {formatNumber(listing.buildingArea)} m²
              </span>
              {pricePerMeterBuilding > 0 && (
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ~{formatRupiah(pricePerMeterBuilding)}/m² LB
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Luas Tanah (LT)
              </span>
              <span className="text-lg font-black text-white">
                {formatNumber(listing.landArea)} m²
              </span>
              {pricePerMeterLand > 0 && (
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ~{formatRupiah(pricePerMeterLand)}/m² LT
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Status Listing
              </span>
              <span className={`text-sm font-black uppercase ${
                listing.status === 'available' ? 'text-emerald-400' : 'text-slate-300'
              }`}>
                {listing.status}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {listing.status === 'available' ? 'Aktif Dipasarkan' : 'Deal Selesai'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Tipe Penawaran
              </span>
              <span className="text-lg font-black text-white uppercase">
                {listing.propertyType}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Kategori Listing
              </span>
            </div>
          </div>

          {/* Vendor Contact Box & Agent Direct Action */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Kontak Vendor Pemilik Rumah (Rahasia Agen)
              </span>
              <div className="text-base font-bold text-white">
                {listing.vendorName ? `${listing.vendorName} • ` : ''}
                {formatPhoneDisplay(listing.vendorPhone)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Gunakan kontak ini untuk update status atau negosiasi langsung ke pemilik.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={waVendorUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WA Vendor</span>
              </a>
              <a
                href={`tel:${listing.vendorPhone}`}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center space-x-1.5 transition border border-slate-700"
              >
                <Phone className="w-4 h-4" />
                <span>Telepon</span>
              </a>
            </div>
          </div>

          {/* Notes */}
          {listing.notes && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Catatan Tambahan & Legalitas
              </span>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {listing.notes}
              </p>
            </div>
          )}

          {/* Share to Buyer Tool */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Share2 className="w-4 h-4" />
                  <span>Format Pesan Penawaran ke Calon Pembeli</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Teks otomatis dirancang rapi tanpa mencantumkan kontak vendor untuk dikirim ke pembeli.
                </p>
              </div>
              <button
                onClick={handleCopyShare}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow cursor-pointer"
              >
                {copiedShareText ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Format Penawaran</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
              {buyerShareText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
