import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({
  token: '',
  explorer: {},
  business: {},
  loginAction: () => {},
  logOut: () => {},
});

const AuthProvider = ({ children }) => {
  const [explorer, setExplorer] = useState({});
  const [business, setBusiness] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    retrieveData();
  }, []);

  const storeData = async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
      console.log('Data stored successfully');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const retrieveData = async () => {
    try {
      const storedExplorer = await SecureStore.getItemAsync('explorer');
      const storedBusiness = await SecureStore.getItemAsync('business');
      const storedToken = await SecureStore.getItemAsync('token');

      if (storedExplorer) setExplorer(JSON.parse(storedExplorer));
      if (storedBusiness) setBusiness(JSON.parse(storedBusiness));
      if (storedToken) setToken(storedToken);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const loginAction = async (data) => {
    try {
      const response = await axios.post('http://192.168.1.19:3000/auth/login', data);

      if (response.status === 200) {
        const { token } = response.data; // Ensure the backend sends back a token
        Alert.alert('Success', response.data.message);

        if (response.data.business) {
          setBusiness(response.data.business);
          await storeData('business', response.data.business);
          setToken(token); // Set the token in state
          await storeData('token', token);
        } else if (response.data.explorer) {
          setExplorer(response.data.explorer);
          await storeData('explorer', response.data.explorer);
          setToken(token); // Set the token in state
          await storeData('token', token);
        } else {
          console.log('Unknown role');
        }

        return { token }; // Return token for use in LoginScreen or other components
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Login failed!');
      throw err; // Rethrow the error for higher-level handling
    }
  };

  const logOut = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('explorer');
      await SecureStore.deleteItemAsync('business');

      setExplorer({});
      setBusiness({});
      setToken('');
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, explorer, business, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
