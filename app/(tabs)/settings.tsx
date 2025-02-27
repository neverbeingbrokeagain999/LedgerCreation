import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Bell, Moon, Database, Trash2, LogOut } from 'lucide-react-native';
import { clearDatabase } from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear(); // Clear all stored data
              router.replace('/');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const toggleSwitch = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        Alert.alert(
          'Dark Mode',
          'Dark mode is not fully implemented yet. This is just a demo toggle.',
          [{ text: 'OK' }]
        );
        break;
      case 'autoSync':
        setAutoSync(value);
        break;
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Database',
      'Are you sure you want to clear all ledger entries? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearDatabase();
              Alert.alert('Success', 'Database cleared successfully');
            } catch (error) {
              console.error('Error clearing database:', error);
              Alert.alert('Error', 'Failed to clear database');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.setting}>
          <View style={styles.settingLeft}>
            <Bell size={24} color="#333" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={(value) => toggleSwitch('notifications', value)}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingLeft}>
            <Moon size={24} color="#333" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={(value) => toggleSwitch('darkMode', value)}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingLeft}>
            <Database size={24} color="#333" />
            <Text style={styles.settingText}>Auto Sync</Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={(value) => toggleSwitch('autoSync', value)}
          />
        </View>
      </View>

      <View style={styles.dangerSection}>
        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
          <Trash2 size={24} color="#ff4444" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={24} color="#fff" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8ee',
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  dangerSection: {
    marginTop: 'auto',
    gap: 10,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dangerButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});