import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ErrorScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>🚨 Oops! Something went wrong</Text>
      <Text style={styles.subText}>Please try again later.</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
        <Text style={styles.retryButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  errorText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#721c24',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#721c24',
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
