import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { checkToken } from "../services/checkToken";

const FirstPreferences = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const initializeUserProfile = async () => {
            try {
                // Get the stored username correctly
                const storedUsername = await SecureStore.getItemAsync('username');
                if (!storedUsername) {
                    Alert.alert("Error", "No username found. Please log in again.");
                    navigation.navigate("Login");
                    return;
                }
                setUsername(storedUsername); // Store username in state

                // Check if user profile exists
                const response = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/${storedUsername}`,
                {
                    headers: {
                        'authorization': token,
                        'Content-Type': 'application/json',
                    }
                });

                console.log("User Profile Data:", response.data);

                // Set existing food preferences
                setSelectedCategories(response.data.userProfile.food_preferences || []);
            } catch (error) {
                console.error("Error fetching user profile:", error);

            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://eatsease-backend-1jbu.onrender.com/api/category/all', { headers: {
                    'authorization': token,
                    'Content-Type': 'application/json',
                }});
                const categoryNames = response.data.map((item: { category_name: string }) => item.category_name);
                setCategories(categoryNames);
            } catch (error) {
                console.error("Error fetching categories:", error);
                Alert.alert("Error", "Failed to fetch categories.");
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
                const logout = await axios.post(`https://eatsease-backend-1jbu.onrender.com/api/user/logout`, {'token':token})
                console.log(logout)
                navigation.navigate("Login")
                return;
            }
            if (check == true){
                initializeUserProfile();
                fetchCategories();
            }
        }

        verifyToken();
    }, []);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prevState =>
            prevState.includes(category)
                ? prevState.filter(item => item !== category) // Deselect if selected
                : [...prevState, category] // Add if not selected
        );
    };

    const handleSubmit = async () => {
        if (!username) {
            Alert.alert("Error", "No username found. Please log in again.");
            return;
        }

        if (selectedCategories.length < 3) {
            Alert.alert("Error", "Please select at least 3 food categories.");
            return;
        }

        try {
            // PUT request to update food_preferences
            const response = await axios.put(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/edit/${username}`, {
                food_preferences: selectedCategories, // Update food preferences
            },
            {
                headers:{
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );

            if (response.status === 200) {
                Alert.alert("Success", "Preferences updated successfully!");
                console.log("Preferences updated successfully:", response.data);
                navigation.navigate('AllergiesScreen'); // Navigate to the next screen
            } else {
                throw new Error("Failed to update preferences");
            }
        } catch (error) {
            console.error("Error updating preferences:", error);
            Alert.alert("Error", "Could not update preferences. Please try again.");
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
                <Text style={styles.textH3}>เลือกอาหารที่ชอบอย่างน้อย 3 ประเภท</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#FD3B71" />
                ) : (
                    <ScrollView contentContainerStyle={styles.gridContainer}>
                        {categories.map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.categoryBox,
                                    selectedCategories.includes(category) && styles.selectedCategoryBox
                                ]}
                                onPress={() => toggleCategory(category)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategories.includes(category) && styles.selectedCategoryText
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* "Next" Button */}
                <TouchableOpacity
                    style={[
                        styles.enterButton,
                        selectedCategories.length < 3 && { backgroundColor: 'gray' }
                    ]}
                    onPress={handleSubmit}
                    disabled={selectedCategories.length < 3}
                >
                    <Text style={styles.enterButtonText}>ต่อไป</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

export default FirstPreferences;


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
        fontSize: 20,
        color: 'black',
        fontFamily: 'Mali-Bold',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 40,
        height: 20,
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
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 25,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        minWidth: 100,
        maxWidth: '45%',
    },
    selectedCategoryBox: {
        backgroundColor: '#FD3B71',
    },
    categoryText: {
        color: 'black',
        fontFamily: 'Mali-Bold',
        textAlign: 'center',
        flexWrap: 'wrap',
        minWidth: 80,
        maxWidth: '100%',
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
});
