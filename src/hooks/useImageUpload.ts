'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { compressImage, createPreviewUrl, revokePreviewUrl } from '@/lib/compression';
import { PhotoSlotName } from '@/types';

interface UploadResult {
  url: string;
  slot: PhotoSlotName;
}

interface UseImageUploadReturn {
  upload: (file: File, slot: PhotoSlotName, listingId: string) => Promise<UploadResult>;
  uploading: boolean;
  error: string | null;
}

export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File, slot: PhotoSlotName, listingId: string): Promise<UploadResult> {
    setUploading(true);
    setError(null);

    try {
      const img = await createImageBitmap(file);
      if (img.width < 800 && img.height < 800) {
        throw new Error('Image too small. Minimum 800px on the longest side.');
      }

      const compressed = await compressImage(file);

      const filePath = `${listingId}/${slot}.webp`;
      const { error: uploadError } = await supabase.storage
        .from('car-photos')
        .upload(filePath, compressed, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('car-photos')
        .getPublicUrl(filePath);

      return { url: publicUrl, slot };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, error };
}
