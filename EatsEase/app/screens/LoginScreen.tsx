import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axiosInstance from '../services/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const navigation = useNavigation();

    // State variables for managing form inputs and errors
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axiosInstance.post('/login', {
                emailOrUsername,
                password,
            });
    
            // Save the token to AsyncStorage
            if (response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
            }
    
            // Check if token is saved successfully
            const savedToken = await AsyncStorage.getItem('token');
            if (savedToken) {
                console.log('Login successful:', response.data);
                navigation.navigate('FirstPreferences'); // Navigate to preferences or home screen
            } else {
                console.error('Token not saved');
            }
    
        } catch (err) {
            // Handle login error
            setError('Login failed. Please check your credentials and try again.');
            console.error('Login error:', err);
        }
    };
    

    return (
        <LinearGradient
            colors={['#FD3B71', '#FE5266', '#FE665D', '#FE5266', '#FD3B71']}
            locations={[0, 0.21, 0.48, 0.78, 1]}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../../app/image/logo.png')}
                    resizeMode="contain" 
                    style={styles.logo} 
                />
                <Text style={styles.textH1}>EatsEase</Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.textH3}>Welcome</Text>
                <View style={styles.form}>
                    <TextInput 
                        placeholder="Enter your email or username" 
                        style={styles.input} 
                        value={emailOrUsername}
                        onChangeText={setEmailOrUsername} 
                    />
                    <TextInput 
                        placeholder="Enter your password" 
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword} 
                    />

                    {/* Error message */}
                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    {/* Enter Button */}
                    <TouchableOpacity style={styles.enterButton} onPress={handleLogin}>
                        <Text style={styles.enterButtonText}>Enter</Text>
                    </TouchableOpacity>
                </View>

                {/* Button Container at the Bottom */}
                <View style={styles.buttonContainer}>
                    {/* Login Button navigate to LoginScreen */}
                    <TouchableOpacity style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.enterButtonText}>Login</Text>
                    </TouchableOpacity>

                    {/* Sign up button navigate to SignupScreen */}
                    <TouchableOpacity style={styles.signUpButton}
                        onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.enterButtonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    textH1: {
        fontSize: 60,
        color: 'white',
        fontFamily: 'Jua Regular',
        textAlign: 'center',
        top: 10,
        paddingLeft: 100,
    },
    textH3: {
        fontSize: 30,
        color: 'black',
        fontFamily: 'Jua Regular',
        textAlign: 'center',
    },
    logo: {
        width: 90,
        height: 90,
        position: 'absolute',
        left: 30,
        top: 85,
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 50,
    },
    footer: {
        flex: 4,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'space-between', // Ensures form and buttons are spaced well
    },
    form: {
        marginTop: 20,
        paddingHorizontal: 10,
        flex: 1, // Take available space
    },
    input: {
        fontFamily: 'Jua Regular',
        fontSize: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#d9d9d9',
        padding: 5,
        paddingTop: 30,
    },
    enterButton: {
        backgroundColor: '#5ECFA6',
        paddingVertical: 15,
        marginHorizontal: 80,
        borderRadius: 30,
        marginTop: 30,
        alignItems: 'center',
    },
    enterButtonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Jua Regular',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20, // Add some vertical padding for spacing
        marginBottom: 20, // Aligns container with the bottom of the screen
    },
    loginButton: {
        backgroundColor: '#FD3B71',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: 'center',
    },
    signUpButton: {
        backgroundColor: '#FD3B71',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    }
});
