import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Headers";
import Tabs from "../components/NavigateBottomBar";

const categories = [
  "Category 1",
  "Category 2",
  "Category 3",
  "Category 4",
  "Category 5",
  "Category 6",
  "Category 7",
  "Category 8",
  "Category 9",
  "Category 10",
  "Category 11",
  "Category 12",
];

const distances = ["3 km", "5 km", "7 km", "10 km"];

const prices = ["<100฿", "100-200฿", "200-300฿", ">300฿"];

export default function PreferencesScreen() {
  const navigation = useNavigation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category]);
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

      {/* Categories Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>ประเภทอาหาร (อย่างน้อย 3)</Text>
        <FlatList
          data={categories}
          numColumns={3}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryBox,
                selectedCategories.includes(item) && styles.categorySelected,
              ]}
              onPress={() => toggleCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategories.includes(item) && styles.categoryTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Distance Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>ร้านอาหารใกล้ฉัน (สูงสุด 1)</Text>
        <View style={styles.distanceContainer}>
          {distances.map((distance) => (
            <TouchableOpacity
              key={distance}
              style={[
                styles.distanceBox,
                selectedDistance === distance && styles.distanceSelected,
              ]}
              onPress={() => selectDistance(distance)}
            >
              <Text
                style={[
                  styles.distanceText,
                  selectedDistance === distance && styles.distanceTextSelected,
                ]}
              >
                {distance}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>ช่วงราคาของร้านอาหาร (สูงสุด 1)</Text>
        <View style={styles.priceContainer}>
          {prices.map((price) => (
            <TouchableOpacity
              key={price}
              style={[
                styles.priceBox,
                selectedPrice === price && styles.priceSelected,
              ]}
              onPress={() => selectPrice(price)}
            >
              <Text
                style={[
                  styles.priceText,
                  selectedPrice === price && styles.priceTextSelected,
                ]}
              >
                {price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      {/* <Tabs /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  categoriesContainer: {
    paddingBottom: 10,
  },
  categoryBox: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categorySelected: {
    backgroundColor: "#FD3B71",
    borderColor: "#FF6B6B",
  },
  categoryText: {
    fontFamily: "Mali Regular",
    fontSize: 14,
    color: "#555",
  },
  categoryTextSelected: {
    color: "white",
    fontFamily: "Mali SemiBold",
  },
  distanceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  distanceBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  distanceSelected: {
    backgroundColor: "#FD3B71",
    borderColor: "white",
  },
  distanceText: {
    fontFamily: "Mali Regular",
    fontSize: 14,
    color: "#555",
  },
  distanceTextSelected: {
    fontFamily: "Mali SemiBold",
    color: "white",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  priceBox: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  priceSelected: {
    backgroundColor: "#FD3B71",
    borderColor: "white",
  },
  priceText: {
    fontFamily: "Mali Regular",
    fontSize: 14,
    color: "#555",
  },
  priceTextSelected: {
    fontFamily: "Mali SemiBold",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
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
