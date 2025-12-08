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
import { useNavigation } from '@react-navigation/native';
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
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>{config.displayNamePlural}</Text>
          <Text style={styles.headerSubtitle}>Browse latest listings</Text>
        </View>

        <TouchableOpacity style={styles.headerIconButton}>
          <Icon name="magnify" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Icon name={config.icon} size={40} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>
        No {config.displayNamePlural} available
      </Text>
      <Text style={styles.emptySubtitle}>
        New listings will appear here as soon as they are added.
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <View style={styles.errorIconWrapper}>
        <Icon name="alert-circle" size={40} color="#DC2626" />
      </View>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadEntities()}>
        <Text style={styles.retryButtonText}>Try again</Text>
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
    backgroundColor: '#F3F4F6',
  },

  // HEADER
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrapper: {
    flex: 1,
    paddingHorizontal: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
  },

  // LIST
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  // STATES
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#64748B',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  errorIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 10,
    backgroundColor: '#0F5E87',
    borderRadius: 999,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
