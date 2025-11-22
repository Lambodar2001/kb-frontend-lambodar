import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';

interface ProfileHeaderProps {
  name: string;
  username: string;
  profileImage: string | null;
  onNameChange?: (newName: string) => void;
  onImageChange?: (imageUri: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name: initialName,
  username,
  profileImage: initialImage,
  onNameChange,
  onImageChange,
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(initialImage);
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handlePhotoOptions = () => {
    Alert.alert('Change Profile Photo', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => {
          launchCamera({ mediaType: 'photo' }, handleImagePickerResponse);
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo' }, handleImagePickerResponse);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Image picker error');
      return;
    }
    if (response.assets && response.assets.length > 0) {
      const imageUri = response.assets[0].uri;
      if (imageUri) {
        setProfileImage(imageUri);
        onImageChange?.(imageUri);
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setName(tempName);
      onNameChange?.(tempName);
    } else {
      setTempName(name);
    }
    setIsEditing(!isEditing);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={handlePhotoOptions}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../../../../assets/icons/user.png')
          }
          style={styles.avatar}
        />
        <View style={styles.cameraIcon}>
          <Icon name="camera" size={16} color="#666" />
        </View>
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <View style={styles.nameContainer}>
          {isEditing ? (
            <TextInput
              value={tempName}
              onChangeText={setTempName}
              style={styles.nameInput}
              placeholder="Enter name"
            />
          ) : (
            <Text style={styles.name}>{name}</Text>
          )}
          <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
            <Icon
              name={isEditing ? 'check' : 'pencil-outline'}
              size={14}
              color="#007AFF"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>@{username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5E5',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  nameInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    paddingVertical: 2,
    flex: 1,
  },
  editButton: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileHeader;
