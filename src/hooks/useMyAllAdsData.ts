import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ENTITY_ORDER, myAdEntityAdapters } from '../screens/MyAds/entityAdapters';
import type { MyAdEntityType, MyAdListItem } from '../screens/MyAds/types';
import { useAuth } from '../context/AuthContext';

type EntityState = {
  items: MyAdListItem[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error?: string;
};

type EntityStateMap = Record<MyAdEntityType, EntityState>;

const FALLBACK_PAGE_SIZE = 20;

const createInitialState = (): EntityStateMap => ({
  mobile: { items: [], page: 0, hasMore: true, loading: false },
  laptop: { items: [], page: 0, hasMore: true, loading: false },
  car: { items: [], page: 0, hasMore: true, loading: false },
  bike: { items: [], page: 0, hasMore: true, loading: false },
});

export const useMyAllAdsData = () => {
  const { sellerId } = useAuth(); // Get sellerId from AuthContext
  const [entityState, setEntityState] = useState<EntityStateMap>(createInitialState);
  const entityStateRef = useRef<EntityStateMap>(entityState);
  const [hydrating, setHydrating] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const updateEntityState = useCallback(
    (updater: (current: EntityStateMap) => EntityStateMap) => {
      setEntityState((prev) => {
        const next = updater(prev);
        entityStateRef.current = next;
        return next;
      });
    },
    []
  );

  const loadEntity = useCallback(
    async (type: MyAdEntityType, options?: { reset?: boolean }) => {
      const reset = options?.reset ?? false;

      updateEntityState((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          items: reset ? [] : prev[type].items,
          page: reset ? 0 : prev[type].page,
          hasMore: reset ? true : prev[type].hasMore,
          loading: true,
          error: undefined,
        },
      }));

      const snapshot = entityStateRef.current;
      const adapter = myAdEntityAdapters[type];
      const nextPage = reset ? 0 : snapshot[type].page;
      const pageSize = adapter.pageSize ?? FALLBACK_PAGE_SIZE;

      try {
        // Pass sellerId to fetch only the logged-in seller's ads
        const result = await adapter.fetchPage(nextPage, pageSize, sellerId);
        const normalized = result.items.map(adapter.mapToListItem);

        updateEntityState((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            items: reset ? normalized : [...prev[type].items, ...normalized],
            page: nextPage + 1,
            hasMore: result.hasMore,
            loading: false,
            error: undefined,
          },
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load ads. Please try again.';

        updateEntityState((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            loading: false,
            hasMore: false,
            error: message,
          },
        }));
      }
    },
    [updateEntityState, sellerId]
  );

  const hydrateAll = useCallback(async () => {
    setHydrating(true);
    await Promise.all(ENTITY_ORDER.map((type) => loadEntity(type, { reset: true })));
    setHydrating(false);
    setInitialized(true);
  }, [loadEntity]);

  useEffect(() => {
    hydrateAll();
  }, [hydrateAll]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await hydrateAll();
    setRefreshing(false);
  }, [hydrateAll]);

  const fetchNext = useCallback(async () => {
    const snapshot = entityStateRef.current;
    const target = ENTITY_ORDER.find(
      (type) => snapshot[type].hasMore && !snapshot[type].loading
    );

    if (!target) return;
    await loadEntity(target, { reset: false });
  }, [loadEntity]);

  const items = useMemo(() => {
    return ENTITY_ORDER.flatMap((type) => entityState[type].items).sort((a, b) => {
      const timeA = typeof a.createdAt === 'number' ? a.createdAt : 0;
      const timeB = typeof b.createdAt === 'number' ? b.createdAt : 0;
      return timeB - timeA;
    });
  }, [entityState]);

  const errors = useMemo(() => {
    return ENTITY_ORDER.reduce<Partial<Record<MyAdEntityType, string>>>((acc, type) => {
      if (entityState[type].error) {
        acc[type] = entityState[type].error as string;
      }
      return acc;
    }, {});
  }, [entityState]);

  const hasMore = ENTITY_ORDER.some((type) => entityState[type].hasMore);
  const isLoadingAny = hydrating || ENTITY_ORDER.some((type) => entityState[type].loading);

  return {
    items,
    loading: isLoadingAny,
    isInitialLoading: !initialized && isLoadingAny,
    refreshing,
    hasMore,
    fetchNext,
    refresh,
    errors,
  };
};
