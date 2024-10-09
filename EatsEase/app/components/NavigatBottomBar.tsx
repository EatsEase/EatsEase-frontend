import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen'
import YourListsScreen from '../screens/YourListsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <LinearGradient
            colors={['#FFFFFF', '#FE665D', '#FE5266', '#FD3B71']} // Gradient colors
            locations={[0, 0.44, 0.71, 1]} // Gradient stops
            style={styles.gradientContainer}
        >
            <Tab.Navigator
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 25,
                        left: 20,
                        right: 20,
                        backgroundColor: 'transparent', // Set background to transparent
                        borderRadius: 15,
                        height: 90,
                        ...styles.shadow,
                    },
                }}
            >
                <Tab.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.iconContainer}>
                                {/* <Image source={require('')} /> */}
                                <Text>Home</Text>
                            </View>
                        ),
                    }} 
                />
                <Tab.Screen 
                    name="Search" 
                    component={YourListsScreen} 
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.iconContainer}>
                                {/* <Image source={require('')} /> */}
                                <Text>Search</Text>
                            </View>
                        ),
                    }} 
                />
                <Tab.Screen 
                    name="Profile" 
                    component={ProfileScreen} 
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.iconContainer}>
                                {/* <Image source={require('')} /> */}
                                <Text>Profile</Text>
                            </View>
                        ),
                    }} 
                />
            </Tab.Navigator>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
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
        top: 10,
    },
    gradientContainer: {
        flex: 1,
    },
});

export default Tabs;
