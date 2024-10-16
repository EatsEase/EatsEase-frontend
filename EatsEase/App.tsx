import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from './app/components/Headers';
import Tabs from './app/components/NavigatBottomBar';
import { NavigationContainer } from '@react-navigation/native';

const loadFonts = async () => {
  await Font.loadAsync({
    'Jua Regular': require('./assets/fonts/Jua-Regular.ttf'), // Load your custom font
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true)); // Load the fonts asynchronously
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />; // Show a loading screen until the font is loaded
  }

  return (
    <View style={styles.container}>
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
