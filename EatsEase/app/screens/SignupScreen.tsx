import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Dropdown from "../components/DropDown";
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../services/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignupScreen = () => {
    const navigation = useNavigation();

    // State variables for form inputs and error
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setError(''); // Reset error on each attempt
        if (!email || !username || !password || !gender || !birthdate) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
    
        setLoading(true); // Start loading state

        console.log(birthdate);
        if (typeof birthdate === 'string') {
            console.log('Converting birthdate to Date object...');
        }
    
        try {
            // ทำ Signup ก่อน
            const signupResponse = await axiosInstance.post('https://eatsease-backend-1jbu.onrender.com/api/user/signup', {
                user_name: username,
                user_email: email,
                user_password: password,
                gender: gender,
                birthdate: birthdate,
            });
        
            console.log("Signup response:", signupResponse.data);
    
            // ถ้าสมัครเสร็จ ให้ Login ทันทีเพื่อรับ Token
            const loginResponse = await axiosInstance.post('https://eatsease-backend-1jbu.onrender.com/api/user/login', {
                user_name: username,
                user_password: password,
            });
    
            console.log("Login response:", loginResponse.data);
    
            if (loginResponse.data) {
                await AsyncStorage.setItem('token', loginResponse.data.token);
                await AsyncStorage.setItem('username', loginResponse.data.user);
                
                const savedUsername = await AsyncStorage.getItem('username');
                const savedToken = await AsyncStorage.getItem('token');
                if (savedToken && savedUsername) {
                    console.log('Signup and login successful:', loginResponse.data);
                    alert('สมัครสมาชิกและเข้าสู่ระบบสำเร็จ');
                    navigation.navigate('FirstPreferences'); // Navigate to next screen
                } else {
                    setError('Token and Username not saved');
                    alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
                }
            } else {
                setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
                alert('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
            }
    
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่');
            alert('เกิดข้อผิดพลาดในการสมัครสมาชิก');
            console.error('Signup error:', err);
            // Log body of error response
            console.error('Signup error response:', err.response?.data);
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    // Handle guest mode, bypassing the signup process
    const handleGuestMode = () => {
        // Navigate to the next screen without authentication
        navigation.navigate('FirstPreferences');
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
                    {/* Form inputs */}
                    <TextInput 
                        placeholder="อีเมล" 
                        style={[styles.input, error && !email && styles.inputError]} 
                        value={email}
                        onChangeText={setEmail} 
                    />
                    {error && !email && <Text style={styles.error}>กรุณากรอกอีเมล</Text>}

                    <TextInput 
                        placeholder="ชื่อบัญชี" 
                        style={[styles.input, error && !username && styles.inputError]} 
                        value={username}
                        onChangeText={setUsername} 
                    />
                    {error && !username && <Text style={styles.error}>กรุณากรอกชื่อบัญชี</Text>}

                    <TextInput 
                        placeholder="รหัสผ่าน" 
                        style={[styles.input, error && !password && styles.inputError]} 
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword} 
                    />
                    {error && !password && <Text style={styles.error}>กรุณากรอกรหัสผ่าน</Text>}

                    {/* Dropdown for Gender and Birthdate */}
                    <Dropdown 
                        selectedGender={gender} 
                        setSelectedGender={setGender} 
                        selectedBirthdate={birthdate} 
                        setSelectedBirthdate={setBirthdate} 
                    />

                    {/* Error message */}
                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    {/* Signup Button */}
                    <TouchableOpacity style={styles.enterButton} onPress={handleSignup} disabled={loading}>
                        <Text style={styles.enterButtonText}>{loading ? 'กำลังโหลด...' : 'ต่อไป'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Button Container at the Bottom */}
                <View style={styles.buttonContainer}>
                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.enterButtonText}>เข้าสู่ระบบ</Text>
                    </TouchableOpacity>

                    {/* Sign Up Button (Already on the screen, but just as a fallback) */}
                    {/* <TouchableOpacity style={styles.signUpButton}
                        onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.enterButtonText}>ลงทะเบียน</Text>
                    </TouchableOpacity> */}

                    {/* Guest Mode Button */}
                    <TouchableOpacity style={styles.guestButton} onPress={handleGuestMode}>
                        <Text style={styles.enterButtonText}>โหมดเยี่ยมชม</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

export default SignupScreen;

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
        marginTop: 5,
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
    inputError: {
        fontFamily: 'Mali-Bold',
        borderBottomColor: 'red',
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 0,
    },
    checkbox: {
        height: 22,
        width: 22,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxText: {
        fontSize: 18,
        fontFamily: 'Mali-Bold',
        marginLeft: 10,
        color: 'gray',
    },
    checkboxView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
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
        height: 25,
        padding: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20, // Padding for bottom alignment
        marginBottom: 20, // Margin to align with the bottom
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
    guestButton: {
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
