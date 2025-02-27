import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { saveLedgerEntry } from '@/utils/database';
import { Building2, User, MapPin, Map, FileText, Phone, Mail, Wallet, List, LogOut } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LEDGER_TYPES = [
  'SUNDRY DEBTORS',
  'SUNDRY CREDITORS',
  'BANK ACCOUNTS',
  'CASH IN HAND',
  'FIXED ASSETS',
  'DUTIES & TAXES',
  'EXPENSES',
  'INCOME',
];

const STATES = [
  { code: '01', name: 'JAMMU & KASHMIR' },
  { code: '02', name: 'HIMACHAL PRADESH' },
  { code: '03', name: 'PUNJAB' },
  { code: '04', name: 'CHANDIGARH' },
  { code: '05', name: 'UTTARAKHAND' },
  { code: '06', name: 'HARYANA' },
  { code: '07', name: 'DELHI' },
  { code: '08', name: 'RAJASTHAN' },
  { code: '09', name: 'UTTAR PRADESH' },
  { code: '10', name: 'BIHAR' },
  { code: '11', name: 'SIKKIM' },
  { code: '12', name: 'ARUNACHAL PRADESH' },
  { code: '13', name: 'NAGALAND' },
  { code: '14', name: 'MANIPUR' },
  { code: '15', name: 'MIZORAM' },
  { code: '16', name: 'TRIPURA' },
  { code: '17', name: 'MEGHALAYA' },
  { code: '18', name: 'ASSAM' },
  { code: '19', name: 'WEST BENGAL' },
  { code: '20', name: 'JHARKHAND' },
  { code: '21', name: 'ODISHA' },
  { code: '22', name: 'CHHATTISGARH' },
  { code: '23', name: 'MADHYA PRADESH' },
  { code: '24', name: 'GUJARAT' },
  { code: '25', name: 'DAMAN & DIU' },
  { code: '26', name: 'DADRA & NAGAR HAVELI' },
  { code: '27', name: 'MAHARASHTRA' },
  { code: '28', name: 'ANDHRA PRADESH' },
  { code: '29', name: 'KARNATAKA' },
  { code: '30', name: 'GOA' },
  { code: '31', name: 'LAKSHADWEEP' },
  { code: '32', name: 'KERALA' },
  { code: '33', name: 'TAMIL NADU' },
  { code: '34', name: 'PUDUCHERRY' },
  { code: '35', name: 'ANDAMAN & NICOBAR ISLANDS' },
  { code: '36', name: 'TELANGANA' },
  { code: '37', name: 'LADAKH' },
];

