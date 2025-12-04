import { EntityType } from '../booking/types/entity.types';

export interface EntityConfig {
  type: EntityType;
  displayName: string;
  pluralName: string;
  icon: string;
  color: string;
  browseScreen: string;
  detailScreen: string;
  primaryField: string;
  secondaryField: string;
  priceField: string;
  idField: string;
}

const ENTITY_CONFIGS: Record<EntityType, EntityConfig> = {
  mobile: {
    type: 'mobile',
    displayName: 'Mobile',
    pluralName: 'Mobiles',
    icon: '📱',
    color: '#007AFF',
    browseScreen: 'MobileListingScreen',
    detailScreen: 'MobileDetailScreen',
    primaryField: 'brand',
    secondaryField: 'model',
    priceField: 'price',
    idField: 'mobileId',
  },

  car: {
    type: 'car',
    displayName: 'Car',
    pluralName: 'Cars',
    icon: '🚗',
    color: '#FF3B30',
    browseScreen: 'CarListingScreen',
    detailScreen: 'CarDetailScreen',
    primaryField: 'brand',
    secondaryField: 'model',
    priceField: 'price',
    idField: 'carId',
  },

  laptop: {
    type: 'laptop',
    displayName: 'Laptop',
    pluralName: 'Laptops',
    icon: '💻',
    color: '#5856D6',
    browseScreen: 'LaptopListingScreen',
    detailScreen: 'LaptopDetailScreen',
    primaryField: 'brand',
    secondaryField: 'processor',
    priceField: 'price',
    idField: 'laptopId',
  },

  bike: {
    type: 'bike',
    displayName: 'Bike',
    pluralName: 'Bikes',
    icon: '🏍️',
    color: '#FF9500',
    browseScreen: 'BikeListingScreen',
    detailScreen: 'BikeDetailScreen',
    primaryField: 'brand',
    secondaryField: 'model',
    priceField: 'price',
    idField: 'bikeId',
  },
};

export class EntityRegistry {
  static getConfig(entityType: EntityType): EntityConfig {
    return ENTITY_CONFIGS[entityType];
  }

  static getAllEntityTypes(): EntityType[] {
    return Object.keys(ENTITY_CONFIGS) as EntityType[];
  }

  static isValidEntity(type: string): type is EntityType {
    return type in ENTITY_CONFIGS;
  }
}
