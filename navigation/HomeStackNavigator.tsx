import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import SelectDriverScreen from '../components/SelectDriverScreen';
import { HomeStackParamList } from '../types/navigation';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SelectDriver" component={SelectDriverScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
