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
    } catch (err: any) {
      // Log error in a cleaner format
      const errorMessage = err?.errorMessage || err?.message || 'Unknown error';
      console.warn('Profile fetch failed:', errorMessage);

      // Handle specific error types gracefully
      if (err?.isNetworkError) {
        setError('No internet connection. Please check your network and try again.');
      } else if (err?.isTimeout) {
        setError('Request timed out. Please try again.');
      } else if (err?.statusCode === 404 || err?.status === 404) {
        // Handle 404 gracefully - user profile may not be set up yet
        const role = roles.includes('SELLER') ? 'seller' : 'buyer';
        setError(`Your ${role} profile hasn't been set up yet. Please complete your profile setup.`);
        // Don't treat this as a critical error - set profile to null gracefully
        setProfile(null);
      } else if (err?.statusCode === 500) {
        setError('Server error. Please try again later.');
      } else if (err?.errorMessage) {
        setError(err.errorMessage);
      } else {
        setError('Failed to load profile information. Please try again.');
      }
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
