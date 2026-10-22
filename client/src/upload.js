import api from './api';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

// Returns an error string, or null if the file is fine
export const validateImage = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) return `${file.name}: only JPG, PNG or WEBP allowed`;
  if (file.size > MAX_SIZE) return `${file.name}: must be under 5 MB`;
  return null;
};

export const uploadTripPhoto = (tripId, file) => {
  const data = new FormData();
  data.append('image', file);
  return api.post(`/trips/${tripId}/upload`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Sequential on purpose: parallel requests would race on the same trip document
export const uploadPhotos = async (tripId, files) => {
  let failed = 0;
  for (const file of files) {
    try {
      await uploadTripPhoto(tripId, file);
    } catch {
      failed += 1;
    }
  }
  return failed;
};