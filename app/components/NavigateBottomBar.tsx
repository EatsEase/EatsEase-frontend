import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import YourListsScreen from '../screens/YourListsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PreferencesScreen from '../screens/PreferencesScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }: { children: any; onPress?: (e: GestureResponderEvent) => void }) => (
    <TouchableOpacity
        style={{
            top: -30,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow,
        }}
        onPress={onPress}
    >
        <View
            style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: 'white',
            }}
        >
            {children}
        </View>
    </TouchableOpacity>
);
const Tabs = () => {
    return (
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false, // This hides the label
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderRadius: 10,
                        height: 90,
                        ...styles.shadow,
                    },
                    // Add gradient to the tab bar
                    tabBarBackground: () => (
                        <LinearGradient
                            colors={['#FE665D', '#FE5266', '#FD3B71']}
                            locations={[0.44, 0.71, 1]}
                            style={styles.gradientBackground}
                        />
                    ),
                }}
            >
                <Tab.Screen 
                    name="HomeScreen"
                    component={HomeScreen} 
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.homeIconContainer}>
                                <Image 
                                    source={require("../../app/image/home.png")}
                                    style={styles.homeIconContainer} 
                                />
                                <Text style={styles.text}>Home</Text>
                            </View>
                        ),
                    }} 
                />
                <Tab.Screen 
                    name="YourListScreen"
                    component={YourListsScreen} 
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.iconContainer}>
                                <Image source={require('../image/eatsease.png')}
                                resizeMode='contain'
                                style={{
                                    width: 90,
                                    height: 90,
                                    top: 5,
                                }
                                } />
                            </View>
                        ),
                        tabBarButton: (props) => (
                            <CustomTabBarButton {...props} />
                        ),
                    }} 
                />
                <Tab.Screen 
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.profileIconContainer}>
                                <Image source={require('../image/profile.png')} style={[styles.icon, { width: 28, height: 28 }]} />
                                <Text style={styles.text}>Profile</Text>
                            </View>
                        ),
                    }} 
                />
            </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Jua Regular',
        fontWeight: 'bold',
    },
    shadow: {
        // shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        top: -5,
    },
    homeIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 5,
        width: 40,
        height: 32,
        resizeMode: 'contain',
        marginBottom: 6,
    },
    profileIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 5,
    },
    icon: {
        marginBottom: 4, 
    },
    gradientBackground: {
        flex: 1,
        // borderRadius: 10,
    },
});

export default Tabs;