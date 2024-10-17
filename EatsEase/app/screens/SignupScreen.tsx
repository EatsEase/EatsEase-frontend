import React from "react";
import { StyleSheet, Text, View, Image} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const SignupScreen = () => {
    return (
        <LinearGradient
            colors={['#FD3B71', '#FE5266', '#FE665D', '#FE5266', '#FD3B71']}
            locations={[0, 0.21, 0.48, 0.78, 1]}
            style={styles.container}
        >
            <View style={styles.header}>
                <Image source={require('../../app/image/logo.png')}
                resizeMode="contain" 
                style={styles.logo} 
                />
                <Text style={styles.textH1}>EatsEase</Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.textH3}>Welcome</Text>
            </View>
        </LinearGradient>
    );
}

export default SignupScreen;


const styles = StyleSheet.create({
    container: {
        flex: 0.7,
        backgroundColor: "black",
    },
    textH1: {
        fontSize: 50,
        color: 'white',
        fontFamily: 'Jua Regular',
        textAlign: 'center',
        top: 20,
        left: 40,
    },
    textH3: {
        fontSize: 30,
        color: 'black',
        fontFamily: 'Jua Regular',
        textAlign: 'center',

    },
    // logo on the left side of the header
    logo: {
        width: 90,
        height: 90,
        position: 'absolute',
        left: 20,
        top: 30,
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
});