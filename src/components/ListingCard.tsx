import React from 'react';
import {
  Building2,
  Maximize2,
  Phone,
  MessageCircle,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Images,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Share2,
  MapPin,
  Sparkle,
} from 'lucide-react';
import { Listing } from '../types/listing';
import { formatRupiah, formatNumber, cleanPhoneForWA, formatPhoneDisplay } from '../utils/formatters';

interface ListingCardProps {
  listing: Listing;
  onOpenDetail: (listing: Listing) => void;
  onOpenUpdate: (listing: Listing) => void;
  onOpenShare: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onOpenDetail,
  onOpenUpdate,
  onOpenShare,
  onDelete,
}) => {
  const isAvailable = listing.status === 'available';
  const isSold = listing.status === 'terjual';
  const isRented = listing.status === 'tersewa';

  const waPhone = cleanPhoneForWA(listing.vendorPhone);
  const waMessage = encodeURIComponent(
    `Halo Pak/Bu ${listing.vendorName || 'Vendor'}, salam hormat. Saya agen properti terkait listing: "${listing.title}" (LB: ${listing.buildingArea}m², LT: ${listing.landArea}m²). Ingin konfirmasi apakah listing ini masih tersedia atau ada calon buyer? Terima kasih.`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waMessage}`;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col group">
      {/* Top Media / Thumbnail */}
      <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(listing)}>
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950">
            <Building2 className="w-12 h-12 stroke-[1.5] mb-2 opacity-50" />
            <span className="text-xs">Belum ada foto</span>
          </div>
        )}

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          {/* Status Badge */}
          {isAvailable && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-slate-950 shadow-md backdrop-blur-sm flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
              <span>AVAILABLE</span>
            </span>
          )}
          {isSold && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600/90 text-white shadow-md backdrop-blur-sm flex items-center space-x-1">
              <span>TERJUAL</span>
            </span>
          )}
          {isRented && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/90 text-slate-950 shadow-md backdrop-blur-sm flex items-center space-x-1">
              <span>TERSEWA</span>
            </span>
          )}

          {/* Type Badge: Jual or Sewa */}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm ${
              listing.propertyType === 'jual'
                ? 'bg-amber-400/90 text-slate-950'
                : 'bg-cyan-400/90 text-slate-950'
            }`}
          >
            {listing.propertyType === 'jual' ? 'Dijual' : 'Disewa'}
          </span>
        </div>

        {/* Image count badge */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700/60 text-[11px] font-medium text-slate-300 flex items-center space-x-1 backdrop-blur-sm">
          <Images className="w-3.5 h-3.5 text-amber-400" />
          <span>{listing.images?.length || 0}/5 Foto</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
              Harga Vendor
            </span>
            {listing.priceHistory && listing.priceHistory.length > 1 && (
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                Ada riwayat harga
              </span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight text-amber-300">
            {formatRupiah(listing.vendorPrice)}
          </div>

          {/* Title and Area */}
          <div className="mt-2 space-y-1">
            {listing.area && (
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span>{listing.area}</span>
              </div>
            )}
            <h3
              onClick={() => onOpenDetail(listing)}
              className="text-base font-bold text-slate-100 hover:text-amber-400 cursor-pointer line-clamp-2 transition leading-snug"
              title={listing.title}
            >
              {listing.title}
            </h3>
          </div>

          {/* Facilities preview chips */}
          {listing.facilities && listing.facilities.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {listing.facilities.slice(0, 3).map((fac, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700/60"
                >
                  ✓ {fac}
                </span>
              ))}
              {listing.facilities.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-800/60 text-[10px] text-slate-400">
                  +{listing.facilities.length - 3} lainnya
                </span>
              )}
            </div>
          )}

          {/* Specifications (LB & LT) */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">LB:</span>
              <span className="font-bold text-slate-100">{formatNumber(listing.buildingArea)} m²</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">LT:</span>
              <span className="font-bold text-slate-100">{formatNumber(listing.landArea)} m²</span>
            </div>
          </div>

          {/* Vendor Contact Info */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="min-w-0 pr-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Kontak Vendor</div>
              <div className="font-semibold text-slate-200 truncate">
                {listing.vendorName ? `${listing.vendorName} • ` : ''}
                {formatPhoneDisplay(listing.vendorPhone)}
              </div>
            </div>

            {/* Quick Action Buttons for Vendor */}
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                title="Kirim Pesan WhatsApp ke Vendor"
                className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 transition border border-emerald-500/30"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${listing.vendorPhone}`}
                title="Telepon Vendor Langsung"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Update Listing Button (Merubah harga / status) */}
          <button
            onClick={() => onOpenUpdate(listing)}
            className="flex-1 py-2 px-2 sm:px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/20 text-xs font-semibold flex items-center justify-center space-x-1 transition cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span className="truncate">Update</span>
          </button>

          {/* Share Button (Teks penawaran harga agen) */}
          <button
            onClick={() => onOpenShare(listing)}
            title="Bagikan Penawaran dengan Harga Agen"
            className="py-2 px-2.5 sm:px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold flex items-center justify-center space-x-1 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Detail Button */}
          <button
            onClick={() => onOpenDetail(listing)}
            title="Lihat Detail & Galeri"
            className="py-2 px-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium flex items-center justify-center transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(listing)}
            title="Hapus dari arsip"
            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
