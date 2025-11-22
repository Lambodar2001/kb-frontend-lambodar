import { useState, useEffect } from 'react';

export interface FavoriteItem {
  id: number;
  title: string;
  price: number;
  image: string;
  location: string;
}

export interface BuyerActivity {
  favorites: FavoriteItem[];
  favoritesCount: number;
  recentViews: FavoriteItem[];
  recentViewsCount: number;
  savedSearchesCount: number;
}

export const useBuyerActivity = (userId: number | null) => {
  const [activity, setActivity] = useState<BuyerActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchBuyerActivity = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual API calls
        // const favoritesRes = await api.get(`/api/v1/users/${userId}/favorites?limit=4`);
        // const viewsRes = await api.get(`/api/v1/users/${userId}/recent-views?limit=4`);
        // const searchesRes = await api.get(`/api/v1/users/${userId}/saved-searches`);

        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockItems: FavoriteItem[] = [
          {
            id: 1,
            title: 'iPhone 14 Pro Max 256GB',
            price: 85000,
            image: 'https://via.placeholder.com/100',
            location: 'Mumbai, Maharashtra',
          },
          {
            id: 2,
            title: 'Honda City 2020 VX',
            price: 950000,
            image: 'https://via.placeholder.com/100',
            location: 'Delhi, Delhi',
          },
          {
            id: 3,
            title: 'MacBook Pro M2 16GB',
            price: 150000,
            image: 'https://via.placeholder.com/100',
            location: 'Bangalore, Karnataka',
          },
        ];

        setActivity({
          favorites: mockItems,
          favoritesCount: 15,
          recentViews: mockItems,
          recentViewsCount: 28,
          savedSearchesCount: 5,
        });

        setError(null);
      } catch (err) {
        console.error('Failed to fetch buyer activity:', err);
        setError('Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerActivity();
  }, [userId]);

  return { activity, loading, error };
};
