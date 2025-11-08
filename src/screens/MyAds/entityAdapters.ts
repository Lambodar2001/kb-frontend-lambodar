import { formatINR } from '../../utils/formatCurrency';
import { getAllMobiles, type MobileItem } from '../../api/MobilesApi/getAll';
import { getAllCars, type CarItem } from '../../api/CarsApi/getAll';
import { getAllBikes, type BikeItem } from '../../api/BikesApi/getAllBikes';
import { getAllLaptops, type LaptopItem } from '../../api/LaptopsApi/getAll';
import type { MyAdEntityType, MyAdListItem } from './types';

const MOBILE_PLACEHOLDER = require('../../assets/icons/mobile.png');
const LAPTOP_PLACEHOLDER = require('../../assets/icons/laptop.png');
const CAR_PLACEHOLDER = require('../../assets/icons/car.png');
const BIKE_PLACEHOLDER = require('../../assets/icons/bike.png');

const parseTimestamp = (value?: string | number | null): number | null => {
  if (typeof value === 'number') {
    return value;
  }
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const ensureImageSource = (uri?: string | null) => {
  if (typeof uri === 'string' && uri.trim().length > 4) {
    return { uri: uri.trim() };
  }
  return null;
};

export type FetchResult<T> = {
  items: T[];
  hasMore: boolean;
};

export type EntityAdapter<TItem> = {
  type: MyAdEntityType;
  fetchPage: (page: number, pageSize: number) => Promise<FetchResult<TItem>>;
  mapToListItem: (item: TItem) => MyAdListItem<TItem>;
  pageSize?: number;
};

export const ENTITY_ORDER: MyAdEntityType[] = ['mobile', 'car', 'bike', 'laptop'];

const DEFAULT_PAGE_SIZE = 20;

export const myAdEntityAdapters: Record<MyAdEntityType, EntityAdapter<any>> = {
  mobile: {
    type: 'mobile',
    fetchPage: async (page, pageSize) => {
      const size = pageSize || DEFAULT_PAGE_SIZE;
      const response = await getAllMobiles({
        page,
        size,
        sort: 'createdAt,DESC',
      });
      return {
        items: response.content ?? [],
        hasMore: response.last === false,
      };
    },
    mapToListItem: (item: MobileItem): MyAdListItem<MobileItem> => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const imageSource =
        ensureImageSource(item.images?.[0]) ?? MOBILE_PLACEHOLDER;
      const createdAt =
        parseTimestamp(item.createdAt) ??
        parseTimestamp(item.updatedAt) ??
        (typeof item.mobileId === 'number' ? item.mobileId : null);

      return {
        id: `mobile-${item.mobileId}`,
        entityType: 'mobile',
        entityLabel: 'Mobile',
        entityId: item.mobileId,
        title: item.title || 'Untitled Mobile',
        subtitle: [item.brand, item.model, item.yearOfPurchase]
          .filter(Boolean)
          .join(' | '),
        price,
        priceText: formatINR(price),
        status: item.status,
        badgeText: item.status === 'ACTIVE' ? 'Live' : item.status ?? 'Info',
        createdAt,
        location: undefined,
        thumbnail: imageSource,
        accentColor: '#2563EB',
        payload: item,
      };
    },
  },
  car: {
    type: 'car',
    fetchPage: async (page, pageSize) => {
      const size = pageSize || DEFAULT_PAGE_SIZE;
      const response = await getAllCars({
        page,
        size,
        sort: 'createdAt,DESC',
      });
      return {
        items: response.content ?? [],
        hasMore: response.last === false,
      };
    },
    mapToListItem: (item: CarItem): MyAdListItem<CarItem> => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const imageSource =
        ensureImageSource(item.images?.[0]) ?? CAR_PLACEHOLDER;
      const createdAt =
        parseTimestamp(item.createdAt) ??
        parseTimestamp(item.updatedAt) ??
        (typeof item.carId === 'number' ? item.carId : null);
      const location = [item.city, item.state].filter(Boolean).join(', ') || undefined;

      return {
        id: `car-${item.carId}`,
        entityType: 'car',
        entityLabel: 'Car',
        entityId: item.carId,
        title: item.title || [item.brand, item.model].filter(Boolean).join(' ') || 'Untitled Car',
        subtitle: [item.variant, item.yearOfPurchase].filter(Boolean).join(' | '),
        price,
        priceText: formatINR(price),
        status: item.status,
        badgeText: item.status === 'ACTIVE' ? 'Live' : item.status ?? 'Info',
        createdAt,
        location,
        thumbnail: imageSource,
        accentColor: '#0F766E',
        payload: item,
      };
    },
  },
  bike: {
    type: 'bike',
    fetchPage: async (page) => {
      // Bike API currently returns the full list, so fetch once.
      if (page > 0) {
        return { items: [], hasMore: false };
      }
      const response = await getAllBikes();
      return {
        items: response.content ?? [],
        hasMore: false,
      };
    },
    mapToListItem: (item: BikeItem): MyAdListItem<BikeItem> => {
      const price = typeof item.prize === 'number' ? item.prize : 0;
      const firstImage = item.images?.[0];
      const imageSource =
        ensureImageSource(firstImage?.image_link) ?? BIKE_PLACEHOLDER;
      const createdAt =
        parseTimestamp(item.createdAt) ??
        (typeof item.bike_id === 'number' ? item.bike_id : null);

      return {
        id: `bike-${item.bike_id}`,
        entityType: 'bike',
        entityLabel: 'Bike',
        entityId: item.bike_id,
        title: [item.brand, item.model].filter(Boolean).join(' ') || 'Untitled Bike',
        subtitle: [item.variant, item.manufactureYear].filter(Boolean).join(' | '),
        price,
        priceText: formatINR(price),
        status: item.status,
        badgeText: item.status === 'ACTIVE' ? 'Live' : item.status ?? 'Info',
        createdAt,
        location: undefined,
        thumbnail: imageSource,
        accentColor: '#DB2777',
        payload: item,
      };
    },
  },
  laptop: {
    type: 'laptop',
    fetchPage: async (page) => {
      if (page > 0) {
        return { items: [], hasMore: false };
      }
      const items = await getAllLaptops();
      return {
        items,
        hasMore: false,
      };
    },
    mapToListItem: (item: LaptopItem): MyAdListItem<LaptopItem> => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const photo = item.laptopPhotos?.[0];
      const resolvedPhoto =
        ensureImageSource(
          (photo as any)?.photo_link ?? (photo as any)?.photoLink ?? null
        ) ?? LAPTOP_PLACEHOLDER;
      const createdAt =
        parseTimestamp((item as any).createdAt) ??
        (typeof item.id === 'number' ? item.id : null);

      return {
        id: `laptop-${item.id}`,
        entityType: 'laptop',
        entityLabel: 'Laptop',
        entityId: item.id,
        title: [item.brand, item.model].filter(Boolean).join(' ') || `Laptop #${item.id}`,
        subtitle: [item.processor, item.ram].filter(Boolean).join(' | '),
        price,
        priceText: formatINR(price),
        status: item.status,
        badgeText: item.status === 'ACTIVE' ? 'Live' : (item.status as string) ?? 'Info',
        createdAt,
        location: item.dealer,
        thumbnail: resolvedPhoto,
        accentColor: '#9333EA',
        payload: item,
      };
    },
  },
};
