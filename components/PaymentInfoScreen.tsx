import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const PaymentInfoScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const q = query(collection(db, 'paymentInfo'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data() as PaymentInfo;
          setPaymentInfo(docData);
          setDocId(querySnapshot.docs[0].id);
        }
      } catch (error) {
        console.error('Error fetching payment info:', error);
        Alert.alert('Error', 'Failed to load payment information');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // Basic validation
    if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    try {
      setLoading(true);
      const paymentData = {
        ...paymentInfo,
        userId: user.uid,
        lastUpdated: new Date().toISOString(),
      };

      if (docId) {
        // Update existing document
        await updateDoc(doc(db, 'paymentInfo', docId), paymentData);
      } else {
        // Create new document
        await addDoc(collection(db, 'paymentInfo'), paymentData);
      }

      Alert.alert('Success', 'Payment information saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving payment info:', error);
      Alert.alert('Error', 'Failed to save payment information');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (input: string) => {
    // Remove all non-digits
    const numbers = input.replace(/\D/g, '');
    
    // Format as XXXX XXXX XXXX XXXX
    let formatted = '';
    for (let i = 0; i < numbers.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += numbers[i];
    }
    
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (input: string) => {
    // Remove all non-digits
    const numbers = input.replace(/\D/g, '');
    
    // Format as MM/YY
    if (numbers.length <= 2) return numbers;
    return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Information</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          value={formatCardNumber(paymentInfo.cardNumber)}
          onChangeText={(text) => setPaymentInfo({...paymentInfo, cardNumber: text.replace(/\s/g, '')})}
          keyboardType="number-pad"
          maxLength={19}
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={paymentInfo.cardHolder}
          onChangeText={(text) => setPaymentInfo({...paymentInfo, cardHolder: text})}
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.row}>
        <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
          <Text style={styles.label}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            value={formatExpiryDate(paymentInfo.expiryDate)}
            onChangeText={(text) => setPaymentInfo({...paymentInfo, expiryDate: text.replace(/\D/g, '')})}
            keyboardType="number-pad"
            maxLength={5}
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={[styles.formGroup, {flex: 1}]}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            value={paymentInfo.cvv}
            onChangeText={(text) => setPaymentInfo({...paymentInfo, cvv: text.replace(/\D/g, '')})}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Saving...' : 'Save Payment Information'}
        </Text>
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
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentInfoScreen;
