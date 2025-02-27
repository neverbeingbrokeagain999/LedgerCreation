import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { 
  Building, 
  User, 
  Users, 
  MapPin, 
  FileText, 
  Phone, 
  Smartphone, 
  Mail, 
  DollarSign,
  Check
} from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { saveLedgerEntry } from '@/utils/database';

// Sample data for dropdowns
const LEDGER_TYPES = ['SUNDRY DEBTORS', 'SUNDRY CREDITORS', 'BANK ACCOUNTS', 'CASH ACCOUNTS'];
const STATES = [
  '01 - JAMMU & KASHMIR', '02 - HIMACHAL PRADESH', '03 - PUNJAB', '04 - CHANDIGARH',
  '05 - UTTARAKHAND', '06 - HARYANA', '07 - DELHI', '08 - RAJASTHAN'
];

export default function LedgerFormScreen() {
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
    balanceType: 'Dr',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.ledgerName.trim()) {
      newErrors.ledgerName = 'Ledger name is required';
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (formData.openingBalance && isNaN(Number(formData.openingBalance))) {
      newErrors.openingBalance = 'Opening balance must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        // Convert opening balance to number
        const openingBalanceValue = formData.openingBalance 
          ? parseFloat(formData.openingBalance) 
          : 0;
          
        // Adjust sign based on Dr/Cr
        const finalBalance = formData.balanceType === 'Dr' 
          ? openingBalanceValue 
          : -openingBalanceValue;
          
        const ledgerData = {
          ...formData,
          openingBalance: finalBalance
        };
        
        await saveLedgerEntry(ledgerData);
        Alert.alert(
          "Success", 
          "Ledger entry saved successfully!",
          [{ text: "OK", onPress: () => resetForm() }]
        );
      } catch (error) {
        console.error('Error saving ledger entry:', error);
        Alert.alert("Error", "Failed to save ledger entry. Please try again.");
      }
    }
  };

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
      balanceType: 'Dr',
      isActive: true
    });
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Ledger Name */}
          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, errors.ledgerName ? styles.inputError : null]}>
              <Building color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ledger Name"
                value={formData.ledgerName}
                onChangeText={(value) => updateFormField('ledgerName', value)}
              />
            </View>
          </View>
          {errors.ledgerName && <Text style={styles.errorText}>{errors.ledgerName}</Text>}

          {/* Print Name */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <User color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Print Name"
                value={formData.printName}
                onChangeText={(value) => updateFormField('printName', value)}
              />
            </View>
          </View>

          {/* Ledger Type */}
          <View style={styles.pickerContainer}>
            <Users color="#555" size={20} style={styles.inputIcon} />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.ledgerType}
                style={styles.picker}
                onValueChange={(value) => updateFormField('ledgerType', value)}
              >
                {LEDGER_TYPES.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Address 1 */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <MapPin color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={formData.address1}
                onChangeText={(value) => updateFormField('address1', value)}
              />
            </View>
          </View>

          {/* Address 2 */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Address 2"
                value={formData.address2}
                onChangeText={(value) => updateFormField('address2', value)}
              />
            </View>
          </View>

          {/* Address 3 */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Address 3"
                value={formData.address3}
                onChangeText={(value) => updateFormField('address3', value)}
              />
            </View>
          </View>

          {/* State */}
          <View style={styles.pickerContainer}>
            <MapPin color="#555" size={20} style={styles.inputIcon} />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.state}
                style={styles.picker}
                onValueChange={(value) => updateFormField('state', value)}
              >
                {STATES.map((state) => (
                  <Picker.Item key={state} label={state} value={state} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Pin Code */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <MapPin color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Pin Code"
                value={formData.pinCode}
                onChangeText={(value) => updateFormField('pinCode', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* GST Number */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <FileText color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="GST Number"
                value={formData.gstNumber}
                onChangeText={(value) => updateFormField('gstNumber', value)}
              />
            </View>
          </View>

          {/* Contact */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <User color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contact"
                value={formData.contact}
                onChangeText={(value) => updateFormField('contact', value)}
              />
            </View>
          </View>

          {/* Mobile Number */}
          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, errors.mobileNumber ? styles.inputError : null]}>
              <Smartphone color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChangeText={(value) => updateFormField('mobileNumber', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}

          {/* Phone Number */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Phone color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(value) => updateFormField('phoneNumber', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
              <Mail color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => updateFormField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Opening Balance */}
          <View style={styles.balanceRow}>
            <View style={[
              styles.inputContainer, 
              styles.balanceInput, 
              errors.openingBalance ? styles.inputError : null
            ]}>
              <DollarSign color="#555" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Opening Balance"
                value={formData.openingBalance}
                onChangeText={(value) => updateFormField('openingBalance', value)}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.balanceTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.balanceTypeButton,
                  formData.balanceType === 'Dr' ? styles.balanceTypeActive : {}
                ]}
                onPress={() => updateFormField('balanceType', 'Dr')}
              >
                <Text style={[
                  styles.balanceTypeText,
                  formData.balanceType === 'Dr' ? styles.balanceTypeTextActive : {}
                ]}>Dr</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.balanceTypeButton,
                  formData.balanceType === 'Cr' ? styles.balanceTypeActive : {}
                ]}
                onPress={() => updateFormField('balanceType', 'Cr')}
              >
                <Text style={[
                  styles.balanceTypeText,
                  formData.balanceType === 'Cr' ? styles.balanceTypeTextActive : {}
                ]}>Cr</Text>
              </TouchableOpacity>
            </View>
          </View>
          {errors.openingBalance && <Text style={styles.errorText}>{errors.openingBalance}</Text>}

          {/* Is Active */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => updateFormField('isActive', !formData.isActive)}
            >
              {formData.isActive && (
                <Check size={16} color="#0d5c46" />
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>IsActive</Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8ee',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputRow: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: 'red',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  pickerWrapper: {
    flex: 1,
  },
  picker: {
    height: 50,
  },
  balanceRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  balanceInput: {
    flex: 1,
    marginRight: 8,
  },
  balanceTypeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  balanceTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  balanceTypeActive: {
    backgroundColor: '#0d5c46',
  },
  balanceTypeText: {
    fontSize: 16,
    color: '#333',
  },
  balanceTypeTextActive: {
    color: 'white',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#0d5c46',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});