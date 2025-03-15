import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axiosInstance from '../services/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const navigation = useNavigation();

    // State variables for managing form inputs and errors
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleLogin = async () => {
        try {
            console.log("🔑 Logging in...");
            
            // ✅ ล้างค่าเก่าก่อน Login ใหม่ (สำคัญ!)
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('username');
    
            const response = await axiosInstance.post('https://eatsease-backend-1jbu.onrender.com/api/user/login', {
                user_name: username,
                user_password: password
            });
    
            console.log("✅ Login response:", response.data);
    
            if (response.data && response.data.token) {
                // ✅ บันทึก Token และ Username ใหม่ลง AsyncStorage
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('username', response.data.user);
    
                // ✅ ตรวจสอบว่าบันทึกสำเร็จหรือไม่
                const savedToken = await AsyncStorage.getItem('token');
                const savedUsername = await AsyncStorage.getItem('username');
    
                if (savedToken && savedUsername) {
                    console.log('🎉 Login successful:', { savedToken, savedUsername });
                    alert(`เข้าสู่ระบบสำเร็จ! \nบัญชีที่ใช้งาน: ${savedUsername}`);
                    navigation.navigate('MainLayout'); // ไปหน้า Main
                } else {
                    console.error('❌ Token or Username not saved');
                    alert('เกิดข้อผิดพลาดในการบันทึก Token กรุณาลองใหม่');
                }
            } else {
                console.error('❌ Login failed: No token received');
                alert('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
            }
    
        } catch (err) {
            console.error('❌ Login error:', err);
            console.error('📜 Error response:', err.response?.data);
            alert('เข้าสู่ระบบล้มเหลว กรุณาตรวจสอบบัญชีของคุณ');
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
                <Text style={styles.textH3}>ยินดีต้อนรับ</Text>
                <View style={styles.form}>
                    <TextInput 
                        placeholder="ชื่อบัญชีผู้ใช้" 
                        style={styles.input} 
                        value={username}
                        onChangeText={setUsername} 
                    />
                    <TextInput 
                        placeholder="รหัสผ่าน" 
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword} 
                    />

                    {/* Error message */}
                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    {/* Enter Button */}
                    <TouchableOpacity style={styles.enterButton} onPress={handleLogin}>
                        <Text style={styles.enterButtonText}>ต่อไป</Text>
                    </TouchableOpacity>
                </View>

                {/* Button Container at the Bottom */}
                <View style={styles.buttonContainer}>
                    {/* Login Button navigate to LoginScreen */}
                    <TouchableOpacity style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.enterButtonText}>เข้าสู่ระบบ</Text>
                    </TouchableOpacity>

                    {/* Sign up button navigate to SignupScreen */}
                    <TouchableOpacity style={styles.signUpButton}
                        onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.enterButtonText}>ลงทะเบียน</Text>
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
        fontFamily: 'Mali-Bold',
        textAlign: 'center',
        paddingTop: 0,
        paddingBottom: 0,
        height: 50,
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
        marginTop: 10,
        paddingHorizontal: 10,
        flex: 1, // Take available space
    },
    input: {
        fontFamily: 'Mali-Bold',
        fontSize: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#d9d9d9',
        padding: 5,
        paddingTop: 30,
        paddingBottom: 0,
        height: 60,
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
        fontSize: 16,
        fontFamily: 'Mali-Bold',
        height: 30,
        padding: 5,
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
