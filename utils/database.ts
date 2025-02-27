import { getCollection } from './mongodb';

export interface LedgerEntry {
  _id?: string;
  ledgerName: string;
  printName: string;
  ledgerType: string;
  address1: string;
  address2: string;
  address3: string;
  state: string;
  pinCode: string;
  gstNumber: string;
  contact: string;
  mobileNumber: string;
  phoneNumber: string;
  email: string;
  openingBalance: number;
  balanceType: 'Dr' | 'Cr';
  isActive: number;
  createdAt?: string;
}

// API URL for the backend server
export const API_URL = 'http://localhost:3000/api';

// Initialize the database
export const initializeDatabase = async () => {
  try {
    // Test the connection
    const response = await fetch(`${API_URL}/ledger`);
    if (!response.ok) throw new Error('Failed to connect to the database');
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Save a ledger entry
export const saveLedgerEntry = async (data: any) => {
  try {
    const entry: Omit<LedgerEntry, '_id' | 'createdAt'> = {
      ledgerName: data.ledgerName,
      printName: data.printName || data.ledgerName,
      ledgerType: data.ledgerType,
      address1: data.address1 || '',
      address2: data.address2 || '',
      address3: data.address3 || '',
      state: data.state || '',
      pinCode: data.pinCode || '',
      gstNumber: data.gstNumber || '',
      contact: data.contact || '',
      mobileNumber: data.mobileNumber || '',
      phoneNumber: data.phoneNumber || '',
      email: data.email || '',
      openingBalance: Number(data.openingBalance) || 0,
      balanceType: data.balanceType || 'Dr',
      isActive: data.isActive ? 1 : 0,
    };

    const response = await fetch(`${API_URL}/ledger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save ledger entry');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving ledger entry:', error);
    throw error;
  }
};

// Get all ledger entries
export const getLedgerEntries = async () => {
  try {
    const response = await fetch(`${API_URL}/ledger`);
    if (!response.ok) throw new Error('Failed to get ledger entries');
    return await response.json();
  } catch (error) {
    console.error('Error getting ledger entries:', error);
    throw error;
  }
};

// Get a ledger entry by ID
export const getLedgerEntryById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/ledger/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to get ledger entry');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting ledger entry:', error);
    throw error;
  }
};

// Update a ledger entry
export const updateLedgerEntry = async (id: string, data: any) => {
  try {
    const updateData: Partial<LedgerEntry> = {
      ledgerName: data.ledgerName,
      printName: data.printName || data.ledgerName,
      ledgerType: data.ledgerType,
      address1: data.address1 || '',
      address2: data.address2 || '',
      address3: data.address3 || '',
      state: data.state || '',
      pinCode: data.pinCode || '',
      gstNumber: data.gstNumber || '',
      contact: data.contact || '',
      mobileNumber: data.mobileNumber,
      phoneNumber: data.phoneNumber || '',
      email: data.email || '',
      openingBalance: data.openingBalance || 0,
      balanceType: data.balanceType || 'Dr',
      isActive: data.isActive ? 1 : 0
    };
    
    const response = await fetch(`${API_URL}/ledger/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) throw new Error('Failed to update ledger entry');
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error updating ledger entry:', error);
    throw error;
  }
};

// Delete a ledger entry
export const deleteLedgerEntry = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/ledger/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete ledger entry');
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting ledger entry:', error);
    throw error;
  }
};

// Clear all data from the database
export const clearDatabase = async () => {
  try {
    const response = await fetch(`${API_URL}/ledger`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to clear database');
    
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};