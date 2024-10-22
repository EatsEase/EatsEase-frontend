import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const categories = [
  "Fast Food", "Vegan", "Dessert", "BBQ", "Sushi",
  "Pizza", "Burgers", "Seafood", "Salad", "Beverages",
  "Pasta", "Grill", "Breakfast", "Steak", "Chicken"
];

const FirstPreferences = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prevState => 
            prevState.includes(category)
                ? prevState.filter(item => item !== category) // Deselect if selected
                : [...prevState, category] // Add if not selected
        );
    };

    const navigation = useNavigation();

    const handleSubmit = () => {
        if (selectedCategories.length >= 3) {
            // Access the selected data here
            Alert.alert("Selected Categories", JSON.stringify(selectedCategories));
            navigation.navigate('MainLayout'); 
        } else {
            Alert.alert("Error", "Please select at least 3 categories.");
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
                <Text style={styles.textH3}>Welcome</Text>
                <Text style={styles.textH5}>Select at least 3 categories</Text>

                {/* Category Grid */}
                <View style={styles.gridContainer}>
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
                </View>

                {/* show selectedCategories */}
                {/* <Text style={styles.textH5}>
                    Selected Categories: {selectedCategories.join(", ")}
                </Text> */}

                {/* "Let's go" Button */}
                <TouchableOpacity
                    // Disable if less than 3 are selected and button color changes
                    style={[
                        styles.enterButton,
                        selectedCategories.length < 3 && { backgroundColor: 'gray' }
                    ]}
                    onPress={handleSubmit}
                    disabled={selectedCategories.length < 3}

                >
                    <Text style={styles.enterButtonText}>Let's go</Text>
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
        fontSize: 30,
        color: 'black',
        fontFamily: 'Jua Regular',
        textAlign: 'center',
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
        backgroundColor: '#FD3B71', // Highlight selected category
    },
    categoryText: {
        color: 'black',
        fontFamily: 'Jua Regular',
        textAlign: 'center',
    },
    selectedCategoryText: {
        color: 'white', // Change text color to white when selected
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
});
