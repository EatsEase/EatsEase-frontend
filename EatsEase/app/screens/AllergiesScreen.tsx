import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const allergies = [
  "Dairy", "Egg", "Gluten", "Peanut", "Sesame", "Shellfish", "Soy", "Tree Nut", 
  "Wheat", "Fish", "Sulfite", "Molluscs", "Mustard", "Celery", "Lupin", "Crustaceans", 
  "Soybean", "Coconut", "Corn", "Kiwi", "Milk", "Oat", "Pineapple", "Rice", "Strawberry", 
  "Tomato", "Yeast", "Apple", "Banana", "Beef", "Carrot", "Chicken", "Chocolate", "Coffee", 
  "Garlic", "Ginger", "Honey", "Lemon", "Mango", "Mushroom", "Orange", "Peach", "Pepper", 
  "Pork", "Potato", "Sesame Seed", "Sunflower", "Vanilla", "Watermelon", "Zucchini"
];

const AllergiesScreen = () => {
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

    const toggleAllergy = (allergy: string) => {
        setSelectedAllergies(prevState => 
            prevState.includes(allergy)
                ? prevState.filter(item => item !== allergy) // Deselect if selected
                : [...prevState, allergy] // Add if not selected
        );
    };

    const navigation = useNavigation();

    const handleSubmit = () => {
        // Show selected allergies (if any)
        Alert.alert("Selected Allergies", JSON.stringify(selectedAllergies));
        navigation.navigate('MainLayout'); // Navigate to MainLayout screen
    };

    const handleSkip = () => {
        // Proceed to the next screen without selecting allergies
        navigation.navigate('MainLayout'); // Navigate to MainLayout screen
    };

    const isSkipDisabled = selectedAllergies.length > 0; // Skip is disabled when any allergy is selected
    const isNextDisabled = selectedAllergies.length === 0; // Next is disabled when no allergy is selected

    return (
        <LinearGradient
            colors={['#FD3B71', '#FE5266', '#FE665D', '#FE5266', '#FD3B71']}
            locations={[0, 0.21, 0.48, 0.78, 1]}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../../app/image/logo.png')} resizeMode="contain" style={styles.logo} />
                <Text style={styles.textH1}>EatsEase</Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.textH3}>แพ้อาหารประเภทไหนมั้ย?</Text>

                {/* Allergy Grid - wrapped in ScrollView */}
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
                </ScrollView>

                {/* "Next" Button */}
                <TouchableOpacity
                    style={[
                        styles.enterButton,
                        isNextDisabled && { backgroundColor: '#E6E6E6' } // Disabled when no allergies are selected
                    ]}
                    onPress={handleSubmit}
                    disabled={isNextDisabled}
                >
                    <Text style={styles.enterButtonText}>Next</Text>
                </TouchableOpacity>

                {/* "Skip" Button */}
                <TouchableOpacity
                    style={[
                        styles.skipButton,
                        isSkipDisabled && { backgroundColor: '#E6E6E6' } // Disabled when allergies are selected
                    ]}
                    onPress={handleSkip}
                    disabled={isSkipDisabled}
                >
                    <Text style={styles.skipButtonText}>Skip</Text>
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
    textH5: {
        fontSize: 16,
        color: 'gray',
        fontFamily: 'Jua Regular',
        textAlign: 'center',
        marginTop: 20,
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
        paddingBottom: 20, // Optional, add padding at the bottom for smoother scrolling
    },
    categoryBox: {
        backgroundColor: '#d9d9d9',
        padding: 15,
        borderRadius: 10,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis: '28%', // Flexible width to adjust based on screen size
        minWidth: 100, // Minimum width for long text
        flexShrink: 1, // Allow shrinking for longer text
    },
    selectedCategoryBox: {
        backgroundColor: '#FD3B71',
    },
    categoryText: {
        color: 'black',
        fontFamily: 'Jua Regular',
        textAlign: 'center',
    },
    selectedCategoryText: {
        color: 'white',
    },
    enterButton: {
        backgroundColor: '#5ECFA6',
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 30,
        alignItems: 'center',
    },
    enterButtonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Jua Regular',
    },
    skipButton: {
        backgroundColor: '#5ECFA6', // Default green
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 10,
        alignItems: 'center',
    },
    skipButtonText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Jua Regular',
    },
});
