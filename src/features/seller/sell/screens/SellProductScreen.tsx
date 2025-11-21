import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellEntryStackParamList } from '@navigation/SellEntryStack';
import { useAuth } from '@context/AuthContext';

type Nav = NativeStackNavigationProp<SellEntryStackParamList, 'SellProduct'>;

const SellProductScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { roles, sellerId } = useAuth();
  const [pressedItem, setPressedItem] = useState<string | null>(null);

  // Role guard: Only sellers with valid sellerId can access this screen
  const isSeller = roles.includes('SELLER') && sellerId !== null;

  if (!isSeller) {
    return (
      <View style={roleGuardStyles.container}>
        <Text style={roleGuardStyles.title}>Seller Access Only</Text>
        <Text style={roleGuardStyles.message}>
          This feature is only available for sellers. Please contact support to upgrade your account.
        </Text>
      </View>
    );
  }

  const renderItem = (label: string, icon: string, onPress?: () => void) => (
    <Pressable
      onPressIn={() => setPressedItem(label)}
      onPressOut={() => setPressedItem(null)}
      onPress={onPress}
      style={[styles.item, pressedItem === label && styles.selectedItem]}
    >
      <Icon name={icon} size={30} color={pressedItem === label ? 'white' : 'black'} />
      <Text style={[styles.itemText, pressedItem === label && styles.selectedText]}>
        + Add {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you Selling?</Text>
      <Text style={styles.subtitle}>Add Product</Text>
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet consectetur ipsum
        massa turpis monti plotov. Vitae habitant duis
      </Text>

      <View style={styles.grid}>
        {renderItem('Car', 'car', () =>
          navigation.navigate('SellCarStack' as never, { screen: 'AddCarDetails' } as never)
        )}

        {renderItem('Bike', 'motorbike', () =>
          navigation.navigate('SellBikeStack' as never, { screen: 'AddBikeDetails' } as never)
        )}

        {renderItem('Laptop', 'laptop', () =>
          navigation.navigate('SellLaptopStack' as never, { screen: 'AddLaptopDetails' } as never)
        )}

        {renderItem('Mobile', 'cellphone', () =>
          navigation.navigate('SellMobileStack' as never, { screen: 'AddMobileDetails' } as never)
        )}
      </View>
    </View>
  );
};

const roleGuardStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SellProductScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 20, paddingTop: 60 },
  title: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 20, color: '#333' },
  subtitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#333' },
  description: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  item: {
    width: '48%', height: 120, backgroundColor: 'white', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3,
  },
  selectedItem: { backgroundColor: '#4A90E2' },
  itemText: { fontSize: 16, fontWeight: '500', marginTop: 8, color: '#333' },
  selectedText: { color: 'white' },
});
