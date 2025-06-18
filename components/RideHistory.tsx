import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { ProfileStackNavigationProp } from '../types/navigation';

interface Ride {
    id: string;
    driverName: string;
    driverCar: string;
    createdAt: { seconds: number; nanoseconds: number; };
}

const RideHistoryScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<ProfileStackNavigationProp>();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'rides'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const userRides = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride));
          setRides(userRides);
        } catch (error) {
          console.error("Error fetching rides: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRides();
  }, [user]);

  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Ride History</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.rideItem}>
            <Text style={styles.rideText}>Driver: {item.driverName}</Text>
            <Text style={styles.rideSubText}>Vehicle: {item.driverCar}</Text>
            <Text style={styles.rideDate}>Date: {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No rides found.</Text>}
      />
       <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Profile</Text>
      </TouchableOpacity>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  rideItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rideText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rideSubText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  rideDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
    button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RideHistoryScreen;
