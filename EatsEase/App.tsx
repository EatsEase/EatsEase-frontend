import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Header from './app/components/Headers';
import Tabs from './app/components/NavigatBottomBar';
import { NavigationContainer } from '@react-navigation/native';


export default function App() {
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
