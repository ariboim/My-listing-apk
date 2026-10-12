export function formatRupiah(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9]/g, '')) : value;
  if (isNaN(num) || num === 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function cleanPhoneForWA(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length < 4) return phone;
  // format 0812-3456-7890
  return cleaned.replace(/(\d{4})(\d{4})?(\d+)?/, (_, g1, g2, g3) => {
    let res = g1;
    if (g2) res += '-' + g2;
    if (g3) res += '-' + g3;
    return res;
  });
}

export function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return dateStr;
  }
}
