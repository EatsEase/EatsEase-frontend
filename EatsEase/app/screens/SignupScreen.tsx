import React from "react";
import { StyleSheet, Text, View, Image, TextInput} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Dropdown from "../components/DropDown";

const SignupScreen = () => {
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
                    <TextInput placeholder="Enter your email" style={styles.input} />
                    <TextInput placeholder="Enter your username" style={styles.input} />
                    <TextInput placeholder="Enter your password" style={styles.input} />
                    {/* drop down to select Gender */}
                    <Dropdown />

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
        top: 15,
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
        left: 30,
        top: 85,
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
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
    },
    form: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    input: {
        fontFamily: 'Jua Regular',
        fontSize: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#d9d9d9',
        padding: 5,
        paddingTop: 30,
    },
});