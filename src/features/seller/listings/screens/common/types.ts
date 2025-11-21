import type { ImageSourcePropType } from 'react-native';

export type MyAdEntityType = 'mobile' | 'laptop' | 'car' | 'bike';

export type MyAdListItem<TPayload = unknown> = {
  id: string;
  entityType: MyAdEntityType;
  entityLabel: string;
  entityId: number | string;
  title: string;
  subtitle?: string;
  price: number;
  priceText: string;
  status?: string;
  badgeText: string;
  createdAt?: number | null;
  location?: string;
  thumbnail: ImageSourcePropType;
  accentColor: string;
  payload: TPayload;
};
