import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { AuthStackParamList } from '../types/navigation';

type SignupScreenNavigationProp = {
  navigate: (screen: keyof AuthStackParamList) => void;
};

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (email === '' || password === '') {
      setError('Email and password cannot be empty.');
      return;
    }
    try {
      await signUp(email, password, username);
    } catch (err: any) {
      let errorMessage = 'Failed to create an account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak.';
      }
      setError(errorMessage);
      console.error('Signup failed:', err.code, err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/taxi-logo.webp')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sign Up</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Already have an account? Login</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  loginButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
