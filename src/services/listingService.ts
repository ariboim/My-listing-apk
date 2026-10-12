import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Listing, ListingFormData, ListingStatus } from '../types/listing';

const COLLECTION_NAME = 'listings';
const LOCAL_STORAGE_KEY = 'mylisting_agent_listings_backup';

// Local storage backup helpers for seamless reliability
function getLocalListings(agentId: string): Listing[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${agentId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalListings(agentId: string, items: Listing[]) {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${agentId}`, JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export function subscribeAgentListings(
  agentId: string,
  onSuccess: (listings: Listing[]) => void,
  onError: (error: unknown) => void
): () => void {
  const q = query(collection(db, COLLECTION_NAME), where('agentId', '==', agentId));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items: Listing[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          area: data.area || '',
          fullAddress: data.fullAddress || '',
          facilities: Array.isArray(data.facilities) ? data.facilities : [],
          propertyType: data.propertyType || 'jual',
          buildingArea: Number(data.buildingArea) || 0,
          landArea: Number(data.landArea) || 0,
          vendorPrice: Number(data.vendorPrice) || 0,
          vendorPhone: data.vendorPhone || '',
          vendorName: data.vendorName || '',
          status: (data.status as ListingStatus) || 'available',
          images: Array.isArray(data.images) ? data.images : [],
          notes: data.notes || '',
          agentId: data.agentId || agentId,
          agentEmail: data.agentEmail || '',
          priceHistory: Array.isArray(data.priceHistory) ? data.priceHistory : [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      });

      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      saveLocalListings(agentId, items);
      onSuccess(items);
    },
    (err) => {
      console.warn('Firestore snapshot error, falling back to local storage cache:', err);
      const cached = getLocalListings(agentId);
      if (cached.length > 0) {
        onSuccess(cached);
      }
      try {
        handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
      } catch (e) {
        onError(e);
      }
    }
  );

  return unsubscribe;
}

export async function createNewListing(
  data: ListingFormData,
  agent: { uid: string; email?: string | null }
): Promise<Listing> {
  const newId = 'lst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  const now = new Date().toISOString();

  // Enforce required rules: all new listings MUST have status "available"
  const newListing: Listing = {
    id: newId,
    title: data.title.trim(),
    area: data.area ? data.area.trim() : '',
    fullAddress: data.fullAddress ? data.fullAddress.trim() : '',
    facilities: Array.isArray(data.facilities) ? data.facilities : [],
    propertyType: data.propertyType,
    buildingArea: Math.max(0, Number(data.buildingArea) || 0),
    landArea: Math.max(0, Number(data.landArea) || 0),
    vendorPrice: Math.max(0, Number(data.vendorPrice) || 0),
    vendorPhone: data.vendorPhone.trim(),
    vendorName: data.vendorName ? data.vendorName.trim() : '',
    status: 'available', // Enforced requirement
    images: data.images.slice(0, 5), // Max 5 images
    notes: data.notes ? data.notes.trim() : '',
    agentId: agent.uid,
    agentEmail: agent.email || '',
    priceHistory: [
      {
        date: now,
        oldPrice: Number(data.vendorPrice) || 0,
        newPrice: Number(data.vendorPrice) || 0,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, newId);
    await setDoc(docRef, newListing);
  } catch (err) {
    console.error('Failed to save to Firestore, updating local backup:', err);
    const cached = getLocalListings(agent.uid);
    saveLocalListings(agent.uid, [newListing, ...cached]);
    handleFirestoreError(err, OperationType.CREATE, `${COLLECTION_NAME}/${newId}`);
  }

  return newListing;
}

export async function updateExistingListing(
  id: string,
  updates: Partial<Listing>,
  currentListing: Listing,
  agentId: string
): Promise<void> {
  const now = new Date().toISOString();
  const docRef = doc(db, COLLECTION_NAME, id);

  const priceHistory = [...(currentListing.priceHistory || [])];
  if (updates.vendorPrice !== undefined && updates.vendorPrice !== currentListing.vendorPrice) {
    priceHistory.push({
      date: now,
      oldPrice: currentListing.vendorPrice,
      newPrice: Number(updates.vendorPrice),
    });
  }

  const payload: Record<string, unknown> = {
    ...updates,
    priceHistory,
    updatedAt: now,
    agentId, // maintain agentId invariant
  };

  try {
    await updateDoc(docRef, payload);
  } catch (err) {
    console.error('Failed to update Firestore, syncing local cache:', err);
    const cached = getLocalListings(agentId);
    const index = cached.findIndex((item) => item.id === id);
    if (index !== -1) {
      cached[index] = { ...cached[index], ...updates, priceHistory, updatedAt: now };
      saveLocalListings(agentId, cached);
    }
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteExistingListing(id: string, agentId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete in Firestore, removing from local cache:', err);
    const cached = getLocalListings(agentId);
    saveLocalListings(agentId, cached.filter((item) => item.id !== id));
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
