import * as React from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from './app/components/Headers';
import Tabs from './app/components/NavigatBottomBar';
import { NavigationContainer } from '@react-navigation/native';
import SignupScreen from './app/screens/SignupScreen';
import { useState } from 'react';
import { useEffect } from 'react';
import FirstPreferences from './app/screens/FirstPreferencesScreen';

const loadFonts = async () => {
  await Font.loadAsync({
    'Jua Regular': require('./assets/fonts/Jua-Regular.ttf'),
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
      <FirstPreferences />
      {/* <Header title="EatsEase" />
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
      <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
