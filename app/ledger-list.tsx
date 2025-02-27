import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { getLedgerEntries } from '@/utils/database';
import { LedgerEntry } from '@/utils/database';
import { Edit3, Trash2 } from 'lucide-react-native';

export default function LedgerListScreen() {
  const [ledgers, setLedgers] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLedgers = async () => {
    try {
      const entries = await getLedgerEntries();
      setLedgers(entries);
    } catch (error) {
      console.error('Error loading ledgers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLedgers();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadLedgers();
  }, []);

  const renderItem = ({ item }: { item: LedgerEntry }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.ledgerName}>{item.ledgerName}</Text>
          <Text style={styles.ledgerType}>{item.ledgerType}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push(`/edit-ledger/${item._id}`)}
          >
            <Edit3 size={20} color="#0d5c46" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        {item.address1 && (
          <Text style={styles.address}>
            {[item.address1, item.address2, item.address3]
              .filter(Boolean)
              .join(', ')}
          </Text>
        )}
        {item.gstNumber && (
          <Text style={styles.gst}>GST: {item.gstNumber}</Text>
        )}
        {item.mobileNumber && (
          <Text style={styles.contact}>Mobile: {item.mobileNumber}</Text>
        )}
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.balance}>
          Opening Balance: ₹{item.openingBalance.toLocaleString()}
        </Text>
        <Text style={styles.date}>
          {new Date(item.createdAt || '').toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d5c46" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ledgers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || ''}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No ledger entries found</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.addButtonText}>Add New Ledger</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8ee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ledgerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ledgerType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  cardContent: {
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  gst: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  balance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d5c46',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#0d5c46',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0d5c46',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
