import * as React from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';

import MainLayout from './app/components/MainLayout';
import SignupScreen from './app/screens/SignupScreen';
import FirstPreferences from './app/screens/FirstPreferencesScreen';
import LoginScreen from './app/screens/LoginScreen';

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

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signup">
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="FirstPreferences" 
            component={FirstPreferences} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          {/* Main app screens with Tabs and Header */}
          <Stack.Screen 
            name="MainLayout" 
            component={MainLayout} 
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
