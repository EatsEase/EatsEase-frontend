import * as React from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainLayout from './app/components/MainLayout';
import SignupScreen from './app/screens/SignupScreen';
import FirstPreferences from './app/screens/FirstPreferencesScreen';
import LoginScreen from './app/screens/LoginScreen';
import PreferencesScreen from './app/screens/PreferencesScreen';
import HistoryScreen from './app/screens/HistoryScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import AllergiesScreen from './app/screens/AllergiesScreen';

const Stack = createStackNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    'Jua Regular': require('./assets/fonts/Jua-Regular.ttf'),
    'Mali Bold': require('./assets/fonts/Mali-Bold.ttf'),
    'Mali Regular': require('./assets/fonts/Mali-Regular.ttf'),
    'Mali SemiBold': require('./assets/fonts/Mali-SemiBold.ttf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "MainLayout" : "Signup"}>
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FirstPreferences"
          component={FirstPreferences}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllergiesScreen"
          component={AllergiesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Preferences"
          component={PreferencesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainLayout"
          component={MainLayout}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
