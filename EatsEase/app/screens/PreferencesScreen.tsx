import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import Header from "../components/Headers";

export default function PreferencesScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  const distances = ["3 km", "5 km", "7 km", "10 km"];
  const priceMapping: { [key: string]: string } = {
    "฿": "<100",
    "฿฿": "100+",
    "฿฿฿": "250+",
    "฿฿฿฿": "500+",
    "฿฿฿฿฿": "1,000+",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = await SecureStore.getItemAsync('username');
        if (!storedUsername) {
          Alert.alert("Error", "No username found. Please log in again.");
          navigation.navigate("Login");
          return;
        }
        setUsername(storedUsername);

        // Fetch categories (food preferences)
        const categoryRes = await axios.get("https://eatsease-backend-1jbu.onrender.com/api/category/all");
        const categoryNames = categoryRes.data.map((item: { category_name: string }) => item.category_name);
        setCategories(categoryNames);

        // Fetch allergies
        const allergyRes = await axios.get("https://eatsease-backend-1jbu.onrender.com/api/allergies/all");
        const allergyNames = allergyRes.data.map((item: { allergy_name: string }) => item.allergy_name);
        setAllergies(allergyNames);

        // Fetch user profile
        const profileRes = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/${storedUsername}`);
        const userProfile = profileRes.data.userProfile;

        // Set user preferences
        setSelectedCategories(userProfile.food_preferences || []);
        setSelectedAllergies(userProfile.allergies || []);
        setSelectedDistance(userProfile.distance_in_km_preference ? `${userProfile.distance_in_km_preference} km` : null);
        setSelectedPrice(priceMapping[userProfile.price_range] || null);
      } catch (error) {
        console.error("Error fetching preferences:", error);
        Alert.alert("Error", "Failed to load preferences.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((item) => item !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const selectDistance = (distance: string) => {
    setSelectedDistance(distance);
  };

  const selectPrice = (price: string) => {
    setSelectedPrice(price);
  };

  const handleSave = async () => {
    if (!username) {
      Alert.alert("Error", "No username found. Please log in again.");
      return;
    }

    if (selectedCategories.length < 3) {
      Alert.alert("Error", "Please select at least 3 food categories.");
      return;
    }

    try {
      const requestBody = {
        food_preferences: selectedCategories,
        allergies: selectedAllergies,
        distance_in_km_preference: selectedDistance ? parseInt(selectedDistance) : 5,
        price_range: Object.keys(priceMapping).find((key) => priceMapping[key] === selectedPrice) || "฿",
      };

      console.log("Updating user preferences:", requestBody);

      await axios.put(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/edit/${username}`, requestBody);

      Alert.alert("Success", "Preferences updated successfully!");
      console.log("Preferences updated successfully", requestBody);
      navigation.navigate("MainLayout");
    } catch (error) {
      console.error("Error updating preferences:", error);
      Alert.alert("Error", "Could not update preferences. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="EatsEase" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FD3B71" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Categories Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ประเภทอาหาร (อย่างน้อย 3)*</Text>
            <FlatList
              data={categories}
              numColumns={3}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.box, selectedCategories.includes(item) && styles.selectedBox]}
                  onPress={() => toggleCategory(item)}
                >
                  <Text style={[styles.boxText, selectedCategories.includes(item) && styles.selectedBoxText]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              nestedScrollEnabled={true}
              style={{ maxHeight: 150 }}
            />
          </View>

          {/* Allergies Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>แพ้อาหาร (ถ้ามี)</Text>
            <FlatList
              data={allergies}
              numColumns={3}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.box, selectedAllergies.includes(item) && styles.selectedBox]}
                  onPress={() => toggleAllergy(item)}
                >
                  <Text style={[styles.boxText, selectedAllergies.includes(item) && styles.selectedBoxText]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              nestedScrollEnabled={true}
              style={{ maxHeight: 150 }}
            />
          </View>

          {/* Distance Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ร้านอาหารใกล้ฉัน (สูงสุด 1)*</Text>
            <View style={styles.optionContainer}>
              {distances.map((distance) => (
                <TouchableOpacity key={distance} style={[styles.box, selectedDistance === distance && styles.selectedBox]} onPress={() => selectDistance(distance)}>
                  <Text style={[styles.boxText, selectedDistance === distance && styles.selectedBoxText]}>{distance}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          {/* Price Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ช่วงราคาของร้านอาหาร (สูงสุด 1)*</Text>
            <View style={styles.optionContainer}>
              {Object.values(priceMapping).map((price) => (
                <TouchableOpacity key={price} style={[styles.box, selectedPrice === price && styles.selectedBox]} onPress={() => selectPrice(price)}>
                  <Text style={[styles.boxText, selectedPrice === price && styles.selectedBoxText]}>{price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    fontFamily: "Mali SemiBold",
  },
  box: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBox: {
    backgroundColor: "#FD3B71",
    borderColor: "#FF6B6B",
  },
  boxText: {
    fontFamily: "Mali Regular",
    fontSize: 14,
    color: "#555",
  },
  selectedBoxText: {
    color: "white",
    fontFamily: "Mali SemiBold",
  },
  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    marginBottom: 15, // ขยับขึ้นจากขอบล่าง
  },  
  backButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "gray",
    borderRadius: 25,
    marginRight: 10,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#5ECFA6",
    borderRadius: 25,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Mali SemiBold",
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

