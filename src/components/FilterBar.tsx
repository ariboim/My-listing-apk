import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  MapPin,
  DollarSign,
  Maximize2,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ListingStatus, ListingType } from '../types/listing';
import { formatRupiah } from '../utils/formatters';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  locationQuery: string;
  onLocationChange: (loc: string) => void;
  statusFilter: 'all' | ListingStatus;
  onStatusFilterChange: (status: 'all' | ListingStatus) => void;
  typeFilter: 'all' | ListingType;
  onTypeFilterChange: (t: 'all' | ListingType) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  minPrice: number | '';
  onMinPriceChange: (val: number | '') => void;
  maxPrice: number | '';
  onMaxPriceChange: (val: number | '') => void;
  minLT: number | '';
  onMinLTChange: (val: number | '') => void;
  maxLT: number | '';
  onMaxLTChange: (val: number | '') => void;
  minLB: number | '';
  onMinLBChange: (val: number | '') => void;
  maxLB: number | '';
  onMaxLBChange: (val: number | '') => void;
  onResetAllFilters: () => void;
  activeFilterCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  locationQuery,
  onLocationChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  minLT,
  onMinLTChange,
  maxLT,
  onMaxLTChange,
  minLB,
  onMinLBChange,
  maxLB,
  onMaxLBChange,
  onResetAllFilters,
  activeFilterCount,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Common real estate area shortcuts
  const popularLocations = ['Cileungsi', 'Cibubur', 'Bogor', 'BSD', 'Kemang', 'Bintaro', 'PIK', 'Depok', 'Bekasi'];

  const setPriceRange = (min: number | '', max: number | '') => {
    onMinPriceChange(min);
    onMaxPriceChange(max);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-sm space-y-4">
      {/* Search Input, Location Search, Filter Toggle, and Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Main Search (Keyword / Title / Contact) */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul listing, catatan, vendor..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70 focus:ring-1 focus:ring-amber-400/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search by Location (Input Khusus Lokasi / Area) */}
        <div className="relative md:w-56">
          <MapPin className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Cari Lokasi / Area..."
            className="w-full pl-9 pr-8 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70 focus:ring-1 focus:ring-amber-400/50 transition"
          />
          {locationQuery && (
            <button
              onClick={() => onLocationChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Advanced Filter Toggler & Sort */}
        <div className="flex items-center space-x-2">
          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              isAdvancedOpen || activeFilterCount > 0
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Lanjutan</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400/70 cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga: Terendah</option>
              <option value="price-desc">Harga: Tertinggi</option>
              <option value="land-desc">LT Terbesar</option>
              <option value="building-desc">LB Terbesar</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Advanced Filter Panel (Lokasi, Harga, LT, LB) */}
      {isAdvancedOpen && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Parameter Pencarian Lanjutan</span>
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetAllFilters}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>

          {/* Location Quick Tags */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
              Pilihan Cepat Lokasi / Area Populer:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onLocationChange(locationQuery === loc ? '' : loc)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer ${
                    locationQuery.toLowerCase() === loc.toLowerCase()
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  📍 {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter (Min & Max Harga) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Rentang Harga Vendor (Rp):</span>
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <button
                  type="button"
                  onClick={() => setPriceRange('', 1000000000)}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700"
                >
                  &lt; 1 M
                </button>
                <button
                  type="button"
                  onClick={() => setPriceRange(1000000000, 3000000000)}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700"
                >
                  1 - 3 M
                </button>
                <button
                  type="button"
                  onClick={() => setPriceRange(3000000000, 5000000000)}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700"
                >
                  3 - 5 M
                </button>
                <button
                  type="button"
                  onClick={() => setPriceRange(5000000000, '')}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700"
                >
                  &gt; 5 M
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                  Min Rp
                </span>
                <input
                  type="number"
                  min="0"
                  step="50000000"
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-16 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                  Max Rp
                </span>
                <input
                  type="number"
                  min="0"
                  step="50000000"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Tidak terbatas"
                  className="w-full pl-16 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Land Area (LT) and Building Area (LB) Ranges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Luas Tanah (LT) */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Luas Tanah (LT m²):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={minLT}
                  onChange={(e) => onMinLTChange(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Min m²"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <input
                  type="number"
                  min="0"
                  value={maxLT}
                  onChange={(e) => onMaxLTChange(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Max m²"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Luas Bangunan (LB) */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Luas Bangunan (LB m²):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={minLB}
                  onChange={(e) => onMinLBChange(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Min m²"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <input
                  type="number"
                  min="0"
                  value={maxLB}
                  onChange={(e) => onMaxLBChange(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Max m²"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs (Status & Tipe) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Status Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1 hidden sm:inline">
            Status:
          </span>
          <button
            onClick={() => onStatusFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => onStatusFilterChange('available')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1 ${
              statusFilter === 'available'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/60 text-emerald-400 hover:bg-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Available</span>
          </button>
          <button
            onClick={() => onStatusFilterChange('terjual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1 ${
              statusFilter === 'terjual'
                ? 'bg-rose-500 text-white font-bold shadow-sm'
                : 'bg-slate-800/60 text-rose-400 hover:bg-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Terjual</span>
          </button>
          <button
            onClick={() => onStatusFilterChange('tersewa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1 ${
              statusFilter === 'tersewa'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/60 text-sky-400 hover:bg-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>Tersewa</span>
          </button>
        </div>

        {/* Property Type Filters (Jual / Sewa) */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1 hidden sm:inline">
            Tipe:
          </span>
          <button
            onClick={() => onTypeFilterChange('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-slate-200 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua Tipe
          </button>
          <button
            onClick={() => onTypeFilterChange('jual')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              typeFilter === 'jual'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Jual
          </button>
          <button
            onClick={() => onTypeFilterChange('sewa')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              typeFilter === 'sewa'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sewa
          </button>
        </div>
      </div>
    </div>
  );
};
