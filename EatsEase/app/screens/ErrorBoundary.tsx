import React, { Component, ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(_: Error) {
      return { hasError: true };
    }
  
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("🛑 Error caught by ErrorBoundary:", error, errorInfo);
    }
  
    handleRetry = () => {
      this.setState({ hasError: false });
    };
  
    render() {
      if (this.state.hasError) {
        return (
          <View style={styles.container}>
            <Text style={styles.errorText}>🚨 Something went wrong!</Text>
            <Text style={styles.subText}>Please try again later.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return this.props.children;
    }
  }
  

export default ErrorBoundary;

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
