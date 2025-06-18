import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsLoading(false);
      return;
    }
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      } else {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
      setIsLoading(false);
    })();
  }, []);

  const goToCurrentLocation = () => {
    if (location && mapRef.current) {
      const { latitude, longitude } = location.coords;
      const newRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.centered}>
        <Text style={styles.webText}>Maps are not available on the web.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          </MapView>
          <TouchableOpacity style={styles.locationButton} onPress={goToCurrentLocation}>
            <Ionicons name="locate" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callRideButton} onPress={() => navigation.navigate('SelectDriver')}>
            <Text style={styles.callRideButtonText}>Call a Ride</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{errorMsg || 'Could not fetch location.'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFD700',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  callRideButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 100,
    elevation: 5,
  },
  callRideButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webText: {
    fontSize: 18,
  }
});

export default HomeScreen;
