// src/core/api/cloudinaryService.ts
import { env } from '@/config/env';

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', env.storage.uploadPreset);

  const cloudName = env.storage.cloudName;
  // Endpoint resmi REST API Cloudinary
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Gagal mengunggah gambar ke Cloudinary');
    }

    const data = await response.json();
    // Mengembalikan URL aman (HTTPS) dari gambar yang berhasil diunggah
    return data.secure_url; 
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};