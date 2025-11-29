export type SellEntityType = 'mobile' | 'laptop' | 'car' | 'bike';

export interface SellCategoryConfig {
  id: SellEntityType;
  name: string;
  emoji: string;
  accentColor: string;
  label: string;
  icon: string;
}

export const SELL_CATEGORIES: SellCategoryConfig[] = [
  {
    id: 'mobile',
    name: 'Mobile',
    emoji: '📱',
    accentColor: '#2563EB',
    label: 'Add Mobile',
    icon: 'cellphone',
  },
  {
    id: 'laptop',
    name: 'Laptop',
    emoji: '💻',
    accentColor: '#9333EA',
    label: 'Add Laptop',
    icon: 'laptop',
  },
  {
    id: 'car',
    name: 'Car',
    emoji: '🚗',
    accentColor: '#0F766E',
    label: 'Add Car',
    icon: 'car',
  },
  {
    id: 'bike',
    name: 'Bike',
    emoji: '🏍️',
    accentColor: '#DB2777',
    label: 'Add Bike',
    icon: 'motorbike',
  },
];

/**
 * Get sell category configuration by entity type ID
 */
export const getSellCategoryConfig = (id: SellEntityType): SellCategoryConfig | undefined => {
  return SELL_CATEGORIES.find(cat => cat.id === id);
};
