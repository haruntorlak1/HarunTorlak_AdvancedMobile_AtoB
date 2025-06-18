import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthStackParamList } from '../types/navigation';

type AuthScreenNavigationProp = {
  navigate: (screen: keyof AuthStackParamList) => void;
};

type Props = {};

const AuthScreen: React.FC<Props> = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to AtoB!</Text>
        <Image
          source={require('../assets/taxi-logo.webp')}
          style={styles.logo}
        />
        <Text style={styles.title}>AtoB Taxi</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.signupButton]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthScreen;
