import { useState, useEffect } from 'react';
import { fetchBuyerProfile, fetchSellerProfile, UserProfile } from '@shared/api/profileApi';
import { useAuth } from '../../../../context/AuthContext';

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const { userId, roles } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Determine if user is a seller or buyer and fetch accordingly
      const isSeller = roles.includes('SELLER');
      const isBuyer = roles.includes('BUYER');

      let userData: UserProfile | null = null;

      if (isSeller) {
        const response = await fetchSellerProfile(userId);
        userData = response.user;
      } else if (isBuyer) {
        const response = await fetchBuyerProfile(userId);
        userData = response.user;
      }

      setProfile(userData);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId, roles]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
