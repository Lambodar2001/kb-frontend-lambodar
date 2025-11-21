import api from '@shared/api/client';

export async function deleteCar(carId: number): Promise<{ status: string; message: string }> {
  const { data } = await api.delete(`/api/v1/cars/delete/${carId}`);
  return data;
}
