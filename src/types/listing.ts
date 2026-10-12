export type ListingType = 'jual' | 'sewa';
export type ListingStatus = 'available' | 'terjual' | 'tersewa';

export interface Listing {
  id: string;
  title: string;
  area: string;          // Nama Daerah / Kawasan publik (misal: Cileungsi, Cibubur, Bogor, BSD) -> TAMPIL DI PENAWARAN
  fullAddress?: string;  // Alamat Lengkap Properti (misal: Jl. Mawar No 12 RT 01/02) -> RAHASIA AGEN, TIDAK TAMPIL DI PENAWARAN
  facilities?: string[]; // Fasilitas Properti (Kolam Renang, Keamanan 24 Jam, One Gate, dll)
  propertyType: ListingType;
  buildingArea: number; // m² (Luas Bangunan)
  landArea: number;     // m² (Luas Tanah)
  vendorPrice: number;  // Harga Vendor (IDR)
  vendorPhone: string;  // No HP Vendor
  vendorName?: string;  // Nama Vendor
  status: ListingStatus; // 'available' | 'terjual' | 'tersewa'
  images: string[];     // Max 5 images (compressed base64 data URLs)
  notes?: string;       // Catatan agen (legalitas, hadap, dll)
  agentId: string;      // Firebase Auth UID
  agentEmail?: string;  // Agent email
  priceHistory?: {
    date: string;
    oldPrice: number;
    newPrice: number;
  }[];
  createdAt: string;    // ISO string
  updatedAt: string;    // ISO string
}

export type ListingFormData = Omit<Listing, 'id' | 'agentId' | 'createdAt' | 'updatedAt' | 'priceHistory'> & {
  id?: string;
};