export default function LedgerEntryScreen() {
  const [loading, setLoading] = useState(false);
  const [balanceType, setBalanceType] = useState('Dr');
  const [formData, setFormData] = useState({
    ledgerName: '',
    printName: '',
    ledgerType: 'SUNDRY DEBTORS',
    address1: '',
    address2: '',
    address3: '',
    state: '01 - JAMMU & KASHMIR',
    pinCode: '',
    gstNumber: '',
    contact: '',
    mobileNumber: '',
    phoneNumber: '',
    email: '',
    openingBalance: '',
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      ledgerName: '',
      printName: '',
      ledgerType: 'SUNDRY DEBTORS',
      address1: '',
      address2: '',
      address3: '',
      state: '01 - JAMMU & KASHMIR',
      pinCode: '',
      gstNumber: '',
      contact: '',
      mobileNumber: '',
      phoneNumber: '',
      email: '',
      openingBalance: '',
      isActive: true,
    });
    setBalanceType('Dr');
  };

  const handleSave = async () => {
    if (!formData.ledgerName) {
      Alert.alert('Error', 'Ledger Name is required');
      return;
    }

    try {
      setLoading(true);
      const dataToSave = {
        ...formData,
        balanceType,
      };
      await saveLedgerEntry(dataToSave);
      Alert.alert(
        'Success',
        'Ledger entry saved successfully',
        [
          {
            text: 'View All Entries',
            onPress: () => router.push('/ledger-list'),
          },
          {
            text: 'Add Another',
            onPress: resetForm,
            style: 'default',
          },
        ],
        {
          cancelable: false,
        }
      );
      resetForm();
    } catch (error) {
      console.error('Error saving ledger:', error);
      Alert.alert('Error', 'Failed to save ledger entry');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleViewLedgers = () => {
    router.push('/ledger-list');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ledger Master Creation</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleViewLedgers}
          >
            <List size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSignOut}
          >
            <LogOut size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.inputContainer}>
          <Building2 size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.ledgerName}
            onChangeText={(text) => setFormData({ ...formData, ledgerName: text })}
            placeholder="Ledger Name"
          />
        </View>

        <View style={styles.inputContainer}>
          <User size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.printName}
            onChangeText={(text) => setFormData({ ...formData, printName: text })}
            placeholder="Print Name"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Building2 size={20} color="#666" />
          <Picker
            selectedValue={formData.ledgerType}
            style={styles.picker}
            onValueChange={(value) => setFormData({ ...formData, ledgerType: value })}
          >
            {LEDGER_TYPES.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <MapPin size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.address1}
            onChangeText={(text) => setFormData({ ...formData, address1: text })}
            placeholder="Address"
          />
        </View>

        <View style={styles.inputContainer}>
          <MapPin size={20} color="#666" style={{ opacity: 0 }} />
          <TextInput
            style={styles.input}
            value={formData.address2}
            onChangeText={(text) => setFormData({ ...formData, address2: text })}
            placeholder="Address 2"
          />
        </View>

        <View style={styles.inputContainer}>
          <MapPin size={20} color="#666" style={{ opacity: 0 }} />
          <TextInput
            style={styles.input}
            value={formData.address3}
            onChangeText={(text) => setFormData({ ...formData, address3: text })}
            placeholder="Address 3"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Map size={20} color="#666" />
          <Picker
            selectedValue={formData.state}
            style={styles.picker}
            onValueChange={(value) => setFormData({ ...formData, state: value })}
          >
            {STATES.map((state) => (
              <Picker.Item 
                key={state.code} 
                label={`${state.code} - ${state.name}`} 
                value={`${state.code} - ${state.name}`}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <MapPin size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.pinCode}
            onChangeText={(text) => setFormData({ ...formData, pinCode: text })}
            placeholder="Pin Code"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <FileText size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.gstNumber}
            onChangeText={(text) => setFormData({ ...formData, gstNumber: text })}
            placeholder="GST Number"
          />
        </View>

        <View style={styles.inputContainer}>
          <User size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.contact}
            onChangeText={(text) => setFormData({ ...formData, contact: text })}
            placeholder="Contact"
          />
        </View>

        <View style={styles.inputContainer}>
          <Phone size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.mobileNumber}
            onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Phone size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Wallet size={20} color="#666" />
          <TextInput
            style={styles.input}
            value={formData.openingBalance}
            onChangeText={(text) => setFormData({ ...formData, openingBalance: text })}
            placeholder="Opening Balance"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[
              styles.balanceTypeButton,
              { backgroundColor: balanceType === 'Dr' ? '#0d5c46' : '#666' }
            ]}
            onPress={() => setBalanceType('Dr')}
          >
            <Text style={[
              styles.balanceTypeText,
              { fontWeight: balanceType === 'Dr' ? 'bold' : 'normal' }
            ]}>Dr</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.balanceTypeButton,
              { backgroundColor: balanceType === 'Cr' ? '#0d5c46' : '#666' }
            ]}
            onPress={() => setBalanceType('Cr')}
          >
            <Text style={[
              styles.balanceTypeText,
              { fontWeight: balanceType === 'Cr' ? 'bold' : 'normal' }
            ]}>Cr</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>IsActive</Text>
          <Switch
            value={formData.isActive}
            onValueChange={(value) => setFormData({ ...formData, isActive: value })}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={formData.isActive ? '#0d5c46' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8ee',
  },
  header: {
    backgroundColor: '#0d5c46',
    padding: 16,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 8,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333',
    height: 50,
  },
  picker: {
    flex: 1,
    marginLeft: 8,
    height: 50,
  },
  balanceTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  balanceTypeText: {
    color: 'white',
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#0d5c46',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
    elevation: 2,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});