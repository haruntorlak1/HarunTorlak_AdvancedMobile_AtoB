import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../components/AuthScreen';
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignupScreen';
import { AuthStackParamList } from '../types/navigation';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AuthWelcome">
      <Stack.Screen name="AuthWelcome" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
