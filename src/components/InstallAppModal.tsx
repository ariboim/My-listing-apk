import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Github,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Terminal,
  Layers,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant' | 'github' | 'pwabuilder'>('instant');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/ariboim/My-listing-apk';
  const currentAppUrl = window.location.href;

  const gitCommands = `# 1. Inisialisasi dan hubungkan ke repo GitHub
git init
git remote add origin https://github.com/ariboim/My-listing-apk.git

# 2. Simpan semua file aplikasi
git add .
git commit -m "Update aplikasi My Listing siap build APK"

# 3. Push ke branch main
git branch -M main
git push -u origin main`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleTriggerInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Pasang & Build APK Android
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  My Listing APK
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Repo: <span className="font-mono text-amber-300/90">{repoUrl}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('instant')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'instant'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. Pasang Langsung ke HP (Instan)</span>
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'github'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>2. Push ke GitHub & Auto APK</span>
          </button>
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pwabuilder'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>3. Download File .APK (PWABuilder)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'instant' && (
            <div className="space-y-5">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start space-x-3.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <p className="font-semibold text-amber-300 mb-1">
                    WebAPK Standalone Resmi Android
                  </p>
                  Aplikasi ini sudah mendukung standar PWA (Progressive Web App). Saat dipasang di
                  Android, sistem operasi Android otomatis membuat paket aplikasi mandiri (WebAPK)
                  lengkap dengan ikon di beranda/drawer aplikasi dan berjalan layar penuh tanpa
                  address bar!
                </div>
              </div>

              {isInstalled ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Aplikasi My Listing sudah terpasang di perangkat ini!
                  </span>
                </div>
              ) : isInstallable ? (
                <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Browser Mendukung Pemasangan Instan</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Klik tombol di samping untuk langsung memasang ke layar utama Android.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerInstall}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Pasang di HP Sekarang</span>
                  </button>
                </div>
              ) : null}

              {/* Step by Step Manual Guide */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Cara Pasang Manual di Smartphone:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Android Chrome */}
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                      <Smartphone className="w-4 h-4" />
                      <span>Android (Chrome / Browser)</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                      <li>Buka URL aplikasi ini di Chrome HP.</li>
                      <li>
                        Ketuk menu titik tiga <span className="font-bold text-white">(⋮)</span> di
                        pojok kanan atas.
                      </li>
                      <li>
                        Pilih <span className="text-amber-300 font-medium">"Install Aplikasi"</span>{' '}
                        atau{' '}
                        <span className="text-amber-300 font-medium">"Tambahkan ke Layar Utama"</span>.
                      </li>
                      <li>Aplikasi siap dibuka dari menu HP layaknya APK native!</li>
                    </ol>
                  </div>

                  {/* iOS Safari */}
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                    <div className="flex items-center space-x-2 text-blue-400 font-semibold">
                      <Smartphone className="w-4 h-4" />
                      <span>iPhone / iPad (Safari)</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                      <li>Buka aplikasi menggunakan Safari.</li>
                      <li>
                        Ketuk tombol <span className="text-blue-300 font-medium">Bagikan (Share)</span>{' '}
                        di bawah layar.
                      </li>
                      <li>
                        Gulir ke bawah dan ketuk{' '}
                        <span className="text-blue-300 font-medium">"Add to Home Screen"</span>.
                      </li>
                      <li>Ikon My Listing akan muncul di Home Screen iPhone Anda.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white font-semibold">
                    <Github className="w-4 h-4 text-amber-400" />
                    <span>Sinkronisasi ke Repo: ariboim/My-listing-apk</span>
                  </div>
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Buka Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Semua file source code project ini sudah dipersiapkan termasuk workflow otomatis
                  GitHub Actions di <code className="text-amber-300">.github/workflows/build-apk.yml</code>.
                  Jalankan perintah berikut di terminal Anda untuk menghubungkan ke GitHub:
                </p>
              </div>

              {/* Code Snippet */}
              <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs">
                <button
                  onClick={() => handleCopy(gitCommands, 'git')}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center space-x-1 text-[11px] transition cursor-pointer"
                >
                  {copiedCode === 'git' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Command</span>
                    </>
                  )}
                </button>
                <pre className="text-slate-300 whitespace-pre overflow-x-auto leading-relaxed pt-2">
                  {gitCommands}
                </pre>
              </div>

              {/* Auto APK Build info */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                <div className="font-semibold flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>GitHub Actions Siap Pakai</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  Setelah di-push ke GitHub, buka tab <strong>Actions</strong> di repo Anda. File APK
                  hasil build akan otomatis tersedia di menu <strong>Artifacts</strong> / <strong>Releases</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3 text-xs">
                <h4 className="font-semibold text-white text-sm">
                  Cara Mengunduh File .APK Menggunakan PWABuilder (1-Klik)
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  PWABuilder adalah layanan resmi Microsoft yang dapat mengonversi Progressive Web App
                  menjadi file paket instalasi <strong>.APK Android</strong> resmi yang bisa dibagikan
                  dan dipasang langsung di semua smartphone Android.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">
                      1
                    </span>
                    <span className="text-slate-200">Salin URL Aplikasi Anda saat ini:</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <input
                      type="text"
                      readOnly
                      value={currentAppUrl}
                      className="bg-transparent text-amber-300 font-mono text-xs flex-1 outline-none"
                    />
                    <button
                      onClick={() => handleCopy(currentAppUrl, 'url')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedCode === 'url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Salin</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">
                      2
                    </span>
                    <span className="text-slate-200">Buka situs PWABuilder:</span>
                  </div>
                  <a
                    href={`https://www.pwabuilder.com?site=${encodeURIComponent(currentAppUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition"
                  >
                    <span>Buka PWABuilder untuk Build APK</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">
                      3
                    </span>
                    <span className="text-slate-200">
                      Klik <strong>"Package for Stores"</strong> &rarr; pilih <strong>Android</strong> &rarr; Unduh file <strong>.APK</strong>!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Versi APK Android: 1.0.0 (Ready)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
