import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ProfileScreen from '../components/ProfileScreen';
import RideHistoryScreen from '../components/RideHistory';
import RideHistoryDetailsScreen from '../components/RideHistoryDetailsScreen';
import PaymentInfoScreen from '../components/PaymentInfoScreen';
import { ProfileStackParamList } from '../types/navigation';

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false, // We'll use the header from the MainNavigator
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="RideHistory" component={RideHistoryScreen} />
      <ProfileStack.Screen name="RideHistoryDetails" component={RideHistoryDetailsScreen} />
      <ProfileStack.Screen name="PaymentInfo" component={PaymentInfoScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
