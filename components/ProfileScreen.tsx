import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const ProfileScreen = () => {
  const { user, updateUserProfile, updateUserPassword } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleSave = async () => {
    setError('');
    if (newPassword && newPassword !== repeatPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      if (displayName !== user?.displayName) {
        await updateUserProfile(displayName);
      }
      if (newPassword) {
        await updateUserPassword(newPassword);
      }
      Alert.alert('Success', 'Profile updated successfully.');
      setIsEditMode(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/taxi-logo.webp')} style={styles.logo} />
      <Text style={styles.title}>My Profile</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        {isEditMode ? (
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
          />
        ) : (
          <Text style={styles.value}>{displayName}</Text>
        )}
      </View>

      {isEditMode && (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>New Password:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Repeat Password:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              placeholder="Repeat new password"
            />
          </View>
        </>
      )}

      {isEditMode ? (
        <View style={styles.editContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsEditMode(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RideHistory' as never)}>
            <Text style={styles.buttonText}>Ride History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsEditMode(true)}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
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
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  editContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ProfileScreen;
