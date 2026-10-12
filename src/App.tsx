import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  testConnection,
} from './lib/firebase';
import { Listing, ListingFormData, ListingStatus, ListingType } from './types/listing';
import {
  subscribeAgentListings,
  createNewListing,
  updateExistingListing,
  deleteExistingListing,
} from './services/listingService';
import { INITIAL_SAMPLE_LISTINGS } from './data/mockData';
import { isFullscreen, toggleFullscreen, requestFullscreen } from './utils/fullscreen';

import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { CreateListingModal } from './components/CreateListingModal';
import { UpdateListingModal } from './components/UpdateListingModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { DeleteModal } from './components/DeleteModal';
import { ShareModal } from './components/ShareModal';
import { Building, Plus, AlertCircle, Sparkles, FilterX } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Listings State
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  // Fullscreen State
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [updatingListing, setUpdatingListing] = useState<Listing | null>(null);
  const [detailListing, setDetailListing] = useState<Listing | null>(null);
  const [sharingListing, setSharingListing] = useState<Listing | null>(null);
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Search (Keyword, Lokasi, Status, Tipe, Harga, Luas Tanah, Luas Bangunan)
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ListingStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ListingType>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minLT, setMinLT] = useState<number | ''>('');
  const [maxLT, setMaxLT] = useState<number | ''>('');
  const [minLB, setMinLB] = useState<number | ''>('');
  const [maxLB, setMaxLB] = useState<number | ''>('');

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (locationQuery.trim()) count++;
    if (minPrice !== '' || maxPrice !== '') count++;
    if (minLT !== '' || maxLT !== '') count++;
    if (minLB !== '' || maxLB !== '') count++;
    if (statusFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    return count;
  }, [locationQuery, minPrice, maxPrice, minLT, maxLT, minLB, maxLB, statusFilter, typeFilter]);

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinLT('');
    setMaxLT('');
    setMinLB('');
    setMaxLB('');
    setStatusFilter('all');
    setTypeFilter('all');
    showToast('Semua filter berhasil direset.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Track Fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenActive(isFullscreen());
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        setIsDemoUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore listings when user is authenticated or demo
  useEffect(() => {
    if (currentUser) {
      setListingsLoading(true);
      const unsubscribe = subscribeAgentListings(
        currentUser.uid,
        (fetchedListings) => {
          // If the user is brand new and has no listings, seed with initial sample listings so they see the format
          if (fetchedListings.length === 0) {
            setListings(INITIAL_SAMPLE_LISTINGS);
          } else {
            setListings(fetchedListings);
          }
          setListingsLoading(false);
        },
        (error) => {
          console.warn('Realtime sync note:', error);
          // Fallback to sample data if empty
          setListings((prev) => (prev.length > 0 ? prev : INITIAL_SAMPLE_LISTINGS));
          setListingsLoading(false);
        }
      );
      return () => unsubscribe();
    } else if (isDemoUser) {
      // Load demo data
      setListings(INITIAL_SAMPLE_LISTINGS);
      setListingsLoading(false);
    } else {
      setListings([]);
    }
  }, [currentUser, isDemoUser]);

  // Handle Google Login
  const handleLoginGoogle = async (enterFull: boolean) => {
    setLoginError(null);
    setAuthLoading(true);
    try {
      if (enterFull) {
        await requestFullscreen();
      }
      await loginWithGoogle();
      showToast('Berhasil masuk dengan akun Google!');
    } catch (err: unknown) {
      console.error('Google login failed:', err);
      // Give clear, helpful message
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('popup-closed-by-user')) {
        setLoginError('Jendela masuk ditutup. Silakan coba lagi.');
      } else if (msg.includes('cancelled-popup-request')) {
        setLoginError('Proses masuk dibatalkan.');
      } else {
        setLoginError('Tidak dapat terhubung ke Google Auth. Anda dapat menggunakan "Buka Demo Agen" untuk mencoba langsung.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Demo Login
  const handleLoginDemo = (enterFull: boolean) => {
    if (enterFull) {
      requestFullscreen();
    }
    setIsDemoUser(true);
    showToast('Masuk dalam Mode Demo Agen Aktif!');
  };

  // Handle Logout
  const handleLogout = async () => {
    if (currentUser) {
      await logoutUser();
    }
    setIsDemoUser(false);
    showToast('Telah keluar dari aplikasi.');
  };

  // Handle Toggle Fullscreen
  const handleToggleFullscreen = async () => {
    await toggleFullscreen();
  };

  // Handle Create Listing (Requirement: status MUST be 'available')
  const handleCreateListing = async (formData: ListingFormData) => {
    const activeUid = currentUser?.uid || 'demo_agent_uid';
    const activeEmail = currentUser?.email || 'agen.demo@mylisting.id';

    if (currentUser) {
      await createNewListing(formData, { uid: activeUid, email: activeEmail });
    } else {
      // Demo mode local creation
      const newListing: Listing = {
        id: 'lst_' + Date.now(),
        ...formData,
        status: 'available', // Enforced requirement
        agentId: activeUid,
        agentEmail: activeEmail,
        priceHistory: [
          {
            date: new Date().toISOString(),
            oldPrice: formData.vendorPrice,
            newPrice: formData.vendorPrice,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setListings((prev) => [newListing, ...prev]);
    }
    showToast('Listing baru berhasil ditambahkan dengan status AVAILABLE!');
  };

  // Handle Update Listing (Update harga atau status terjual / tersewa)
  const handleUpdateListing = async (
    id: string,
    updates: Partial<Listing>,
    currentListing: Listing
  ) => {
    const activeUid = currentUser?.uid || 'demo_agent_uid';

    if (currentUser) {
      await updateExistingListing(id, updates, currentListing, activeUid);
    } else {
      // Demo mode local update
      setListings((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const now = new Date().toISOString();
            const history = [...(item.priceHistory || [])];
            if (updates.vendorPrice && updates.vendorPrice !== item.vendorPrice) {
              history.push({
                date: now,
                oldPrice: item.vendorPrice,
                newPrice: updates.vendorPrice,
              });
            }
            return {
              ...item,
              ...updates,
              priceHistory: history,
              updatedAt: now,
            };
          }
          return item;
        })
      );
    }
    showToast('Listing berhasil diperbarui!');
  };

  // Handle Delete Listing
  const handleDeleteListing = async () => {
    if (!deletingListing) return;
    setIsDeleting(true);
    try {
      const activeUid = currentUser?.uid || 'demo_agent_uid';
      if (currentUser) {
        await deleteExistingListing(deletingListing.id, activeUid);
      } else {
        setListings((prev) => prev.filter((item) => item.id !== deletingListing.id));
      }
      showToast('Listing berhasil dihapus.');
      setDeletingListing(null);
    } catch (e) {
      console.error('Delete error:', e);
      showToast('Gagal menghapus listing.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and Sort Listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Search keyword (Title, contact, notes, vendor)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesPhone = item.vendorPhone?.includes(q);
        const matchesVendor = item.vendorName?.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesPhone && !matchesVendor && !matchesNotes) {
          return false;
        }
      }

      // Location / Area Search
      if (locationQuery.trim()) {
        const loc = locationQuery.toLowerCase();
        const matchesArea = item.area?.toLowerCase().includes(loc);
        const matchesLocInTitle = item.title?.toLowerCase().includes(loc);
        const matchesLocInNotes = item.notes?.toLowerCase().includes(loc);
        const matchesAddress = item.fullAddress?.toLowerCase().includes(loc);
        if (!matchesArea && !matchesLocInTitle && !matchesLocInNotes && !matchesAddress) {
          return false;
        }
      }

      // Price Range Filter
      if (minPrice !== '' && item.vendorPrice < minPrice) {
        return false;
      }
      if (maxPrice !== '' && item.vendorPrice > maxPrice) {
        return false;
      }

      // Land Area (LT) Range Filter
      if (minLT !== '' && item.landArea < minLT) {
        return false;
      }
      if (maxLT !== '' && item.landArea > maxLT) {
        return false;
      }

      // Building Area (LB) Range Filter
      if (minLB !== '' && item.buildingArea < minLB) {
        return false;
      }
      if (maxLB !== '' && item.buildingArea > maxLB) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && item.propertyType !== typeFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price-asc') {
        return a.vendorPrice - b.vendorPrice;
      }
      if (sortBy === 'price-desc') {
        return b.vendorPrice - a.vendorPrice;
      }
      if (sortBy === 'land-desc') {
        return b.landArea - a.landArea;
      }
      if (sortBy === 'building-desc') {
        return b.buildingArea - a.buildingArea;
      }
      return 0;
    });
  }, [
    listings,
    searchQuery,
    locationQuery,
    minPrice,
    maxPrice,
    minLT,
    maxLT,
    minLB,
    maxLB,
    statusFilter,
    typeFilter,
    sortBy,
  ]);

  // Show Auth Screen if not logged in and not in demo mode
  if (!currentUser && !isDemoUser) {
    return (
      <LoginScreen
        onLoginGoogle={handleLoginGoogle}
        onLoginDemo={handleLoginDemo}
        isLoading={authLoading}
        error={loginError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        userName={currentUser?.displayName || (isDemoUser ? 'Agen Demo Properti' : 'Agen Properti')}
        userEmail={currentUser?.email || (isDemoUser ? 'demo.agen@mylisting.id' : null)}
        userPhoto={currentUser?.photoURL}
        isFullscreenActive={isFullscreenActive}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Banner & Stats */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Arsip Listing Properti
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Kelola data harga vendor, luas tanah & bangunan, kontak, serta update ketersediaan unit.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center space-x-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Input Listing Baru</span>
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Bar */}
        <StatsBar listings={listings} />

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          locationQuery={locationQuery}
          onLocationChange={setLocationQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          minLT={minLT}
          onMinLTChange={setMinLT}
          maxLT={maxLT}
          onMaxLTChange={setMaxLT}
          minLB={minLB}
          onMinLBChange={setMinLB}
          maxLB={maxLB}
          onMaxLBChange={setMaxLB}
          onResetAllFilters={handleResetAllFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Listings Grid */}
        {listingsLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Memuat arsip listing properti...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <FilterX className="w-8 h-8 opacity-70" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">Tidak ada listing ditemukan</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                {searchQuery || locationQuery || activeFilterCount > 0
                  ? 'Coba atur ulang kata kunci pencarian, lokasi, atau filter rentang harga/luas untuk melihat data lain.'
                  : 'Arsip Anda masih kosong. Mulai tambahkan listing properti pertama Anda sekarang.'}
              </p>
            </div>
            {(searchQuery || locationQuery || activeFilterCount > 0) ? (
              <button
                onClick={handleResetAllFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Reset Semua Filter
              </button>
            ) : (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Tambah Listing Baru</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onOpenDetail={(item) => setDetailListing(item)}
                onOpenUpdate={(item) => setUpdatingListing(item)}
                onOpenShare={(item) => setSharingListing(item)}
                onDelete={(item) => setDeletingListing(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} <strong>My Listing</strong> • Sistem Arsip & Manajemen Properti Agen Real Estate
        </p>
      </footer>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateListingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateListing}
        />
      )}

      {updatingListing && (
        <UpdateListingModal
          listing={updatingListing}
          isOpen={true}
          onClose={() => setUpdatingListing(null)}
          onUpdate={handleUpdateListing}
        />
      )}

      {detailListing && (
        <ListingDetailModal
          listing={detailListing}
          isOpen={true}
          onClose={() => setDetailListing(null)}
          onOpenUpdate={(item) => {
            setDetailListing(null);
            setUpdatingListing(item);
          }}
          onOpenShare={(item) => {
            setDetailListing(null);
            setSharingListing(item);
          }}
        />
      )}

      {sharingListing && (
        <ShareModal
          listing={sharingListing}
          isOpen={true}
          onClose={() => setSharingListing(null)}
          agentDefaultName={currentUser?.displayName || (isDemoUser ? 'Agen Demo Properti' : 'Agen Properti')}
        />
      )}

      {deletingListing && (
        <DeleteModal
          listing={deletingListing}
          isOpen={true}
          onClose={() => setDeletingListing(null)}
          onConfirm={handleDeleteListing}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
