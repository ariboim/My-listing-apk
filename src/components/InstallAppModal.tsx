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
  ArrowRight,
  PlusSquare,
  FileDown,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant' | 'apk' | 'github'>('instant');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/ariboim/My-listing-apk';
  const directApkUrl = 'https://github.com/ariboim/My-listing-apk/releases/latest/download/app-debug.apk';
  const currentAppUrl = window.location.href;

  const gitCommands = `# 1. Inisialisasi dan hubungkan ke repo GitHub
git init
git remote add origin https://github.com/ariboim/My-listing-apk.git

# 2. Simpan semua file aplikasi (termasuk workflow publish APK)
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
              <PlusSquare className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Pilihan Install Aplikasi
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Add to Home Screen
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih metode instalasi untuk memasang My Listing di smartphone Anda
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
            <span>1. Tambahkan ke Layar Utama (Instan)</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'apk'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>2. Download File APK (.apk)</span>
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
            <span>3. GitHub Release Auto-Build</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: INSTANT ADD TO HOME SCREEN */}
          {activeTab === 'instant' && (
            <div className="space-y-5">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start space-x-3.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <p className="font-semibold text-amber-300 mb-1">
                    Instalasi Instan ke Layar Utama (PWA / WebAPK)
                  </p>
                  Aplikasi My Listing dapat langsung dipasang ke Layar Utama (Home Screen) smartphone Anda tanpa perlu unduh file besar. Aplikasi akan otomatis terbuka layar penuh (fullscreen) layaknya aplikasi native Android/iOS!
                </div>
              </div>

              {isInstalled ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300">
                  <Check className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">
                    Aplikasi My Listing sudah terpasang di Layar Utama perangkat ini!
                  </span>
                </div>
              ) : isInstallable ? (
                <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Browser Siap Pasang</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Klik tombol di samping untuk langsung menambahkan My Listing ke Layar Utama.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerInstall}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
                  >
                    <PlusSquare className="w-4 h-4 stroke-[2.5]" />
                    <span>Pasang Sekarang</span>
                  </button>
                </div>
              ) : null}

              {/* Step by Step Manual Guide */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Cara Tambah ke Layar Utama di Smartphone:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Android Chrome */}
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                      <Smartphone className="w-4 h-4" />
                      <span>Android (Chrome / Browser)</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                      <li>Buka link aplikasi ini di browser Chrome Android.</li>
                      <li>
                        Ketuk tombol menu titik tiga <span className="font-bold text-white">(⋮)</span> di pojok kanan atas.
                      </li>
                      <li>
                        Pilih menu <span className="text-amber-300 font-medium">"Install Aplikasi"</span> atau <span className="text-amber-300 font-medium">"Tambahkan ke Layar Utama"</span>.
                      </li>
                      <li>Ikon My Listing akan langsung muncul di menu & beranda HP Anda!</li>
                    </ol>
                  </div>

                  {/* iOS Safari */}
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                    <div className="flex items-center space-x-2 text-blue-400 font-semibold">
                      <Smartphone className="w-4 h-4" />
                      <span>iPhone / iPad (Safari)</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                      <li>Buka aplikasi menggunakan browser Safari.</li>
                      <li>
                        Ketuk tombol <span className="text-blue-300 font-medium">Bagikan (Share)</span> di bagian bawah layar.
                      </li>
                      <li>
                        Gulir menu ke bawah dan pilih <span className="text-blue-300 font-medium">"Add to Home Screen"</span>.
                      </li>
                      <li>Ketuk <strong>Add</strong> di pojok kanan atas, selesai!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOAD FILE APK */}
          {activeTab === 'apk' && (
            <div className="space-y-5">
              {/* Direct APK Download Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-800/50 border border-slate-700 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <FileDown className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Download File APK Android Langsung (.apk)
                      </h4>
                      <p className="text-xs text-slate-400">
                        File instalasi APK siap pasang di smartphone Android
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                    app-debug.apk
                  </span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span className="font-mono text-amber-300/90 truncate mr-2">
                    {directApkUrl}
                  </span>
                  <button
                    onClick={() => handleCopy(directApkUrl, 'direct-apk')}
                    className="shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-xs flex items-center space-x-1 cursor-pointer transition"
                  >
                    {copiedCode === 'direct-apk' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={directApkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-950/50 cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Download APK (GitHub Release)</span>
                  </a>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                  <div className="flex items-center space-x-1.5 font-semibold text-amber-300">
                    <Info className="w-4 h-4" />
                    <span>Cara Pasang File APK di Android:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Setelah file <code>app-debug.apk</code> selesai diunduh, ketuk file tersebut untuk membukanya. Jika muncul peringatan keamanan browser, pilih <strong>"Izinkan pemasangan dari sumber ini"</strong> lalu lanjutkan instalasi.
                  </p>
                </div>
              </div>

              {/* PWABuilder Alternative */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">
                    Alternatif: Generator APK 1-Klik (PWABuilder)
                  </h4>
                  <span className="text-[11px] text-slate-400">Microsoft PWA Tool</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Bisa juga menggunakan layanan PWABuilder untuk mengunduh paket APK mandiri:
                </p>
                <a
                  href={`https://www.pwabuilder.com?site=${encodeURIComponent(currentAppUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition"
                >
                  <span>Buka PWABuilder dengan URL Aplikasi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB WORKFLOW */}
          {activeTab === 'github' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white font-semibold">
                    <Github className="w-4 h-4 text-amber-400" />
                    <span>Otomasi GitHub Release: ariboim/My-listing-apk</span>
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
                  Workflow otomatis GitHub Actions di <code className="text-amber-300">.github/workflows/publish-apk.yml</code> sudah terkonfigurasi. Begitu repositori disinkronkan, GitHub Actions akan otomatis mengompilasi dan menerbitkan APK terbaru ke tab <strong>Releases</strong>.
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

              {/* Release note */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                <div className="font-semibold flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Download Otomatis Selalu Terkini</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  Link download rilis terbaru selalu aktif di: <br />
                  <span className="font-mono text-amber-300 underline break-all">
                    {directApkUrl}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Versi Aplikasi: 1.0.0 (Siap Dipasang)</span>
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
