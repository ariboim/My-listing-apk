import React from 'react';
import { Home, Maximize, Minimize, Plus, LogOut, User, Smartphone, Download } from 'lucide-react';
import { isFullscreen, toggleFullscreen } from '../utils/fullscreen';

interface NavbarProps {
  userEmail?: string | null;
  userName?: string | null;
  userPhoto?: string | null;
  isFullscreenActive: boolean;
  onToggleFullscreen: () => void;
  onOpenCreateModal: () => void;
  onOpenInstallModal?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userEmail,
  userName,
  userPhoto,
  isFullscreenActive,
  onToggleFullscreen,
  onOpenCreateModal,
  onOpenInstallModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Home className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                My <span className="text-amber-400">Listing</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-full uppercase tracking-wider">
                Agen Properti
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Arsip & Manajemen Listing Real Estate
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Add to Home Screen Button */}
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              title="Tambahkan ke Layar Utama (Add to Home Screen)"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40 transition text-xs font-semibold cursor-pointer shadow-sm shadow-emerald-900/30"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Add to Home Screen</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreenActive ? 'Keluar Fullscreen (Esc)' : 'Tampilkan Full Screen'}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition text-xs font-medium cursor-pointer"
          >
            {isFullscreenActive ? (
              <>
                <Minimize className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Full Screen</span>
              </>
            )}
          </button>

          {/* New Listing Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 transition text-xs sm:text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Listing</span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center pl-2 sm:pl-3 border-l border-slate-800 space-x-2">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="Agent Avatar"
                className="w-8 h-8 rounded-full border border-amber-400/50 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>
            )}

            <div className="hidden lg:block text-left max-w-[140px] truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {userName || 'Agen Properti'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {userEmail || 'Terhubung'}
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Keluar dari Aplikasi"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
