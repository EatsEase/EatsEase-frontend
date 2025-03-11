import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';

interface Restaurant {
  id: string;
  restaurant_name: string;
  lat: number;
  long: number;
  restaurant_location: string;
}

const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{ menu_name: string; restaurant_name: string; restaurant_location: string; restaurant_location_link: string; date: string } | null>(null);

  useEffect(() => {
    fetchUsernameAndRestaurants();
  }, []);

  const fetchUsernameAndRestaurants = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (!storedUsername) return;
      setUsername(storedUsername);
      fetchRestaurants(storedUsername);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const fetchRestaurants = async (username: string) => {
    try {
      const response = await axios.get(
        `https://eatsease-backend-1jbu.onrender.com/api/restaurant/query/${username}`
      );
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleConfirmSelection = async () => {
    if (!selectedRestaurant || !username) return;

    try {
      const response = await axios.post(
        `https://eatsease-backend-1jbu.onrender.com/api/userProfile/finalized/restaurant/${username}`,
        { finalized_restaurant: selectedRestaurant.restaurant_name }
      );

      console.log("✅ Finalized Response:", response.data);

        const latestHistory = response.data;

        const updatedConfirmedData = {
          menu_name: latestHistory.menu_name,
          restaurant_name: latestHistory.restaurant.restaurant_name,
          restaurant_location: latestHistory.restaurant.restaurant_location,
          restaurant_location_link: latestHistory.restaurant.restaurant_location_link,
          date: latestHistory.date
        };

        setConfirmedData(updatedConfirmedData);
        setModalVisible(true);

    } catch (error) {
      console.error("❌ Error finalizing restaurant:", error.response?.data || error);
    }
  };

  const handleCloseSuccessModal = () => {
    setModalVisible(false);
    navigation.navigate("HomeScreen");
  };

  const openMapLink = () => {
    if (confirmedData?.restaurant_location_link) {
      Linking.openURL(confirmedData.restaurant_location_link);
    } else {
      Alert.alert("Error", "ไม่พบลิงก์แผนที่สำหรับร้านอาหารนี้");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#5ECFA6" style={styles.loadingIndicator} />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: restaurants.length > 0 ? restaurants[0].lat : 13.736717,
            longitude: restaurants.length > 0 ? restaurants[0].long : 100.523186,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {restaurants.map((restaurant, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: restaurant.lat, longitude: restaurant.long }}
              onPress={() => handleSelectRestaurant(restaurant)}
            >
              <Image 
                source={require('../../app/image/restaurant_marker.png')}
                style={{ width: 40, height: 40, resizeMode: 'contain' }}
              />
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{restaurant.restaurant_name}</Text>
                  <Text style={styles.calloutText}>{restaurant.restaurant_location}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      {/* 🔹 ปุ่ม Confirm */}
      <TouchableOpacity 
        style={[
          styles.confirmButton, 
          !selectedRestaurant && styles.disabledButton 
        ]}
        onPress={handleConfirmSelection}
        disabled={!selectedRestaurant} 
      >
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>

      {/* 🎉 Popup Modal เมื่อกด Confirm */}
      <Modal isVisible={isModalVisible} animationIn="zoomIn" animationOut="zoomOut">
        <View style={styles.modalContent}>
          <Image source={require('../../app/image/celebration.png')} style={styles.celebrationImage} />
          <Text style={styles.modalTitle}>ยินดีด้วย! {"\n"} คุณได้อาหารสำหรับวันนี้แล้ว!</Text>
          {confirmedData && confirmedData.menu_name && (
            <Text style={styles.modalText}>
              🍽 เมนูวันนี้: {confirmedData.menu_name}{"\n"} {"\n"}
              📍 ร้าน: {confirmedData.restaurant_name}{"\n"} {"\n"}
              🏠 สถานที่: {confirmedData.restaurant_location} {"\n"} {"\n"}
            </Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.mapButton} onPress={openMapLink}>
              <Text style={styles.buttonText}>ไปยังแผนที่</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseSuccessModal}>
              <Text style={styles.buttonText}>กลับไปหน้าหลัก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: { padding: 10, backgroundColor: "white", borderRadius: 10, width: 180 },
  calloutTitle: { fontWeight: "bold", fontSize: 16 },
  calloutText: { fontSize: 14, color: "gray" },
  confirmButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#5ECFA6",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  disabledButton: { backgroundColor: "gray" },
  confirmButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  loadingIndicator: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 15, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  mapButton: { backgroundColor: "#3B82F6", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  closeButton: { backgroundColor: "#5ECFA6", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  celebrationImage: { width: 100, height: 100, marginBottom: 10 },
});
