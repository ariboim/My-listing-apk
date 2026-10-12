import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  DollarSign,
  Copy,
  Check,
  MessageCircle,
  TrendingUp,
  Percent,
  Sparkles,
  Home,
  CheckCircle2,
  PhoneCall,
  User,
  AlertTriangle,
  Download,
  Images,
  Send,
  ExternalLink,
  Clipboard,
  FileCheck,
} from 'lucide-react';
import { Listing } from '../types/listing';
import { formatRupiah, formatNumber, cleanPhoneForWA } from '../utils/formatters';
import {
  preparePhotoFiles,
  downloadAllListingPhotos,
  copyImageToClipboard,
} from '../utils/shareHelper';

interface ShareModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  agentDefaultName?: string | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  listing,
  isOpen,
  onClose,
  agentDefaultName,
}) => {
  const [agentPrice, setAgentPrice] = useState<number | ''>(listing?.vendorPrice ?? '');
  const [agentName, setAgentName] = useState<string>(agentDefaultName || 'Agen Properti');
  const [agentPhone, setAgentPhone] = useState<string>('');
  const [targetBuyerPhone, setTargetBuyerPhone] = useState<string>('');
  const [templateType, setTemplateType] = useState<'lengkap' | 'ringkas'>('lengkap');

  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Sync when listing opens
  useEffect(() => {
    if (listing) {
      setAgentPrice(listing.vendorPrice);
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const numericAgentPrice = typeof agentPrice === 'number' ? agentPrice : 0;
  const vendorPrice = listing.vendorPrice;
  const priceMargin = numericAgentPrice - vendorPrice;
  const marginPercentage =
    vendorPrice > 0 ? ((priceMargin / vendorPrice) * 100).toFixed(1) : '0';

  const images = listing.images || [];

  // Preset percentage/markup handlers (strictly removes leading zeros)
  const applyPreset = (type: 'same' | '2pct' | '2.5pct' | '3pct' | 'plus50m' | 'plus100m') => {
    if (!vendorPrice) return;
    if (type === 'same') {
      setAgentPrice(vendorPrice);
    } else if (type === '2pct') {
      setAgentPrice(Math.round(vendorPrice * 1.02));
    } else if (type === '2.5pct') {
      setAgentPrice(Math.round(vendorPrice * 1.025));
    } else if (type === '3pct') {
      setAgentPrice(Math.round(vendorPrice * 1.03));
    } else if (type === 'plus50m') {
      setAgentPrice(vendorPrice + 50000000);
    } else if (type === 'plus100m') {
      setAgentPrice(vendorPrice + 100000000);
    }
  };

  // Generate offer text based on agent price (Strictly excludes full address!)
  const generateOfferText = (): string => {
    const formattedAgentPrice = formatRupiah(numericAgentPrice);
    const category = listing.propertyType === 'jual' ? 'DIJUAL' : 'DISEWA';
    const priceSuffix = listing.propertyType === 'jual' ? '(Nego Halus)' : '/ tahun (Nego)';
    const areaLine = listing.area ? `📍 Daerah / Kawasan: *${listing.area}*` : '';
    const facilitiesLine =
      listing.facilities && listing.facilities.length > 0
        ? `• Fasilitas         : ${listing.facilities.join(', ')}`
        : '';

    if (templateType === 'ringkas') {
      return `🔥 *HOT LISTING ${category}* 🔥
🏡 *${listing.title}*
${areaLine ? `${areaLine}\n` : ''}
📐 *Spesifikasi:*
• LB: ${listing.buildingArea} m² | LT: ${listing.landArea} m²
• Harga Penawaran: *${formattedAgentPrice}* ${priceSuffix}
${facilitiesLine ? `${facilitiesLine}\n` : ''}${listing.notes ? `• Keterangan: ${listing.notes}\n` : ''}
📞 Info & Jadwal Survey:
${agentName ? `Hubungi ${agentName}` : 'Hubungi Kami'}${agentPhone ? ` (${agentPhone})` : ''}
_Segera jadwalkan survey sebelum unit terisi!_`;
    }

    return `✨ *PENASARAN DENGAN RUMAH IMPIAN INI?* ✨
Listing Eksklusif ${category}:
🏠 *${listing.title}*
${areaLine ? `${areaLine}\n` : ''}
📍 *Spesifikasi Utama Properti:*
• Daerah / Area       : *${listing.area || '-'}*
• Luas Tanah (LT)     : *${formatNumber(listing.landArea)} m²*
• Luas Bangunan (LB)  : *${formatNumber(listing.buildingArea)} m²*
• Harga Penawaran     : *${formattedAgentPrice}* ${priceSuffix}
• Status Unit         : *${listing.status === 'available' ? 'AVAILABLE (Siap Survey)' : listing.status.toUpperCase()}*
${facilitiesLine ? `${facilitiesLine}\n` : ''}${listing.notes ? `• Catatan Legalitas & Fitur : ${listing.notes}\n` : ''}
💡 *Keunggulan:*
- Lokasi strategis di kawasan ${listing.area || 'berkembang'}
- Dokumen legalitas aman & siap proses
- Bantuan proses KPR / negosiasi sampai tuntas

📞 *Konsultasi & Janji Survey Lokasi:*
${agentName ? `👤 ${agentName}` : '👤 Tim Properti'}${agentPhone ? `\n📱 WhatsApp / Telp: ${agentPhone}` : ''}
_Silakan hubungi untuk foto lengkap & jadwal survey!_`;
  };

  const offerText = generateOfferText();

  // Copy offer text to clipboard
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(offerText);
      setCopiedText(true);
      setShareFeedback('Teks penawaran berhasil disalin ke clipboard!');
      setTimeout(() => setCopiedText(false), 2500);
      setTimeout(() => setShareFeedback(null), 3500);
    } catch (e) {
      console.warn('Copy error:', e);
    }
  };

  // Copy primary photo to clipboard (for pasting Ctrl+V into WhatsApp Web)
  const handleCopyPhoto = async () => {
    if (!images || images.length === 0) return;
    try {
      const ok = await copyImageToClipboard(images[0]);
      if (ok) {
        setCopiedImage(true);
        setShareFeedback('Foto utama berhasil disalin! Anda bisa langsung paste (Ctrl+V) di WhatsApp.');
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        downloadAllListingPhotos([images[0]], listing.title);
        setShareFeedback('Foto telah diunduh ke perangkat Anda.');
      }
      setTimeout(() => setShareFeedback(null), 3500);
    } catch {
      setShareFeedback('Gagal menyalin foto, silakan gunakan tombol unduh foto.');
    }
  };

  // Download all listing photos
  const handleDownloadAllPhotos = async () => {
    if (!images || images.length === 0) return;
    setIsDownloading(true);
    try {
      await downloadAllListingPhotos(images, listing.title);
      setShareFeedback(`Berhasil mengunduh semua ${images.length} foto properti!`);
      setTimeout(() => setShareFeedback(null), 3500);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Comprehensive Share Handler: Shares both all photos and offer text together
  const handleShareWithPhotos = async () => {
    setIsSharing(true);
    setShareFeedback(null);

    const encodedText = encodeURIComponent(offerText);
    const targetPhoneClean = targetBuyerPhone.trim() ? cleanPhoneForWA(targetBuyerPhone.trim()) : '';

    try {
      // 1. Check if browser supports Web Share API with files
      if (images.length > 0 && navigator.canShare) {
        const photoFiles = await preparePhotoFiles(images, listing.title || 'listing');
        if (navigator.canShare({ files: photoFiles })) {
          await navigator.share({
            title: `Penawaran: ${listing.title}`,
            text: offerText,
            files: photoFiles,
          });
          setShareFeedback('Berhasil membagikan teks penawaran bersama seluruh foto!');
          setIsSharing(false);
          return;
        }
      }

      // 2. If Web Share with files is not available (e.g. desktop WhatsApp Web)
      // Automatically copy text and download photos so agent can attach them
      await navigator.clipboard.writeText(offerText);
      setCopiedText(true);

      if (images.length > 0) {
        await downloadAllListingPhotos(images, listing.title);
      }

      let waUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
      if (targetPhoneClean) {
        waUrl = `https://api.whatsapp.com/send?phone=${targetPhoneClean}&text=${encodedText}`;
      }

      setShareFeedback(
        `Teks tersalin & ${images.length} foto telah diunduh! Membuka WhatsApp...`
      );

      setTimeout(() => {
        window.open(waUrl, '_blank');
        setIsSharing(false);
      }, 700);
    } catch (err) {
      console.warn('Share error or canceled:', err);
      // Fallback: direct WhatsApp URL
      let waUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
      if (targetPhoneClean) {
        waUrl = `https://api.whatsapp.com/send?phone=${targetPhoneClean}&text=${encodedText}`;
      }
      window.open(waUrl, '_blank');
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Bagikan Penawaran Beserta Seluruh Foto
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Teks penawaran otomatis dikirim bersama {images.length} foto listing
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Notification Toast/Feedback */}
          {shareFeedback && (
            <div className="p-3.5 rounded-2xl bg-amber-400 text-slate-950 text-xs font-bold flex items-center space-x-2 animate-in fade-in duration-200">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>{shareFeedback}</span>
            </div>
          )}

          {/* Property Reference Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={listing.title}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Home className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 uppercase">
                    {listing.propertyType === 'jual' ? 'Dijual' : 'Disewa'}
                  </span>
                  {listing.area && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      📍 {listing.area}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5">{listing.title}</h3>
                <p className="text-xs text-slate-400">
                  LB: {listing.buildingArea} m² • LT: {listing.landArea} m²
                  {listing.facilities && listing.facilities.length > 0 && ` • ${listing.facilities.length} Fasilitas`}
                </p>
                {listing.fullAddress && (
                  <p className="text-[10px] text-amber-400/80 mt-1 flex items-center space-x-1">
                    <span>🔒 Alamat Privat (Disembunyikan): {listing.fullAddress}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="sm:text-right bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Harga Asli Vendor:
              </span>
              <span className="text-sm font-black text-slate-200">
                {formatRupiah(listing.vendorPrice)}
              </span>
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🛡️</span>
              <span>
                <strong>Privasi Terjamin:</strong> Alamat lengkap spesifik dirahasiakan. Yang tercantum di penawaran hanya nama daerah: <strong>"{listing.area || 'Daerah Properti'}"</strong>.
              </span>
            </div>
          </div>

          {/* Section: FOTO PROPERTI YANG DIIKUTSERTAKAN BERSAMA */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Images className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Foto Properti yang Diikutsertakan ({images.length}/5 Foto)
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ✓ Otomatis Dilampirkan
              </span>
            </div>

            {/* Photos Preview Strip */}
            {images.length > 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group">
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/80 text-[9px] text-white px-1.5 py-0.5 rounded font-bold">
                      Foto {idx + 1}
                    </span>
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                      ✓
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Belum ada foto yang diunggah untuk listing ini.</p>
            )}

            {/* Photo Action Shortcuts */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <p className="text-[11px] text-slate-400">
                Seluruh foto di atas akan diikutsertakan bersama spesifikasi saat Anda menekan tombol Bagikan.
              </p>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopyPhoto}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                  title="Salin foto ke clipboard untuk langsung di-paste di WhatsApp Web"
                >
                  {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copiedImage ? 'Foto Tersalin!' : 'Salin Foto'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadAllPhotos}
                  disabled={isDownloading || images.length === 0}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer disabled:opacity-50"
                  title="Unduh seluruh foto listing ke perangkat Anda"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isDownloading ? 'Mengunduh...' : `Unduh ${images.length} Foto`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Input Harga Agen (NO LEADING ZERO BUG!) */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Input Harga Penawaran Agen (Ke Buyer)</span>
              </label>
              <span className="text-xs font-black text-amber-400">
                {formatRupiah(numericAgentPrice)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={agentPrice === '' ? '' : agentPrice}
                onChange={(e) => {
                  // Eliminate leading zeros: 0200000000 -> 200000000
                  const raw = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?!$)/, '');
                  if (raw === '') {
                    setAgentPrice('');
                  } else {
                    setAgentPrice(Number(raw));
                  }
                }}
                placeholder="200000000"
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-base font-bold text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              *Ketik nominal angka harga agen (tanpa awalan 0). Contoh: <code>200000000</code> untuk Rp 200 Juta.
            </p>

            {/* Quick Markup Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Preset Cepat:</span>
              <button
                type="button"
                onClick={() => applyPreset('same')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Sama dg Vendor
              </button>
              <button
                type="button"
                onClick={() => applyPreset('2pct')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition cursor-pointer"
              >
                +2% Komisi
              </button>
              <button
                type="button"
                onClick={() => applyPreset('2.5pct')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition cursor-pointer"
              >
                +2.5% Komisi
              </button>
              <button
                type="button"
                onClick={() => applyPreset('3pct')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition cursor-pointer"
              >
                +3% Komisi
              </button>
              <button
                type="button"
                onClick={() => applyPreset('plus50m')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                +Rp 50 Jt
              </button>
              <button
                type="button"
                onClick={() => applyPreset('plus100m')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                +Rp 100 Jt
              </button>
            </div>

            {/* Margin / Komisi Analysis */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Selisih dari Harga Vendor:</span>
              {priceMargin > 0 ? (
                <span className="font-bold text-emerald-400 flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{formatRupiah(priceMargin)} ({marginPercentage}%)</span>
                </span>
              ) : priceMargin < 0 ? (
                <span className="font-bold text-rose-400 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Di bawah harga vendor ({formatRupiah(priceMargin)})</span>
                </span>
              ) : (
                <span className="font-bold text-slate-300">
                  Sama (Komisi langsung dari persentase vendor)
                </span>
              )}
            </div>
          </div>

          {/* Section: Kontak Agen & Pilihan Format Penawaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Agen (Untuk Footer Pesan)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Nama Agen Anda"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor Kontak Agen (Ditampilkan ke Buyer)
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx (Opsional)"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Live Preview Teks Penawaran Otomatis */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Teks Penawaran Otomatis (Live Preview)
                </span>
              </div>

              {/* Toggle Format: Lengkap vs Ringkas */}
              <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setTemplateType('lengkap')}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    templateType === 'lengkap'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lengkap
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateType('ringkas')}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    templateType === 'ringkas'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ringkas / Broadcast
                </button>
              </div>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-52 overflow-y-auto leading-relaxed">
              {offerText}
            </pre>
            <p className="text-[11px] text-slate-500">
              *Teks penawaran ini otomatis menggunakan harga agen dan <strong>TIDAK mencantumkan alamat lengkap atau kontak vendor</strong> untuk menjaga privasi agen.
            </p>
          </div>

          {/* Optional: Kirim Langsung ke WA Buyer Tertentu */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <span className="font-semibold block text-slate-200">
                Kirim Langsung ke Nomor WA Calon Buyer (Opsional):
              </span>
              <span className="text-[11px] text-slate-500">
                Kosongkan jika ingin membuka share dialog / broadcast ke status & grup WhatsApp.
              </span>
            </div>
            <input
              type="tel"
              value={targetBuyerPhone}
              onChange={(e) => setTargetBuyerPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white max-w-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Teks Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Teks Penawaran</span>
              </>
            )}
          </button>

          {/* Primary Action Button: Share to WhatsApp with All Photos */}
          <button
            type="button"
            disabled={isSharing}
            onClick={handleShareWithPhotos}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/25 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <MessageCircle className="w-4 h-4" />
            <Images className="w-4 h-4" />
            <span>
              {isSharing
                ? 'Menyiapkan Foto & Pesan...'
                : `Bagikan ke WhatsApp + Semua ${images.length} Foto`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
