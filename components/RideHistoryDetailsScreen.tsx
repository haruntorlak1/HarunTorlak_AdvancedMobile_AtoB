import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebase';
import { Ride } from '../types/types';
import { ProfileStackRouteProp } from '../types/navigation';

const RideHistoryDetailsScreen = () => {
  const route = useRoute<ProfileStackRouteProp<'RideHistoryDetails'>>();
  const navigation = useNavigation();
  const { rideId } = route.params;
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const docRef = doc(db, 'rides', rideId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRide({ id: docSnap.id, ...docSnap.data() } as Ride);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching ride details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!ride) {
    return <View style={styles.container}><Text>Ride not found.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{ride.from}</Text>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{ride.to}</Text>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date(ride.date.seconds * 1000).toLocaleString()}</Text>
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>${ride.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to History</Text>
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
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
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

export default RideHistoryDetailsScreen;
