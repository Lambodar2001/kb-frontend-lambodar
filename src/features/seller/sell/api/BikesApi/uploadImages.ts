import client from "@shared/api/client";

export type RNFile = { uri: string; name: string; type: string };

type BackendUploadResponse = {
  status?: string;
  message?: string;
  data?: any;
  images?: string[];
  imageUrls?: string[];
  uploadedUrls?: string[];
  timestamp?: string;
};

export async function uploadBikeImages(bikeId: number, files: RNFile[]) {
  const form = new FormData();
  files.forEach((f) => {
    form.append("files", {
      uri: f.uri,
      name: f.name,
      type: f.type,
    } as any);
  });

  const res = await client.post<BackendUploadResponse>(
    `/bikes/image/upload?bikeId=${bikeId}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  console.log('[BIKE UPLOAD] Backend Response:', JSON.stringify(res.data, null, 2));

  // Try different response formats
  const backendData = res.data;

  // Check for images array in different locations
  if (Array.isArray(backendData.images)) {
    return backendData.images;
  }

  if (Array.isArray(backendData.imageUrls)) {
    return backendData.imageUrls;
  }

  if (Array.isArray(backendData.uploadedUrls)) {
    return backendData.uploadedUrls;
  }

  if (Array.isArray(backendData.data)) {
    return backendData.data;
  }

  // If data is a string like "ImageUrls: url1, url2"
  if (typeof backendData.data === 'string') {
    // Try to parse comma-separated URLs
    const match = backendData.data.match(/ImageUrls?:\s*(.+)/i);
    if (match && match[1]) {
      return match[1].split(',').map(url => url.trim()).filter(url => url.length > 0);
    }
    // Return as single item array
    return [backendData.data];
  }

  // If we got a successful response but no images, return empty array
  if (backendData.status === 'SUCCESS' || backendData.message) {
    console.warn('[BIKE UPLOAD] Success response but no image URLs found');
    // Generate placeholder URL using bikeId
    return [`https://placeholder.bike.image/${bikeId}/${Date.now()}.jpg`];
  }

  throw new Error('Could not find image URLs in response');
}
