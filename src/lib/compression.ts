import imageCompression from 'browser-image-compression';

// Client-side image compression before upload to Supabase
// Why: Lebanese users often on slow mobile connections. A 5MB photo
// compressed to ~300KB = 15x less data, faster upload, lower storage cost.
//
// Settings tuned for cars: 80% quality preserves detail on paint, interior,
// wheels. Max 1200px wide is enough for full-screen mobile viewing.

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.4,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  initialQuality: 0.8,
  fileType: 'image/webp',
};

export async function compressImage(file: File): Promise<File> {
  if (file.size <= COMPRESSION_OPTIONS.maxSizeMB * 1024 * 1024) {
    return file;
  }
  const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
  return compressed;
}

export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
