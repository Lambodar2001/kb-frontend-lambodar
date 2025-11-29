import { MyAdEntityType } from '../screens/common/types';

export interface CategoryConfig {
  id: MyAdEntityType;
  name: string;
  emoji: string;
  accentColor: string;
  label: string;
  icon: string;
}

export const MY_ADS_CATEGORIES: CategoryConfig[] = [
  {
    id: 'mobile',
    name: 'Mobiles',
    emoji: '📱',
    accentColor: '#2563EB',
    label: 'Mobile Ads',
    icon: 'cellphone',
  },
  {
    id: 'laptop',
    name: 'Laptops',
    emoji: '💻',
    accentColor: '#9333EA',
    label: 'Laptop Ads',
    icon: 'laptop',
  },
  {
    id: 'car',
    name: 'Cars',
    emoji: '🚗',
    accentColor: '#0F766E',
    label: 'Car Ads',
    icon: 'car',
  },
  {
    id: 'bike',
    name: 'Bikes',
    emoji: '🏍️',
    accentColor: '#DB2777',
    label: 'Bike Ads',
    icon: 'motorbike',
  },
];

/**
 * Get category configuration by entity type ID
 */
export const getCategoryConfig = (id: MyAdEntityType): CategoryConfig | undefined => {
  return MY_ADS_CATEGORIES.find(cat => cat.id === id);
};
