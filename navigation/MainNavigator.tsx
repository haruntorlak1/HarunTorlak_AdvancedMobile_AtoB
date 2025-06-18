import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { MainStackParamList } from '../types/navigation';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainStackParamList>();

const MainNavigator = () => {
  const { signOut } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFD700',
        },
        headerStyle: {
          backgroundColor: '#FFD700',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Home' }}/>
      <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Profile' }}/>
      <Tab.Screen 
        name="Logout"
        options={{ title: 'Logout' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            signOut();
          },
        })}
      >
        {() => null}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainNavigator;
