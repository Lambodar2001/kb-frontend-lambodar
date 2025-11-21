import client from '@shared/api/client';

export type LaptopConfirmDetailsDTO = {
  name: string;
  phoneNumber: string;
};

type SellerByUser = {
  sellerId: number;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    mobileNumber?: number | string;
    emailVerified?: boolean;
  };
};

const toStringOrEmpty = (value: unknown): string => {
  if (value == null) return '';
  const text = String(value).trim();
  return text.length > 0 ? text : '';
};

export async function getLaptopConfirmDetailsCombined(args: {
  laptopId: number;
  userId: number;
}): Promise<LaptopConfirmDetailsDTO> {
  const { userId } = args;

  const sellerRes = await client.get<SellerByUser>(`/api/v1/sellers/${userId}`);
  const seller = sellerRes.data;

  const first = toStringOrEmpty(seller?.user?.firstName);
  const last = toStringOrEmpty(seller?.user?.lastName);
  const name = `${first} ${last}`.trim();
  const phoneNumber = toStringOrEmpty(seller?.user?.mobileNumber);

  return { name, phoneNumber };
}
