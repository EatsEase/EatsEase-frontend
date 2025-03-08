import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import { useNavigation } from '@react-navigation/native';
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
  }, []);

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
  const updateUserMenus = async (newLikedMenus: CardItem[], newDislikedMenus: CardItem[]) => {
    if (!username) {
      console.error("Username not found, can't update menus.");
      return;
    }
  
    try {
      // 🔹 Step 1: Fetch the latest user profile
      const userProfileResponse = await axios.get(
        `https://eatsease-backend-1jbu.onrender.com/api/userProfile/${username}`
      );
  
      const userProfile = userProfileResponse.data.userProfile;
      
      // 🔹 Step 2: Create full request body with updated liked/disliked menus
      const requestBody = {
        "userProfile": {
        user_name: username, // Ensure username is included
        allergies: userProfile.allergies,  // Keep existing allergies
        food_preferences: userProfile.food_preferences, // Keep existing preferences
        distance_in_km_preference: userProfile.distance_in_km_preference, // Keep existing preference
        price_range: userProfile.price_range, // Keep existing price range
        liked_menu: newLikedMenus.map((menu) => menu.menuTitle), // Update liked_menu
        disliked_menu: newDislikedMenus.map((menu) => menu.menuTitle), // Update disliked_menu
        },
      };
  
      console.log("🔹 Sending PUT request with:", JSON.stringify(requestBody, null, 2));
  
      // 🔹 Step 3: Send the PUT request
      const response = await axios.put(
        `https://eatsease-backend-1jbu.onrender.com/api/userProfile/edit/${username}`,
        requestBody,
        { headers: { "Content-Type": "application/json" } } // Ensure proper headers
      );
  
      console.log("PUT Response:", response.data);
  
      // 🔹 Step 4: Fetch updated profile to verify changes
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

      if (likedMenus.length >= 5) {
        Alert.alert('Limit Reached', 'You can only like up to 5 menus. Remove some before adding more.');
        return;
      }

      const updatedLikedMenus = [...likedMenus, item];
      setLikedMenus(updatedLikedMenus);

      // Immediately update backend after swiping right
      updateUserMenus(updatedLikedMenus, dislikedMenus);

      // Navigate to `YourListScreen` once 5 menus are liked
      if (updatedLikedMenus.length === 5) {
        console.log('Navigating to YourListScreen');
        navigation.navigate('YourListScreen', {
          likedMenus: updatedLikedMenus,
          updateLikedMenus: (newMenus: CardItem[]) => setLikedMenus(newMenus),
        });
      }

      removeCard(item.id);
    } else if (direction === 'Left') {
      console.log('Swiped Left:', item.menuTitle);

      const updatedDislikedMenus = [...dislikedMenus, item];
      setDislikedMenus(updatedDislikedMenus);

      // Immediately update backend after swiping left
      updateUserMenus(likedMenus, updatedDislikedMenus);

      removeCard(item.id);
    }
  };

  const removeCard = (id: string) => {
    setSampleCardArray((prev) => prev.filter((item) => item.id !== id));
  };

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
            <Text style={styles.viewListText}>เมนูที่ชอบ ({likedMenus.length}/5)</Text>
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
    borderRadius: 20,
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
