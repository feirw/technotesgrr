const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.82;

export async function compressImageFile(
  file: File,
  maxDimension = DEFAULT_MAX_DIMENSION,
  quality = DEFAULT_QUALITY,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Επιτρέπονται μόνο εικόνες.');
  }

  const bitmap = await createImageBitmap(file);
  const largestSide = Math.max(bitmap.width, bitmap.height);
  const scale = largestSide > maxDimension ? maxDimension / largestSide : 1;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Δεν ήταν δυνατή η επεξεργασία της εικόνας.');
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', quality);
}

export function dataUrlByteSize(dataUrl: string): number {
  const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
  return Math.ceil((base64.length * 3) / 4);
}
