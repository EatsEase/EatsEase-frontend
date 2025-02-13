import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MultiSelect from 'react-native-multi-selectbox'; // Correct import for multi-selectbox
import { xorBy } from 'lodash';

type Allergy = {
    id: number;
    name: string;
};

type SelectedAllergy = {
    item: string;
    id: string;
};

const allergies: Allergy[] = [
    { id: 1, name: "Dairy" },
    { id: 2, name: "Egg" },
    { id: 3, name: "Gluten" },
    { id: 4, name: "Peanut" },
    { id: 5, name: "Sesame" },
    { id: 6, name: "Shellfish" },
    { id: 7, name: "Soy" },
    { id: 8, name: "Tree Nut" },
    { id: 9, name: "Wheat" },
    { id: 10, name: "Fish" },
    { id: 11, name: "Sulfite" },
    { id: 12, name: "Molluscs" },
    { id: 13, name: "Mustard" },
    { id: 14, name: "Celery" },
    { id: 15, name: "Lupin" },
    { id: 16, name: "Crustaceans" },
    { id: 17, name: "Soybean" },
    { id: 18, name: "Coconut" },
    { id: 19, name: "Corn" },
    { id: 20, name: "Kiwi" },
    { id: 21, name: "Milk" },
    { id: 22, name: "Oat" },
    { id: 23, name: "Pineapple" },
    { id: 24, name: "Rice" },
    { id: 25, name: "Strawberry" },
    { id: 26, name: "Tomato" },
    { id: 27, name: "Yeast" },
    { id: 28, name: "Apple" },
    { id: 29, name: "Banana" },
    { id: 30, name: "Beef" },
    { id: 31, name: "Carrot" },
    { id: 32, name: "Chicken" },
    { id: 33, name: "Chocolate" },
    { id: 34, name: "Coffee" },
    { id: 35, name: "Garlic" },
    { id: 36, name: "Ginger" },
    { id: 37, name: "Honey" },
    { id: 38, name: "Lemon" },
    { id: 39, name: "Mango" },
    { id: 40, name: "Mushroom" },
    { id: 41, name: "Orange" },
    { id: 42, name: "Peach" },
    { id: 43, name: "Pepper" },
    { id: 44, name: "Pork" },
    { id: 45, name: "Potato" },
    { id: 46, name: "Sesame Seed" },
    { id: 47, name: "Sunflower" },
    { id: 48, name: "Vanilla" },
    { id: 49, name: "Watermelon" },
    { id: 50, name: "Zucchini" },
];

const AllergiesScreen = () => {
    const [selectedAllergies, setSelectedAllergies] = useState<SelectedAllergy[]>([]);

    const navigation = useNavigation();

    // Transform allergies array to match the expected format
    const transformedAllergies = allergies.map(allergy => ({
        item: allergy.name, // 'item' represents the displayed name
        id: allergy.id.toString(), // 'id' should be unique for each item
    }));

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

                {/* Allergy Grid */}
                <Text style={styles.textH5}>Do you have any allergies?</Text>
                <View style={styles.allergiesContainer}>

                    {/* MultiSelect for allergies */}
                    <MultiSelect
                        label="Allergies"
                        options={transformedAllergies}
                        selectedValues={selectedAllergies}
                        onMultiSelect={onMultiSelect} // Handle multi-select
                        onTapClose={onMultiSelect}  // Handle close of selected item
                        isMulti
                        fontFamily="Jua Regular"
                        inputPlaceholder="Search for allergies"


                    />
                </View>

                {/* Display selected allergies with a cross icon (X) */}
                {/* <View style={styles.selectedAllergiesContainer}>
                    {selectedAllergies.map((allergy, index) => (
                        <View key={index} style={styles.selectedAllergyItem}>
                            <Text style={styles.selectedAllergyText}>{allergy.item}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    // Handle removing the allergy item
                                    setSelectedAllergies(selectedAllergies.filter(item => item.id !== allergy.id));
                                }}
                            >
                                <Text style={{ color: 'red', fontSize: 20 }}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View> */}
                
                {/* Button Container */}
                <View style={styles.buttonContainer}>
                    {/* Next Button */}
                    <TouchableOpacity
                        style={styles.enterButton}
                        onPress={() => navigation.navigate('MainLayout')}
                    >
                        <Text style={styles.enterButtonText}>Next</Text>
                    </TouchableOpacity>

                    {/* Skip Button */}
                    <TouchableOpacity
                        style={styles.enterButton}
                        onPress={() => navigation.navigate('MainLayout')}
                    >
                        <Text style={styles.enterButtonText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );

    // Function to handle multi-select changes
    function onMultiSelect(item: SelectedAllergy) {
        setSelectedAllergies(xorBy(selectedAllergies, [item], 'id'));
    }
}

export default AllergiesScreen;

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
    allergiesContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    selectedAllergiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    selectedAllergyItem: {
        backgroundColor: '#FD3B71',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
    },
    selectedAllergyText: {
        color: '#FFFFFF',
        fontFamily: 'Jua Regular',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20, // Padding for bottom alignment
        marginBottom: 20, // Margin to align with the bottom
    },
    enterButton: {
        backgroundColor: '#5ECFA6',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: 'center',
    },
    enterButtonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Jua Regular',
    },
});
