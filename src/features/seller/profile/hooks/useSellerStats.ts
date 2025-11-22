import { useState, useEffect } from 'react';

export interface SellerStats {
  activeAds: number;
  totalSold: number;
  totalViews: number;
  rating: number;
  totalReviews: number;
  responseRate: number;
  memberSince: string;
}

export const useSellerStats = (sellerId: number | null) => {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sellerId) {
      setLoading(false);
      return;
    }

    const fetchSellerStats = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual API call
        // const response = await api.get(`/api/v1/sellers/${sellerId}/stats`);
        // setStats(response.data);

        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 500));
        setStats({
          activeAds: 12,
          totalSold: 23,
          totalViews: 1245,
          rating: 4.5,
          totalReviews: 18,
          responseRate: 95,
          memberSince: '2023-06-15',
        });

        setError(null);
      } catch (err) {
        console.error('Failed to fetch seller stats:', err);
        setError('Failed to load seller statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerStats();
  }, [sellerId]);

  return { stats, loading, error };
};
