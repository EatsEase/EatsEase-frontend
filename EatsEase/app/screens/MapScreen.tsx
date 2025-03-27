import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Linking, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import * as Location from 'expo-location'; // 🆕 Import Location API
import Modal from 'react-native-modal';
import Header from '../components/Headers';
import { checkToken } from '../services/checkToken';

interface Restaurant {
  id: string;
  restaurant_name: string;
  lat: number;
  long: number;
  restaurant_location: string;
  restaurant_rating: number;
  restaurant_price_range: string;
  restaurant_description: string;
  restaurant_image: string;
  restaurant_menu: string[];
  restaurant_location_link: string;
}

const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{ menu_name: string; restaurant_name: string; restaurant_location: string; restaurant_location_link: string; date: string } | null>(null);
  const distances = ["3 km", "5 km", "7 km", "10 km"];
  const priceMapping: { [key: string]: string } = {
    "฿": "<100",
    "฿฿": "100+",
    "฿฿฿": "250+",
    "฿฿฿฿": "500+",
    "฿฿฿฿฿": "1,000+",
  };
  const [userLocation, setUserLocation] = useState<{ lat: number; long: number } | null>(null); // 🆕 User location

  useEffect(() => {
    if (userLocation && username) {
      fetchRestaurants();
    }
  }, [userLocation, username]); // ✅ Runs only when both `userLocation` and `username` are set
  
  const fetchUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Allow location access to use this feature.");
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        long: location.coords.longitude,
      });
  
      console.log("📍 User Location:", location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error("❌ Error getting user location:", error);
    }
  };
  
  const fetchUsername = async () => {
    try {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.warn("⚠️ No username found in AsyncStorage.");
      }
    } catch (error) {
      console.error("❌ Error fetching username:", error);
    }
  };
  
  useEffect(() => {
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
        if (check == true && token){
          fetchUserLocation();
          fetchUsername();
        }
    }

    verifyToken();
  }, [token]);
  
  const fetchRestaurants = async () => {
    if (!userLocation || !username) {
      console.warn("⚠️ User location or username not available yet.");
      return;
    }
  
    try {
      const response = await axios.post(
        `https://eatsease-backend-1jbu.onrender.com/api/restaurant/query`,
        {
          user_name: username,
          user_lat: userLocation.lat,
          user_long: userLocation.long
        },
        {
          headers: {
            'authorization': token, // Replace token with your actual token variable
            'Content-Type': 'application/json', // Example header; add others as needed
          }
        }
      );

      console.log("Server Response:", response.data);
  
      const formattedRestaurants = response.data.map((item: any) => ({
        id: item._id,
        restaurant_name: item.restaurant_name,
        lat: item.restaurant_latitude,
        long: item.restaurant_longtitude,
        restaurant_location: item.restaurant_location,
        restaurant_rating: item.restaurant_rating,
        restaurant_price_range: item.restaurant_price_range,
        restaurant_description: item.restaurant_description,
        restaurant_image: item.restaurant_image,
        restaurant_menu: item.restaurant_menu,
        restaurant_location_link: item.restaurant_location_link,
      }));
        

      console.log("Formatted Restaurants:", formattedRestaurants);
  
      setRestaurants(formattedRestaurants);
    } catch (error) {
      console.error("❌ Error fetching restaurants:", error);
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
        const getToken = await SecureStore.getItemAsync('token');
        const check = await checkToken(getToken)
        if (check == false){
            Alert.alert("Error", "Token is expired. Please log in again.")
            const logout = await axios.post(`https://eatsease-backend-1jbu.onrender.com/api/user/logout`, {'token':getToken})
            navigation.navigate("Login")
            return;
        }
        const response = await axios.post(
          `https://eatsease-backend-1jbu.onrender.com/api/userProfile/finalized/restaurant/${username}`,
          { finalized_restaurant: selectedRestaurant.restaurant_name },
          {
            headers: {
              'authorization': token, // Replace token with your actual token variable
              'Content-Type': 'application/json', // Example header; add others as needed
            }
          }
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
      <Header title="EatsEase" />
      {loading ? (
        <ActivityIndicator size="large" color="#5ECFA6" style={styles.loadingIndicator} />
      ) : (
        <MapView
            style={styles.map}
            region={userLocation ? {
              latitude: userLocation.lat,
              longitude: userLocation.long,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            } : {
              latitude: 13.736717,
              longitude: 100.523186,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          showsUserLocation={true} // ✅ Enable user location on the map
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
                <View style={styles.calloutContainer}>
                  {/* Left Side - Text Info */}
                  <View style={styles.calloutTextContainer}>
                    <Text style={styles.calloutTitle}>{restaurant.restaurant_name}</Text>
                    <Text style={styles.calloutText}>📍 {restaurant.restaurant_location}</Text>
                    <Text style={styles.calloutText}>💰 ราคา: {priceMapping[restaurant.restaurant_price_range] || "ไม่ระบุ"}</Text>
                    <Text style={styles.calloutText}>⭐️ ความนิยม: {restaurant.restaurant_rating.toFixed(1)}</Text>
                    <Text style={styles.calloutText}>🚶🏻‍♂️ ระยะทาง: {distances[index]}</Text>
                  </View>

                  {/* Right Side - Image */}
                  <Image 
                    source={
                      restaurant.restaurant_image
                        ? { uri: restaurant.restaurant_image }
                        : require('../../app/image/logo.png') // Default image
                    } 
                    style={styles.calloutImage} 
                  />
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
        <Text style={styles.confirmButtonText}>ยืนยันร้านอาหาร</Text>
      </TouchableOpacity>

      {/* 🎉 Popup Modal เมื่อกด Confirm */}
      <Modal isVisible={isModalVisible} animationIn="zoomIn" animationOut="zoomOut">
        <View style={styles.modalContent}>
          <Image source={require('../../app/image/celebration.gif')} style={styles.celebrationImage} />
          <Text style={styles.modalTitle}>ยินดีด้วย! {"\n"} คุณได้อาหารสำหรับวันนี้แล้ว!</Text>
          {confirmedData && confirmedData.menu_name && (
            <Text style={styles.modalText}>
              🍽 เมนูวันนี้: {confirmedData.menu_name}{"\n"} {"\n"}
              📍 ร้าน: {confirmedData.restaurant_name}{"\n"} {"\n"}
              🏠 สถานที่: {confirmedData.restaurant_location} {"\n"} {"\n"}
            </Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseSuccessModal}>
              <Text style={styles.buttonText}>กลับไปหน้าหลัก</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton} onPress={openMapLink}>
              <Text style={styles.buttonText}>ไปยังแผนที่</Text>
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
  calloutContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: 250,  // Adjust width for better layout
  },
  calloutTextContainer: {
    flex: 1,  // Text takes up remaining space
    marginRight: 10,  // Space between text and image
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 14,
    color: "#555",
    paddingVertical: 2,
  },
  calloutImage: {
    width: 80,  // Adjust image size
    height: 80,
    borderRadius: 10,
  },
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
  confirmButtonText: { color: "white", fontSize: 18, fontWeight: "bold", fontFamily: "Mali-Regular" },
  loadingIndicator: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 25, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", fontFamily: "Mali-Regular", textAlign: "center", marginBottom: 10, height: 50, marginTop: 10 },
  modalText: { fontSize: 16, fontFamily: "Mali-Regular", textAlign: "center", marginBottom: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  mapButton: { backgroundColor: "#5ECFA6", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, paddingTop: 10 },
  closeButton: { backgroundColor: "#FF6B6B", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold", fontFamily: "Mali-Regular", padding: 5 },
  celebrationImage: { width: 120, height: 120, marginBottom: 10 },
  userLocationText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
