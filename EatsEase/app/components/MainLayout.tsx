import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Headers';
import Tabs from './NavigateBottomBar';

const MainLayout = () => {
  return (
    <View style={styles.container}>
      {/* Show Header on all screens */}
      <Header title="EatsEase" />

      {/* Show Bottom Tabs */}
      <Tabs />
    </View>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
