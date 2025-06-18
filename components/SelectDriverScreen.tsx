import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';

interface Driver {
  id: string;
  'Driver Name': string;
  'Car Model': string;
  'Car Color': string;
}

const SelectDriverScreen = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  const fetchDrivers = async () => {
    try {
      const driversCollection = collection(db, 'Drivers');
      const driverSnapshot = await getDocs(driversCollection);
      const driversList = driverSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Driver[];
      setDrivers(driversList);
    } catch (error) {
      console.error("Error fetching drivers: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDriver = async () => {
    if (!selectedDriverId) return;

    const driver = drivers.find(d => d.id === selectedDriverId);
    if (!driver || !user) {
        Alert.alert('Error', 'Please log in to select a driver.');
        return;
    };

    try {
        await addDoc(collection(db, 'rides'), {
            userId: user.uid,
            driverId: driver.id,
            driverName: driver['Driver Name'],
            driverCar: driver['Car Model'],
            carColor: driver['Car Color'],
            createdAt: serverTimestamp(),
        });

        Alert.alert(
            `Confirm Selection`,
            `Your driver, ${driver['Driver Name']}, is coming to your location!`,
            [
                {
                text: 'OK',
                onPress: () => navigation.navigate('Home' as never),
                },
            ],
            { cancelable: false }
        );
    } catch (error) {
        console.error("Error saving ride: ", error);
        Alert.alert('Error', 'Could not save your ride. Please try again.');
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading drivers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Driver</Text>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedDriverId(item.id)}>
            <View style={[styles.driverCard, selectedDriverId === item.id && styles.selectedDriverCard]}>
              <Text style={styles.driverName}>{item['Driver Name']}</Text>
              <Text>{item['Car Color']} {item['Car Model']}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No drivers available.</Text>}
        style={styles.driverListContainer}
      />
      {selectedDriverId && (
        <TouchableOpacity style={styles.selectButton} onPress={handleSelectDriver}>
          <Text style={styles.selectButtonText}>Select Driver</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  driverListContainer: {
    flex: 1,
    width: '100%',
  },
  driverCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 5,
    borderRadius: 8,
  },
  selectedDriverCard: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  selectButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  selectButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  }
});

export default SelectDriverScreen;
