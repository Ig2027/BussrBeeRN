import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// TypeScript interfaces
interface Fruit {
  name: string;
}

interface FruitsResponse {
  fruits: Fruit[];
}

interface MessageResponse {
  message: string;
}

interface AddFruitResponse {
  message: string;
  fruit: Fruit;
}

// For iOS Simulator, use localhost
const API_URL = 'http://localhost:8000';

export default function App(): React.JSX.Element {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [newFruit, setNewFruit] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested');

  // Test connection
  const testConnection = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/`);
      const data: MessageResponse = await response.json();
      setConnectionStatus(`✅ Connected: ${data.message}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setConnectionStatus(`❌ Failed: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch fruits
  const fetchFruits = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/fruits`);
      const data: FruitsResponse = await response.json();
      setFruits(data.fruits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching fruits:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add fruit
  const addFruit = async (): Promise<void> => {
    if (!newFruit.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/fruits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newFruit }),
      });
      const data: AddFruitResponse = await response.json();
      console.log('Added:', data);
      setNewFruit('');
      fetchFruits(); // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error adding fruit:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete fruit
  const deleteFruit = async (fruitName: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/fruits/${encodeURIComponent(fruitName)}`, {
        method: 'DELETE',
      });
      const data: MessageResponse = await response.json();
      console.log('Deleted:', data);
      fetchFruits(); // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting fruit:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load fruits on mount
  useEffect(() => {
    fetchFruits();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FastAPI + React Native Test</Text>
        
        {/* Connection Test */}
        <TouchableOpacity 
          style={styles.testButton} 
          onPress={testConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>
        <Text style={styles.status}>{connectionStatus}</Text>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      {/* Add Fruit Form */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter fruit name"
          value={newFruit}
          onChangeText={setNewFruit}
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={addFruit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {/* Fruits List */}
      <FlatList
        data={fruits}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.fruitItem}>
            <Text style={styles.fruitText}>🍎 {item.name}</Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteFruit(item.name)}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No fruits yet. Add one!</Text>
        }
      />

      {/* Refresh Button */}
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={fetchFruits}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Refresh List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  status: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: '#c62828',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fruitItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fruitText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  refreshButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});