import * as React from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from './app/components/Headers';
import Tabs from './app/components/NavigatBottomBar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './app/screens/SignupScreen';
import { useState } from 'react';
import { useEffect } from 'react';
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
    <View style={styles.container}>
      {/* <SignupScreen /> */}
      {/* <FirstPreferences /> */}
      {/* <LoginScreen /> */}
      <Header title="EatsEase" />
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
