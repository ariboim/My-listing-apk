import { cleanPhoneForWA } from './formatters';

/**
 * Converts a base64 DataURL or remote image URL to a standard browser File object
 */
export async function urlToFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  const ext = blob.type.includes('png') ? 'png' : 'jpg';
  return new File([blob], `${filename}.${ext}`, { type: blob.type || 'image/jpeg' });
}

/**
 * Converts an array of image URLs (up to 5 photos) to File objects for sharing
 */
export async function preparePhotoFiles(images: string[], titlePrefix = 'listing_foto'): Promise<File[]> {
  const cleanTitle = titlePrefix.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 25);
  const filePromises = images.slice(0, 5).map((imgUrl, index) =>
    urlToFile(imgUrl, `${cleanTitle}_${index + 1}`)
  );
  return Promise.all(filePromises);
}

/**
 * Downloads an image file to the user's device
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads all property photos sequentially
 */
export async function downloadAllListingPhotos(images: string[], title: string) {
  const cleanTitle = (title || 'properti').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 25);
  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    const filename = `${cleanTitle}_foto_${i + 1}.jpg`;
    downloadImage(url, filename);
    // slight delay to prevent browser throttling downloads
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

/**
 * Copies the primary image blob to the system clipboard
 */
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) return false;
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    // Clipboard API requires image/png
    let pngBlob = blob;
    if (blob.type !== 'image/png') {
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        pngBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
      }
    }
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': pngBlob,
      }),
    ]);
    return true;
  } catch (err) {
    console.warn('Copy image to clipboard not supported or failed:', err);
    return false;
  }
}
