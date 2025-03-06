import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Headers";

const categories = [
  "Category 1", "Category 2", "Category 3", "Category 4",
  "Category 5", "Category 6", "Category 7", "Category 8",
  "Category 9", "Category 10", "Category 11", "Category 12",
  "Category 13", "Category 14", "Category 15", "Category 16",
  "Category 17", "Category 18", "Category 19", "Category 20",
];

const allergies = [
  "Peanuts", "Dairy", "Gluten", "Seafood",
  "Soy", "Eggs", "Nuts", "Shellfish",
  "Wheat", "Sesame", "Mustard", "Sulfites",
];

const distances = ["3 km", "5 km", "7 km", "10 km"];
const prices = ["<100฿", "100-200฿", "200-300฿", ">300฿"];

export default function PreferencesScreen() {
  const navigation = useNavigation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

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

  return (
    <View style={styles.container}>
      <Header title="EatsEase" />

      {/* Scrollable Content */}
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
              nestedScrollEnabled={true}  // อนุญาตให้ FlatList scroll ใน ScrollView
              style={{ maxHeight: 150 }}   // ✅ำหนด max height เพื่อให้ scroll ได้
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
            nestedScrollEnabled={true}  // ✅ ทำให้เลื่อนใน ScrollView ได้
            style={{ maxHeight: 150 }}   // ✅ ป้องกันการขยายไม่จำกัด
          />
        </View>

        {/* Distance Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ร้านอาหารใกล้ฉัน (สูงสุด 1)*</Text>
          <View style={styles.optionContainer}>
            {distances.map((distance) => (
              <TouchableOpacity
                key={distance}
                style={[styles.box, selectedDistance === distance && styles.selectedBox]}
                onPress={() => selectDistance(distance)}
              >
                <Text style={[styles.boxText, selectedDistance === distance && styles.selectedBoxText]}>
                  {distance}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ช่วงราคาของร้านอาหาร (สูงสุด 1)*</Text>
          <View style={styles.optionContainer}>
            {prices.map((price) => (
              <TouchableOpacity
                key={price}
                style={[styles.box, selectedPrice === price && styles.selectedBox]}
                onPress={() => selectPrice(price)}
              >
                <Text style={[styles.boxText, selectedPrice === price && styles.selectedBoxText]}>
                  {price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Buttons at Bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
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
    borderRadius: 8,
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

