/**
 * Catalog API Service
 * Provides type-safe API methods that work with any entity configuration
 */

import apiClient from '@shared/api/client';
import { EntityConfig, BaseEntity, PageResponse } from '../config/entityTypes';

export interface GetAllParams {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Generic function to fetch all entities with pagination
 */
export async function getAllEntities<T extends BaseEntity>(
  config: EntityConfig<T>,
  params?: GetAllParams
): Promise<PageResponse<T>> {
  const { page = 0, size = 20, sort = 'createdAt,DESC' } = params || {};

  const response = await apiClient.get<PageResponse<T>>(config.api.getAll, {
    params: { page, size, sort },
  });

  return response.data;
}

/**
 * Generic function to fetch a single entity by ID
 */
export async function getEntityById<T extends BaseEntity>(
  config: EntityConfig<T>,
  id: number
): Promise<T> {
  const response = await apiClient.get<T>(config.api.getById(id));
  return response.data;
}

/**
 * Helper function to extract entity ID from entity object
 */
export function getEntityId<T extends BaseEntity>(
  entity: T,
  config: EntityConfig<T>
): number {
  return entity[config.idField] as number;
}

/**
 * Helper function to extract entity title
 */
export function getEntityTitle<T extends BaseEntity>(
  entity: T,
  config: EntityConfig<T>
): string {
  return entity[config.titleField] as string;
}

/**
 * Helper function to extract entity price
 */
export function getEntityPrice<T extends BaseEntity>(
  entity: T,
  config: EntityConfig<T>
): number {
  return entity[config.priceField] as number;
}

/**
 * Helper function to extract entity images
 * Normalizes both string[] and object[] formats
 */
export function getEntityImages<T extends BaseEntity>(
  entity: T,
  config: EntityConfig<T>
): Array<{ imageId: number; imageUrl: string }> {
  const images = (entity[config.imagesField] as any) || [];

  if (!Array.isArray(images) || images.length === 0) {
    return [];
  }

  // Check if images are strings (URLs) or objects
  if (typeof images[0] === 'string') {
    // Convert string array to object array
    return images.map((url: string, index: number) => ({
      imageId: index,
      imageUrl: url,
    }));
  }

  // Already in object format
  return images;
}

/**
 * Helper function to extract entity description
 */
export function getEntityDescription<T extends BaseEntity>(
  entity: T,
  config: EntityConfig<T>
): string {
  return (entity[config.descriptionField] as string) || '';
}
