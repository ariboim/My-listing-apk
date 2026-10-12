import React, { useState } from 'react';
import { Home, Maximize, ShieldCheck, Sparkles, CheckCircle, ArrowRight, Building, KeyRound, PhoneCall, Smartphone } from 'lucide-react';
import { requestFullscreen } from '../utils/fullscreen';

interface LoginScreenProps {
  onLoginGoogle: (requestFull: boolean) => Promise<void>;
  onLoginDemo: (requestFull: boolean) => void;
  onOpenInstallModal?: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginGoogle,
  onLoginDemo,
  onOpenInstallModal,
  isLoading,
  error,
}) => {
  const [enterInFullscreen, setEnterInFullscreen] = useState(true);

  const handleGoogleClick = async () => {
    if (enterInFullscreen) {
      await requestFullscreen();
    }
    await onLoginGoogle(enterInFullscreen);
  };

  const handleDemoClick = async () => {
    if (enterInFullscreen) {
      await requestFullscreen();
    }
    onLoginDemo(enterInFullscreen);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25">
            <Home className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              My <span className="text-amber-400">Listing</span>
            </span>
            <div className="text-[11px] font-medium text-slate-400">
              Sistem Arsip Listing Properti Agen
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition cursor-pointer"
              title="Tambahkan ke Layar Utama (Add to Home Screen)"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add to Home Screen</span>
            </button>
          )}
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Keamanan Cloud & Arsip Terenkripsi</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Login Box */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side: Value Proposition for Property Agent */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khusus Agen Real Estate & Properti Modern</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Simpan, Kelola & Arsipkan Listing Rumah Anda Dalam{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Satu Aplikasi Cepat.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
            Arsipkan hingga 5 foto per listing, catat luas bangunan, luas tanah, harga vendor,
            nomor kontak, serta pantau status <span className="text-emerald-400 font-semibold">Available</span>,{' '}
            <span className="text-rose-400 font-semibold">Terjual</span>, atau{' '}
            <span className="text-sky-400 font-semibold">Tersewa</span> secara terpusat.
          </p>

          {/* Quick Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Upload maks 5 foto per listing</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Status otomatis Available saat diinput</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Update harga & status terjual/tersewa</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Quick WhatsApp ke Vendor & Buyer</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Menu Masuk Agen</h2>
            <p className="text-xs text-slate-400">
              Masuk dengan akun Google Anda untuk membuka arsip listing
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Fullscreen Option Toggle */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition"
               onClick={() => setEnterInFullscreen(!enterInFullscreen)}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Maximize className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200">
                  Tampilkan Full Screen Saat Masuk
                </div>
                <div className="text-[11px] text-slate-400">
                  Layar penuh otomatis untuk fokus kerja agen
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enterInFullscreen}
              onChange={(e) => setEnterInFullscreen(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Login Actions */}
          <div className="space-y-3">
            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold flex items-center justify-center space-x-3 transition shadow-lg shadow-white/10 hover:shadow-white/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {/* Google Colored G Icon */}
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}</span>
            </button>

            {/* Quick Demo Mode for immediate testing if Google popup is hindered */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                Atau Mode Demo Agen
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              onClick={handleDemoClick}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-amber-300 hover:text-amber-200 border border-slate-700 font-medium flex items-center justify-center space-x-2 text-xs transition cursor-pointer"
            >
              <span>Buka Demo Agen (Langsung Akses)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-6 text-[11px] text-center text-slate-500">
            Dengan masuk, Anda menyetujui penyimpanan arsip listing properti internal agen.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 border-t border-slate-900">
        &copy; {new Date().getFullYear()} My Listing • Arsip Properti Agen Real Estate Modern
      </footer>
    </div>
  );
};
