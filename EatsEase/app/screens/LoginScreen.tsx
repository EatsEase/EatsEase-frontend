import React from "react";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
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
                    <TextInput placeholder="Enter your email or username" style={styles.input} />
                    <TextInput placeholder="Enter your password" style={styles.input} />

                    {/* Enter Button */}
                    <TouchableOpacity style={styles.enterButton}>
                        <Text style={styles.enterButtonText}>Enter</Text>
                    </TouchableOpacity>
                </View>

                {/* Button Container at the Bottom */}
                <View style={styles.buttonContainer}>
                    {/* Login Button navigate to LoginScreen */}
                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={styles.enterButtonText}>Login</Text>
                    </TouchableOpacity>

                    {/* Sign up button navigate to SignupScreen */}
                    <TouchableOpacity style={styles.signUpButton}>
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
});
