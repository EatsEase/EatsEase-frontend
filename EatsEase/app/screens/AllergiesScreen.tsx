import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import allergiesScreenData from "../services/allergiesScreendata"; // Import data function
import { checkToken } from "../services/checkToken";

const AllergiesScreen = () => {
    const [allergies, setAllergies] = useState<string[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const initializeUserProfile = async () => {
            try {
                // Retrieve username from AsyncStorage
                const storedUsername = await SecureStore.getItemAsync('username');
                if (!storedUsername) {
                    Alert.alert("Error", "No username found. Please log in again.");
                    navigation.navigate("Login");
                    return;
                }
                setUsername(storedUsername);

                // Fetch user profile to get existing allergies
                const response = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/${storedUsername}`,
                    {
                        headers: {
                            'authorization': token,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log("User Profile Data:", response.data);

                setSelectedAllergies(response.data.userProfile.allergies || []);
            } catch (error) {
                console.error("Error fetching user profile:", error);

                if (error.response?.status === 404) {
                    console.log("User profile not found. Creating new profile...");
                    return;
                }

                Alert.alert("Error", "Failed to fetch user profile.");
            }
        };

        const fetchAllergies = async () => {
            setLoading(true);
            try {
                const data = await allergiesScreenData(token); // Fetch allergy categories from API
                const allergyNames = data.map((item: { allergy_name: string }) => item.allergy_name);
                setAllergies(allergyNames);
            } catch (error) {
                console.error("Error fetching allergies:", error);
                Alert.alert("Error", "Failed to fetch allergies.");
            } finally {
                setLoading(false);
            }
        };
        
        const verifyToken = async () => {
            const getToken = await SecureStore.getItemAsync('token');
            if (!getToken){
                Alert.alert("Error", "No token found. Please log in again.");
                navigation.navigate("Login");
                return;
            }
            setToken(getToken)
            const check = await checkToken(getToken)
            if (check == false){
                Alert.alert("Error", "Token is expired. Please log in again.")
                const logout = await axios.post(`https://eatsease-backend-1jbu.onrender.com/api/user/logout`, {'token':getToken})
                console.log(logout)
                navigation.navigate("Login")
                return;
            }
            if (check == true){
                initializeUserProfile();
                fetchAllergies();
            }
        }

        verifyToken();
    }, []);

    const toggleAllergy = (allergy: string) => {
        setSelectedAllergies(prevState =>
            prevState.includes(allergy)
                ? prevState.filter(item => item !== allergy) // Deselect if selected
                : [...prevState, allergy] // Add if not selected
        );
    };

    const handleSubmit = async () => {
        if (!username) {
            Alert.alert("Error", "No username found. Please log in again.");
            return;
        }

        try {
            // First, get full user profile (so we don't overwrite other fields)
            const userProfileResponse = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/${username}`,
                {
                    headers: {
                        'authorization': token,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const userId = userProfileResponse.data.userProfile._id; // Extract `_id`
            
            if (!userId) {
                throw new Error("User ID not found in profile response.");
            }

            console.log("Updating allergies for user ID:", userId);

            // Send `PUT` request with updated allergies
            const response = await axios.put(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/edit/${username}`, {
                allergies: selectedAllergies,  // Update allergies
                food_preferences: userProfileResponse.data.userProfile.food_preferences, 
                distance_in_km_preference: userProfileResponse.data.userProfile.distance_in_km_preference,
                price_range: userProfileResponse.data.userProfile.price_range,
                liked_menu: userProfileResponse.data.userProfile.liked_menu,
                disliked_menu: userProfileResponse.data.userProfile.disliked_menu,
            },
            {
                headers:{
                    'authorization': token,
                    'Content-Type': 'application/json',
                }
            }
        );

            if (response.status === 200) {
                Alert.alert("Success", "Allergies updated successfully!");
                console.log("Allergies updated successfully!", response.data);
                navigation.navigate('MainLayout', { screen: 'HomeScreen' });
            } else {
                throw new Error("Failed to update allergies");
            }
        } catch (error) {
            console.error("Error updating allergies:", error);
            Alert.alert("Error", "Could not update allergies. Please try again.");
        }
    };

    const handleSkip = () => {
        navigation.navigate('MainLayout', { screen: 'HomeScreen' }); // Skip without updating allergies
    };

    return (
        <LinearGradient
            colors={['#FD3B71', '#FE5266', '#FE665D', '#FE5266', '#FD3B71']}
            locations={[0, 0.21, 0.48, 0.78, 1]}
            style={styles.container}
        >
            <View style={styles.header}>
                <Image source={require('../../app/image/logo.png')} resizeMode="contain" style={styles.logo} />
                <Text style={styles.textH1}>EatsEase</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.textH3}>แพ้อาหารประเภทไหนมั้ย?</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#FD3B71" />
                ) : (
                    <ScrollView contentContainerStyle={styles.gridContainer}>
                        {allergies.map((allergy, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.categoryBox,
                                    selectedAllergies.includes(allergy) && styles.selectedCategoryBox
                                ]}
                                onPress={() => toggleAllergy(allergy)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedAllergies.includes(allergy) && styles.selectedCategoryText
                                ]}>
                                    {allergy}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <Text style={styles.textAdd}>คุณสามารถตั้งค่าได้ในภายหลัง!</Text>
                    </ScrollView>
                )}

                <TouchableOpacity
                    style={[
                        styles.enterButton,
                        selectedAllergies.length === 0 && { backgroundColor: '#E6E6E6' }
                    ]}
                    onPress={handleSubmit}
                    disabled={selectedAllergies.length === 0}
                >
                    <Text style={styles.enterButtonText}>บันทึก</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkip}
                >
                    <Text style={styles.skipButtonText}>ข้ามไปก่อน</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default AllergiesScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    textH1: {
        fontSize: 60,
        color: 'white',
        fontFamily: 'Mali-Bold',
        textAlign: 'center',
        top: 10,
        paddingLeft: 100,
    },
    textH3: {
        fontSize: 25,
        color: 'black',
        fontFamily: 'Mali-Bold',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 0,
        height: 50,
    },
    textAdd: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Mali-Regular',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 0,
        height: 50,
        marginTop: 30,
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
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 20,
    },
    categoryBox: {
        backgroundColor: '#d9d9d9',
        padding: 15,
        borderRadius: 25,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis: '28%',
        minWidth: 100,
        flexShrink: 1,
    },
    selectedCategoryBox: {
        backgroundColor: '#FD3B71',
    },
    categoryText: {
        color: 'black',
        fontFamily: 'Mali-Bold',
        textAlign: 'center',
        paddingVertical: 4,
    },
    selectedCategoryText: {
        color: 'white',
    },
    enterButton: {
        backgroundColor: '#5ECFA6',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 30,
        alignItems: 'center',
    },
    enterButtonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Mali-Bold',
    },
    skipButton: {
        backgroundColor: '#5ECFA6',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 10,
        alignItems: 'center',
    },
    skipButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Mali-Bold',
    },
});
