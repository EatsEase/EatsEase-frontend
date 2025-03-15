import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import homeScreenData from '../services/homeScreenData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface CardItem {
  id: string;
  menuTitle: string;
  backgroundColor: string;
  image: any;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC = () => {
  const [sampleCardArray, setSampleCardArray] = useState<CardItem[]>([]);
  const [likedMenus, setLikedMenus] = useState<CardItem[]>([]);
  const [dislikedMenus, setDislikedMenus] = useState<CardItem[]>([]);
  const [likedMenusCount, setLikedMenusCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (!storedUsername) {
          Alert.alert('Error', 'No username found. Please log in again.');
          navigation.navigate('Login');
          return;
        }
        setUsername(storedUsername);

        const data = await homeScreenData();
        if (data) {
          const transformedData: CardItem[] = data.map((item: any) => ({
            id: item._id,
            menuTitle: item.menu_name,
            backgroundColor: '#d9B382',
            image: item.menu_image,
          }));
          setSampleCardArray(transformedData.reverse());
        }
      } catch (error) {
        console.error('Error fetching home screen data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchUserProfile();
  }, []);

  const fetchCurrentLikedMenuCount = async (username: string) => {
    try {
      const response = await axios.get(
        `https://eatsease-backend-1jbu.onrender.com/api/userProfile/currentLiked/${username}`
      );

      console.log("✅ Current Liked Menu Response:", response.data);

      if (response.data && response.data.count !== undefined) {
        setLikedMenusCount(response.data.count); // ✅ อัปเดตจำนวนเมนูที่เหลือ
      }
    } catch (error) {
      console.error("❌ Error fetching current_liked_menu count:", error);
    }
  };

  // Fetch user profile to confirm the update
  const fetchUserProfile = async () => {
    if (!username) return;
    try {
      const response = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/${username}`);
      console.log("Updated User Profile:", response.data);
    } catch (error) {
      console.error("Error fetching updated user profile:", error);
    }
  };


  // Function to update liked/disliked menus via PUT request immediately after swipe
  const updateUserMenus = async (newLikedMenus: CardItem[], newDislikedMenu?: CardItem) => {
    if (!username) {
      console.error("Username not found, can't update menus.");
      return;
    }
  
      try {
        if (newLikedMenus.length > 0) {
          const latestLikedMenu = newLikedMenus[newLikedMenus.length - 1].menuTitle; // เอาเมนูล่าสุดที่ไลค์
          const likedMenusRequest = { liked_menu: latestLikedMenu };
      
          console.log("🔹 Sending POST to update liked_menu:", likedMenusRequest);
      
          // ✅ POST ไปที่ userProfile/liked/{username}
          await axios.post(
            `https://eatsease-backend-1jbu.onrender.com/api/userProfile/liked/${username}`,
            likedMenusRequest,
            { headers: { "Content-Type": "application/json" } }
          );
          
          console.log("✅ Successfully updated liked_menu to both endpoints.");
          fetchCurrentLikedMenuCount(username);
        }
  
      // 🔹 อัปเดต disliked_menu (append ทีละเมนู)
      if (newDislikedMenu) {
        const dislikedMenusRequest = {
          disliked_menu: newDislikedMenu.menuTitle, // เพิ่มเฉพาะเมนูที่เพิ่ง dislike
        };
        console.log("🔹 Sending POST to update disliked_menu:", dislikedMenusRequest);
        
        await axios.post(
          `https://eatsease-backend-1jbu.onrender.com/api/userProfile/disliked/${username}`,
          dislikedMenusRequest,
          { headers: { "Content-Type": "application/json" } }
        );
      }
  
      // 🔹 Fetch อัปเดตข้อมูล userProfile เพื่อดูผลลัพธ์
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating liked/disliked menus:", error.response?.data || error);
      Alert.alert("Error", "Could not update menu preferences. Please try again.");
    }
  };
  
  
  // Handle swipe actions (Real-Time PUT request after each right swipe)
  const handleSwipe = (direction: string, item: CardItem) => {
    if (direction === 'Right') {
      console.log('Swiped Right:', item.menuTitle);
  
      if (likedMenusCount >= 5) {
        Alert.alert('Limit Reached', 'You can only like up to 5 menus. Remove some before adding more.');
        return;
      }
  
      const updatedLikedMenus = [...likedMenus, item];
      setLikedMenus(updatedLikedMenus);
  
      // ✅ อัปเดต liked_menu ทั้งหมด และ fetch จำนวนเมนูที่ชอบ
      updateUserMenus(updatedLikedMenus);
  
      removeCard(item.id);
    } else if (direction === 'Left') {
      console.log('Swiped Left:', item.menuTitle);
  
      const updatedDislikedMenus = [...dislikedMenus, item];
      setDislikedMenus(updatedDislikedMenus);
  
      // ✅ อัปเดต disliked_menu ทีละเมนู
      updateUserMenus(likedMenus, item);
  
      removeCard(item.id);
    }
  };
  
  // ✅ ใช้ useEffect() ตรวจสอบ likedMenusCount และ navigate ไปหน้า YourListScreen ถ้าครบ 5 เมนู
  useEffect(() => {
    if (likedMenusCount === 5) {
      console.log('✅ Navigating to YourListScreen (likedMenusCount = 5)');
      
      fetchCurrentLikedMenuCount(username); // 🔄 ดึงข้อมูลให้แน่ใจว่า count อัปเดตแล้ว
  
      navigation.navigate('YourListScreen', {
        likedMenus,
        updateLikedMenus: (newMenus: CardItem[]) => setLikedMenus(newMenus),
      });
    }
  }, [likedMenusCount]);
  

  const removeCard = (id: string) => {
    setSampleCardArray((prev) => prev.filter((item) => item.id !== id));
  };

  useFocusEffect(
    React.useCallback(() => {
      if (username) {
        fetchCurrentLikedMenuCount(username);
      }
    }, [username])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#5ECFA6" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <>
          <View style={styles.container}>
            {sampleCardArray.map((item) => (
              <SwipeableCard
                key={item.id}
                item={item}
                removeCard={() => removeCard(item.id)}
                swipedDirection={(dir) => handleSwipe(dir, item)}
                image={item.image}
              />
            ))}
          </View>

          <View style={styles.iconContainer}>
            <Icon name="close-circle" size={42} color="#FE665D" />
            <Icon name="gesture-swipe" size={40} color="#d9d9d9" />
            <Icon name="cards-heart" size={40} color="#5ECFA6" />
          </View>

          <TouchableOpacity
            style={styles.viewListButton}
            onPress={() => navigation.navigate('YourListScreen', {
              likedMenus,
              updateLikedMenus: (newMenus: CardItem[]) => setLikedMenus(newMenus),
            })}
          >
            <Text style={styles.viewListText}>เมนูที่ชอบ ({likedMenusCount}/5)</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -20,
    marginLeft: 60,
    marginRight: 60,
  },
  viewListButton: {
    backgroundColor: '#5ECFA6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: -10,
  },
  viewListText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Mali-Bold',
    padding: 5,
  },
});
