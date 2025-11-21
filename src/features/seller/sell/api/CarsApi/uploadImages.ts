import client from '@shared/api/client';

export type RNFile = { uri: string; name: string; type: string };

type UploadResponse = {
  code?: string;
  message?: string;
  images?: string[];
  data?: { images?: string[] };
};

const extractImages = (response: UploadResponse) => {
  if (Array.isArray(response.images)) {
    return response.images;
  }
  if (Array.isArray(response.data?.images)) {
    return response.data?.images;
  }
  return [];
};

export async function uploadCarImages(carId: number, files: RNFile[]) {
  const form = new FormData();
  files.forEach((file) => {
    form.append('files', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
  });

  const { data } = await client.post<UploadResponse>(
    `/api/v1/car-images/${carId}/upload`,
    form,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return extractImages(data);
}
