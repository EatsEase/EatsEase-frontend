import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { homeScreenData } from '../services/homeScreenData';
import * as SecureStore from 'expo-secure-store';
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const storedUsername = await SecureStore.getItemAsync('username');
      console.log('Stored username:', storedUsername);

      if (!storedUsername) {
        Alert.alert('Error', 'No username found. Please log in again.');
        navigation.navigate('Login');
        return;
      }
      setUsername(storedUsername);

      const data = await homeScreenData(storedUsername);
      console.log('Fetched menu data:', data);

      if (data && data.length > 0) {
        const transformedData: CardItem[] = data.map((item: any) => ({
          id: item._id,
          menuTitle: item.menu_name,
          backgroundColor: '#d9B382',
          image: item.menu_image,
        }));
        setSampleCardArray(transformedData.reverse());
      } else {
        console.warn('⚠️ No new recommended menus available.');
      }
    } catch (error) {
      console.error('Error fetching home screen data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchData();
    if (username) {
      fetchCurrentLikedMenuCount(username); 
    }
  }, [fetchData, username]);

  useFocusEffect(
    useCallback(() => {
      if (username) {
        fetchCurrentLikedMenuCount(username); // optional
        fetchUserProfile(); // ✅ ดึง likedMenus จาก backend
        setDislikedMenus([]); // ✅ เคลียร์เมนูไม่ชอบ
      }
    }, [username])
  );
  
  const removeCard = (id: string) => {
    setSampleCardArray((prev) => {
      const updatedArray = prev.filter((item) => item.id !== id);

      // ✅ ถ้าเมนูหมด และไม่อยู่ใน loading state ให้ fetch ใหม่
      if (updatedArray.length === 0 && !loading) {
        console.log("🟡 All recommended menus used, fetching more...");
        fetchData();
      }
      return updatedArray;
    });
  };
  
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
      const likedMenuNames: string[] = response.data.liked_menu || [];
  
      const updatedLikedMenus: CardItem[] = likedMenuNames.map((menuName, index) => ({
        id: `liked-${index}`, // ใช้ id สมมุติ ถ้าไม่มี id จริง
        menuTitle: menuName,
        backgroundColor: '#d9B382',
        image: null, // ใช้ null หรือ default image ก็ได้
      }));
  
      setLikedMenus(updatedLikedMenus);
      setLikedMenusCount(updatedLikedMenus.length);
  
      console.log("🔁 Synced likedMenus from backend:", updatedLikedMenus);
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
  
  // Function to handle swipe actions and update liked/disliked menus
  const handleSwipe = (direction: string, item: CardItem) => {
    console.log(`🟢 Swiped ${direction}:`, item.menuTitle);
  
    if (direction === 'Right') {
      if (likedMenusCount >= 5) {
        Alert.alert('Limit Reached', 'You can only like up to 5 menus. Remove some before adding more.');
        return;
      }
  
      // If the user has liked 5 menus, prevent further likes
      updateUserMenus([item]); // send liked menu to backend
    } else if (direction === 'Left') {
      setDislikedMenus((prev) => [...prev, item]);
      updateUserMenus([], item);
    }
  
    removeCard(item.id);
  };

  
  // Navigate to YourListScreen when 5 menus are liked using useEffect
  useEffect(() => {
    if (likedMenusCount === 5) {
      console.log('✅ Navigating to YourListScreen (likedMenusCount = 5)');
  
      navigation.navigate('YourListScreen', {
        likedMenus,
        updateLikedMenus: (newMenus: CardItem[]) => setLikedMenus(newMenus),
      });
    }
  }, [likedMenusCount]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#5ECFA6" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <>
          <View style={styles.container}>
            {sampleCardArray.length === 0 ? (
              <Text style={{ fontSize: 18, color: '#555' }}>⏳ กำลังโหลดเมนูเพิ่ม...</Text>
            ) : (
              sampleCardArray.map((item) => (
                <SwipeableCard
                  key={item.id}
                  item={item}
                  removeCard={() => removeCard(item.id)}
                  swipedDirection={(dir) => handleSwipe(dir, item)}
                  image={item.image}
                />
              ))
            )}
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

