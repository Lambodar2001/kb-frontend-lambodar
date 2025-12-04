/**
 * Entity Configuration Types
 * Defines the structure for configuring different product entities (mobile, car, laptop, etc.)
 */

export interface EntityImage {
  imageId: number;
  imageUrl: string;
}

export interface BaseEntity {
  id: number;
  title: string;
  description?: string;
  price: number;
  negotiable?: boolean;
  condition?: string;
  status?: 'ACTIVE' | 'DRAFT' | 'SOLD';
  createdAt?: string;
  updatedAt?: string | null;
  sellerId?: number;
  images?: EntityImage[] | string[]; // Support both formats
}

export interface DetailField {
  key: string;
  label: string;
  icon?: string;
  format?: (value: any) => string;
}

export interface EntityApiConfig {
  getAll: string;
  getById: (id: number) => string;
}

export interface EntityConfig<T extends BaseEntity = BaseEntity> {
  // Entity identification
  type: string;
  displayName: string;
  displayNamePlural: string;

  // API configuration
  api: EntityApiConfig;

  // Field mappings
  idField: keyof T;
  titleField: keyof T;
  priceField: keyof T;
  imagesField: keyof T;
  descriptionField: keyof T;

  // Detail screen fields to display
  detailFields: DetailField[];

  // Navigation
  stackName: string;
  listScreenName: string;
  detailScreenName: string;

  // UI configuration
  icon: string;
  color: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable?: unknown;
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  last?: boolean;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}
