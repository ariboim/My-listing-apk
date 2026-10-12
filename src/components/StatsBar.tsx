import React from 'react';
import { Home, CheckCircle2, TrendingUp, DollarSign, Clock, Building } from 'lucide-react';
import { Listing } from '../types/listing';
import { formatRupiah } from '../utils/formatters';

interface StatsBarProps {
  listings: Listing[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ listings }) => {
  const totalListings = listings.length;
  const availableListings = listings.filter((l) => l.status === 'available');
  const availableJual = availableListings.filter((l) => l.propertyType === 'jual');
  const availableSewa = availableListings.filter((l) => l.propertyType === 'sewa');
  const closedDeals = listings.filter((l) => l.status === 'terjual' || l.status === 'tersewa');

  const totalPortfolioValue = availableListings.reduce((sum, item) => sum + (item.vendorPrice || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Arsip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
          <Building className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Arsip</p>
          <p className="text-xl sm:text-2xl font-black text-white">{totalListings}</p>
          <p className="text-[10px] text-slate-500 truncate">Semua listing tersimpan</p>
        </div>
      </div>

      {/* Available Jual & Sewa */}
      <div className="bg-slate-900/80 border border-emerald-900/30 rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Status Available</p>
          <p className="text-xl sm:text-2xl font-black text-white">{availableListings.length}</p>
          <p className="text-[10px] text-slate-400 truncate">
            {availableJual.length} Jual • {availableSewa.length} Sewa
          </p>
        </div>
      </div>

      {/* Terjual / Tersewa */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-purple-400 uppercase tracking-wider">Closing / Deal</p>
          <p className="text-xl sm:text-2xl font-black text-white">{closedDeals.length}</p>
          <p className="text-[10px] text-slate-400 truncate">
            {listings.filter((l) => l.status === 'terjual').length} Terjual • {listings.filter((l) => l.status === 'tersewa').length} Tersewa
          </p>
        </div>
      </div>

      {/* Nilai Portofolio Vendor */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-blue-400 uppercase tracking-wider">Nilai Listing Aktif</p>
          <p className="text-lg sm:text-xl font-black text-white truncate" title={formatRupiah(totalPortfolioValue)}>
            {formatRupiah(totalPortfolioValue)}
          </p>
          <p className="text-[10px] text-slate-400 truncate">Harga vendor akumulatif</p>
        </div>
      </div>
    </div>
  );
};
