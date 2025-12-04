/**
 * Catalog List Screen
 * Reusable listing screen that works with any entity type
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EntityConfig, BaseEntity } from '../config/entityTypes';
import { getAllEntities, getEntityId } from '../api/catalogApi';
import { CatalogItemCard } from '../components/CatalogItemCard';

interface CatalogListScreenProps<T extends BaseEntity> {
  config: EntityConfig<T>;
}

export function CatalogListScreen<T extends BaseEntity>({
  config,
}: CatalogListScreenProps<T>) {
  const navigation = useNavigation();
  const [entities, setEntities] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntities = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const response = await getAllEntities<T>(config, {
          page: 0,
          size: 50,
          sort: 'createdAt,DESC',
        });

        setEntities(response.content || []);
      } catch (err) {
        console.error(`Error loading ${config.displayNamePlural}:`, err);
        setError(`Failed to load ${config.displayNamePlural.toLowerCase()}`);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [config]
  );

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  const handleRefresh = useCallback(() => {
    loadEntities(true);
  }, [loadEntities]);

  const handleEntityPress = useCallback(
    (entity: T) => {
      const entityId = getEntityId(entity, config);
      navigation.navigate(config.detailScreenName as never, {
        entityId,
        entityType: config.type,
      } as never);
    },
    [navigation, config]
  );

  const renderEntity = useCallback(
    ({ item }: { item: T }) => (
      <CatalogItemCard<T>
        entity={item}
        config={config}
        onPress={() => handleEntityPress(item)}
      />
    ),
    [config, handleEntityPress]
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#0F172A" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{config.displayNamePlural}</Text>
      <TouchableOpacity style={styles.searchButton}>
        <Icon name="magnify" size={24} color="#0F172A" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name={config.icon} size={64} color="#CBD5E1" />
      <Text style={styles.emptyTitle}>
        No {config.displayNamePlural} Available
      </Text>
      <Text style={styles.emptySubtitle}>
        Check back later for new listings
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Icon name="alert-circle" size={64} color="#EF4444" />
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadEntities()}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={config.color} />
          <Text style={styles.loadingText}>
            Loading {config.displayNamePlural.toLowerCase()}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      <FlatList
        data={entities}
        renderItem={renderEntity}
        keyExtractor={(item) => getEntityId(item, config).toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[config.color]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#0F5E87',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
