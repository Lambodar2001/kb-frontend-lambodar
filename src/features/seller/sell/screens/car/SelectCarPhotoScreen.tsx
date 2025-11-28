// src/screens/CarScreens/SelectCarPhotoScreen.tsx
import React from 'react';
import { Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';

import PhotoUploadLayout, {
  PhotoUploadProgressState,
} from '../../components/photoUpload/PhotoUploadLayout';
import { useSafeAsyncState } from '@shared/hooks';
import { SellCarStackParamList } from '../../navigation/SellCarStack';
import { ensureOverlayReady } from '@shared/utils';
import { uploadCarImages } from '@features/seller/sell/api/CarsApi/uploadImages';

type SelectPhotoNavProp = NativeStackNavigationProp<SellCarStackParamList, 'SelectPhoto'>;
type RouteProps = RouteProp<SellCarStackParamList, 'SelectPhoto'>;

const PROGRESS_HINT = 'Please wait...';
const MAX_PHOTOS = 10;

const SelectCarPhotoScreen: React.FC = () => {
  const navigation = useNavigation<SelectPhotoNavProp>();
  const route = useRoute<RouteProps>();
  const { carId } = route.params;

  const [uploading, setUploading] = useSafeAsyncState(false);
  const [uploadProgress, setUploadProgress] = useSafeAsyncState<PhotoUploadProgressState | null>(
    null,
  );

  // Validate carId on mount
  React.useEffect(() => {
    if (!carId) {
      Alert.alert('Error', 'Missing car ID. Please go back and try again.', [
        { text: 'Go Back', onPress: () => navigation.goBack() },
      ]);
    }
  }, [carId, navigation]);

  const uploadFromAssets = async (assets: Asset[]) => {
    if (uploading) return;

    if (!carId) {
      Alert.alert('Error', 'Missing car id');
      return;
    }

    // Filter out videos and keep only images
    const validAssets = (assets || []).filter((asset) => {
      const isImage = asset.type?.startsWith('image/');
      return isImage && !!asset?.uri;
    });

    if (validAssets.length === 0) {
      Alert.alert('Error', 'No photo selected. Only images are allowed.');
      return;
    }

    // Enforce max 10 photos
    if (validAssets.length > MAX_PHOTOS) {
      Alert.alert(
        'Too Many Photos',
        `You can only upload up to ${MAX_PHOTOS} photos. Only the first ${MAX_PHOTOS} will be uploaded.`,
      );
      validAssets.splice(MAX_PHOTOS); // Keep only first 10
    }

    setUploading(true);
    setUploadProgress({ total: validAssets.length, uploaded: 0, current: 'Starting...' });

    try {
      await ensureOverlayReady();

      const files = validAssets.map((asset, index) => ({
        uri: asset.uri!,
        name: asset.fileName ?? `car_${Date.now()}_${index}.jpg`,
        type: asset.type ?? 'image/jpeg',
      }));

      const uploadedUrls: string[] = [];
      const seenUrls = new Set<string>();
      const failedFiles: { name: string; error: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        setUploadProgress({
          total: files.length,
          uploaded: i,
          current: file.name || `Image ${i + 1}`,
        });

        try {
          const urls = await uploadCarImages(carId, [file]);

          if (!Array.isArray(urls)) {
            throw new Error('Invalid response from server');
          }

          urls.forEach((url) => {
            if (typeof url === 'string' && url.trim().length && !seenUrls.has(url)) {
              seenUrls.add(url);
              uploadedUrls.push(url);
            }
          });
        } catch (error: any) {
          console.error('[CAR UPLOAD ERROR]', error?.message || error);
          failedFiles.push({
            name: file.name || `Image ${i + 1}`,
            error: error?.message || 'Upload failed',
          });
        }
      }

      setUploadProgress({
        total: files.length,
        uploaded: files.length,
        current: 'Complete',
      });

      if (uploadedUrls.length === 0) {
        const firstError = failedFiles[0]?.error || 'All uploads failed';
        throw new Error(firstError);
      }

      const successCount = uploadedUrls.length;
      const failCount = failedFiles.length;

      if (failCount > 0) {
        Alert.alert(
          'Partial Success',
          `${successCount} of ${files.length} images uploaded successfully.\n${failCount} failed.`,
          [
            {
              text: 'Continue Anyway',
              onPress: () =>
                navigation.navigate('CarPricingScreen', { carId, images: uploadedUrls }),
            },
            { text: 'Retry Failed', style: 'cancel' },
          ],
        );
      } else {
        Alert.alert('Success', `All ${successCount} images uploaded successfully!`);
        navigation.navigate('CarPricingScreen', { carId, images: uploadedUrls });
      }
    } catch (error: any) {
      console.error('[CAR UPLOAD FAILED]', error?.response?.data || error?.message || error);
      Alert.alert('Upload Failed', error?.message || 'Network error. Please try again.', [
        { text: 'Retry', onPress: () => uploadFromAssets(assets) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleTakePhoto = async () => {
    if (uploading) return;
    try {
      const res = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
      });

      if (res.assets?.length) {
        await uploadFromAssets(res.assets);
      }
    } catch (error) {
      console.error('[CAR CAMERA ERROR]', error);
      Alert.alert('Camera Error', 'Failed to open camera');
    }
  };

  const handlePickGallery = async () => {
    if (uploading) return;
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: MAX_PHOTOS, // Allow up to 10 photos - numbers show in native gallery
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
      });

      if (res.assets?.length) {
        await uploadFromAssets(res.assets);
      }
    } catch (error) {
      console.error('[CAR GALLERY ERROR]', error);
      Alert.alert('Gallery Error', 'Failed to open gallery');
    }
  };

  return (
    <PhotoUploadLayout
      title="Upload Car Photos"
      onBackPress={() => navigation.goBack()}
      backDisabled={uploading}
      actions={[
        { label: 'Take Photo', iconName: 'camera', onPress: handleTakePhoto },
        { label: 'Pick Gallery', iconName: 'folder', onPress: handlePickGallery },
      ]}
      uploading={uploading}
      progress={uploadProgress}
      progressHint={PROGRESS_HINT}
    />
  );
};

export default SelectCarPhotoScreen;
