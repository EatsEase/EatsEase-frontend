import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { checkToken } from '../services/checkToken';

interface CardItem {
  id: string;
  menuTitle: string;
  imageUrl: string;
}

const YourListScreen: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [menus, setMenus] = useState<CardItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();

  // 🔹 ฟังก์ชันดึงเมนูที่ชอบจาก backend
  const fetchLikedMenus = async (username: string) => {
    try {
      console.log("📥 Fetching liked menus...");
      const response = await axios.get(
        `https://eatsease-backend-1jbu.onrender.com/api/userProfile/currentLiked/${username}`,
        {
          headers: {
            'authorization': token, // Replace token with your actual token variable
            'Content-Type': 'application/json', // Example header; add others as needed
          }
        }
      );

      console.log("✅ Liked Menus Response:", response.data);

      if (response.data && response.data.menu_list) {
        setMenus(
          response.data.menu_list.map((menu: any, index: number) => ({
            id: String(index + 1), // ใช้ index เป็น id ชั่วคราว
            menuTitle: menu.menu_name,
            imageUrl: menu.menu_image,
          }))
        );
      }
    } catch (error) {
      console.error('❌ Error fetching liked menus:', error);
    }
  };

  // 🔹 ดึง username จาก AsyncStorage และ fetch liked menus
  const fetchUsernameAndMenus = async () => {
    try {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (!storedUsername) {
        Alert.alert('Error', 'No username found. Please log in again.');
        navigation.navigate('Login');
        return;
      }
      setUsername(storedUsername);
      fetchLikedMenus(storedUsername);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // ✅ ใช้ useFocusEffect เพื่อ fetch ข้อมูลทุกครั้งที่เข้าหน้านี้
  useFocusEffect(
    useCallback(() => {
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
          if (check == true && token){
            fetchUsernameAndMenus();
          }
      }

      verifyToken();
    }, [token])
  );

  // 🔹 ฟังก์ชันลบเมนูที่ชอบ
  const handleRemove = async (menu: CardItem) => {
    if (!username) {
      Alert.alert('Error', 'No username found. Please log in again.');
      return;
    }

    try {
      console.log(`📤 Sending DELETE request to remove menu: ${menu.menuTitle}`);

      const response = await axios.delete(
        `https://eatsease-backend-1jbu.onrender.com/api/userProfile/currentLiked/${username}`,
        { data: { menu_name: menu.menuTitle }, 
          headers: {
            'authorization': token, // Replace token with your actual token variable
            'Content-Type': 'application/json', // Example header; add others as needed
          }
      }
      );

      console.log("✅ DELETE Response:", response.data);

      // 🔄 Fetch ข้อมูลใหม่จาก backend หลังจากลบ
      fetchLikedMenus(username);

      Alert.alert("Success", `Removed ${menu.menuTitle} from liked menus.`);
    } catch (error) {
      console.error("❌ Error removing liked menu:", error.response?.data || error);
      Alert.alert("Error", "Could not remove menu. Please try again.");
    }
  };
  const handleNext = async () => {
    if (!selectedCard || !username) return;
  
    // 🔹 หา `menuTitle` ตาม `selectedCard` (id)
    const selectedMenuItem = menus.find(menu => menu.id === selectedCard);
    const finalizedMenu = selectedMenuItem ? selectedMenuItem.menuTitle : null;
  
    if (!finalizedMenu) {
      Alert.alert("Error", "ยังไม่ได้เลือกเมนูที่ชอบ");
      return;
    }
  
    try {
      console.log(`📤 Sending finalized menu: ${finalizedMenu} for ${username}`);
  
      const response = await axios.post(
        `https://eatsease-backend-1jbu.onrender.com/api/userProfile/finalized/menu/${username}`,
        { finalized_menu: finalizedMenu },
        {
          headers: {
            'authorization': token, // Replace token with your actual token variable
            'Content-Type': 'application/json', // Example header; add others as needed
          }
        }
      );
  
      console.log("✅ Finalized Menu Response:", response.data);
  
      // 🔄 Navigate to MapScreen after successful update
      navigation.navigate('MapScreen');
  
    } catch (error) {
      console.error("❌ Error finalizing menu:", error.response.status);
      Alert.alert("Error", "Could not finalize menu. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>เลือกเมนูที่ใช่ที่สุดสำหรับคุณ! (สูงสุด 1)</Text>
      <View style={styles.gridContainer}>
        {menus.length > 0 ? (
          menus.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.card,
            selectedCard === item.id && styles.selectedCard,
          ]}
          onPress={() => setSelectedCard(item.id)}
        >
          {/* Image Component */}
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

          {/* Absolute Positioned Remove Button */}
          <View style={styles.removeButtonContainer}>
            <TouchableOpacity style={styles.removeIcon} onPress={() => handleRemove(item)}>
              <Image source={require('../../app/image/minus.png')} style={styles.removeImage} />
            </TouchableOpacity>
          </View>

          {/* Menu Title */}
          <Text style={styles.cardTitle}>{item.menuTitle}</Text>
        </TouchableOpacity>
          ))
        ) : (
          <View style={styles.centerMessage}>
            <Text style={styles.emptyMessage}>ยังไม่มีเมนูที่ถูกใจหรอ?!</Text>
            <Text style={styles.emptyMessage}>"ชอบ" ก็ปัดขวาเลย!</Text>
            <Text style={styles.emptyMessage}>"ไม่ถูกใจ" ก็ปัดซ้ายได้!</Text>
            <Image source={require('../../app/image/bored.png')} style={styles.boredImage} />
            <TouchableOpacity style={styles.swipeButton} onPress={() => navigation.navigate('HomeScreen')}>
              <Text style={styles.swipeButtonText}>คลิกเพื่อปัด!</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Next Button */}
      {menus.length > 0 && (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: selectedCard ? '#5ECFA6' : 'gray' }
          ]}
          onPress={handleNext}
          disabled={!selectedCard}
        >
          <Text style={styles.nextButtonText}>ยืนยัน</Text>
        </TouchableOpacity>
      </View>
    )}
    </SafeAreaView>
  );
}

export default YourListScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Mali SemiBold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
  },
  card: {
    width: '45%',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent', // No border by default
  },
  selectedCard: {
    borderColor: '#5ECFA6', // Change to your desired border color for selection
  },
  cardImage: {
    width: '100%',
    height: 80,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Mali SemiBold',
    textAlign: 'center',
    marginVertical: 5,
    padding: 5,
  },
  removeButtonContainer: {
    position: 'absolute',
    top: 5, // Adjust as needed
    right: 5, // Adjust as needed
    zIndex: 10, // Ensures it stays on top of the image
  },
  removeIcon: {
    backgroundColor: 'red',  // Circle background
    width: 25,
    height: 25,
    borderRadius: 35 / 2, // Circular shape
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  removeImage: {
    width: 15,
    height: 3, // Thin horizontal line
    tintColor: 'white', // White minus icon inside
  },
  centerMessage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyMessage: { textAlign: 'center', fontSize: 20, color: 'gray', fontFamily: 'Mali SemiBold', padding: 10 },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 100,
  },
  nextButton: {
    position: 'absolute',
    backgroundColor: '#5ECFA6',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center', // Center it horizontally
    marginTop: 0,
  },
  disabledButton: {
    backgroundColor: 'gray', // Gray color for the disabled state
  },
  nextButtonText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Mali SemiBold',
  },
  swipeButton: {
    backgroundColor: '#FFA500', // สีส้มเพื่อความเด่น
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
  },
  swipeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Mali-Bold',
    padding: 5,
  },
});
