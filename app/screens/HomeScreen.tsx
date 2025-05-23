import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, TouchableOpacity, Text, Image } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { homeScreenData } from '../services/homeScreenData';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { checkToken } from '../services/checkToken';

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
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const storedUsername = await SecureStore.getItemAsync('username');
      if (!storedUsername) {
        Alert.alert('Error', 'No username found. Please log in again.');
        navigation.navigate('Login');
        return;
      }
      setUsername(storedUsername);
      await fetchMenuData(storedUsername);
      await fetchCurrentLikedMenuCount(storedUsername);
    } catch (error) {
      console.error('❌ Error during user initialization:', error);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  const fetchMenuData = async (usernameParam: string) => {
    try {
      const token1 = await SecureStore.getItemAsync('token')
      const data = await homeScreenData(usernameParam, token1);
      if (data?.token === "Token Expired"){
        setTokenExpired(true)
        await axios.post(`https://eatsease-backend-1jbu.onrender.com/api/user/logout`, {'token':token1})
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
        navigation.navigate('Login')
        return;
      }
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
        setSampleCardArray([]);
      }
    } catch (error) {
      console.log('Error fetching home screen data:', error.response.data.message);
    }
  };

  const fetchCurrentLikedMenuCount = async (usernameParam: string) => {
    try {
      const token1 = await SecureStore.getItemAsync('token')
      const response = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/currentLiked/${usernameParam}`,
        {
          headers: {
            'authorization': token1, // Replace token with your actual token variable
            'Content-Type': 'application/json', // Example header; add others as needed
          },
        }
      );
      const data = response.data;
      if (data && data.count !== undefined) {
        setLikedMenusCount(data.count);
        const updatedLikedMenus: CardItem[] = data.menu_list.map((item: any) => ({
          id: item._id,
          menuTitle: item.menu_name,
          backgroundColor: '#d9B382',
          image: item.menu_image,
        }));
        setLikedMenus(updatedLikedMenus);
      }
    } catch (error) {
      console.error('❌ Error fetching current liked menu:', error.response);
    }
  };

  const updateUserMenus = async (newLikedMenus: CardItem[], newDislikedMenu?: CardItem) => {
    if (!username) return;
    try {
      const token2 = await SecureStore.getItemAsync("token")
      const check = await checkToken(token2)
      if (check === false){
        setTokenExpired(true)
        await axios.post(`https://eatsease-backend-1jbu.onrender.com/api/user/logout`, {'token':token2})
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
        navigation.navigate('Login')
        return;
      }
      if (newLikedMenus.length > 0) {
        const latestLikedMenu = newLikedMenus[newLikedMenus.length - 1].menuTitle;
        await axios.post(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/liked/${username}`, { liked_menu: latestLikedMenu },
          {
            headers: {
              'authorization': token, // Replace token with your actual token variable
              'Content-Type': 'application/json', // Example header; add others as needed
            },
          }
        );
      }
      if (newDislikedMenu) {
        await axios.post(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/disliked/${username}`, { disliked_menu: newDislikedMenu.menuTitle },
          {
            headers: {
              'authorization': token, // Replace token with your actual token variable
              'Content-Type': 'application/json', // Example header; add others as needed
            },
          }
        );
      }
      await fetchCurrentLikedMenuCount(username);
    } catch (error) {
      console.error('Error updating liked/disliked menus:', error);
    }
  };

  const handleSwipe = (direction: string, item: CardItem) => {
    if (direction === 'Right') {
      if (likedMenusCount >= 5) {
        Alert.alert('Limit Reached', 'You can only like up to 5 menus.');
        return;
      }
      const updatedLikedMenus = [...likedMenus, item];
      setLikedMenus(updatedLikedMenus);
      updateUserMenus(updatedLikedMenus);
    } else if (direction === 'Left') {
      const updatedDislikedMenus = [...dislikedMenus, item];
      setDislikedMenus(updatedDislikedMenus);
      updateUserMenus([], item);
    }
    removeCard(item.id);
  };
  const removeCard = async (id: string) => {
    setSampleCardArray((prev) => {
      const updatedArray = prev.filter((item) => item.id !== id);
  
      // ✅ Check token only if the array is empty
      if (updatedArray.length === 0 && !loading) {
  
        // ✅ Check token before fetching new data
        SecureStore.getItemAsync('token').then(async (token1) => {
          const check = await checkToken(token1);
          if (check === false) {
            console.log('⚠️ Token expired. Skipping fetch...');
            return; // ✅ Skip fetching if token expired
          }
          fetchUserData()
        });
      }
  
      return updatedArray;
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
  
      const verifyToken = async () => {
        const getToken = await SecureStore.getItemAsync('token');
  
        if (!getToken) {
          Alert.alert('Error', 'No token found. Please log in again.');
          navigation.navigate('Login');
          return; // ✅ Stop further execution
        }
  
        setToken(getToken);
  
        const check = await checkToken(getToken);
        if (check === false) {
          setTokenExpired(true);
          console.log('⚠️ Token expired. Logging out...');
          Alert.alert('Error', 'Token is expired. Please log in again.');
  
          // ✅ Correct logout API with headers
          const logout = await axios.post(
            `https://eatsease-backend-1jbu.onrender.com/api/user/logout`,
            {'token': getToken},
          );
          console.log(logout);
  
          navigation.navigate('Login');
          return; // ✅ Stop further execution
        }
  
        if (check === true && isMounted) {
          console.log('✅ Token is valid. Fetching user data...');
          fetchUserData(); // ✅ Only fetch if valid token
          setDislikedMenus([]);
        }
      };
  
      verifyToken();
  
      return () => {
        isMounted = false; // ✅ Cleanup to prevent API call after navigation
      };
    }, [fetchUserData]) // ✅ Only depend on `fetchUserData` now
  );

  useEffect(() => {
    if (likedMenusCount === 5) {
      navigation.navigate('YourListScreen', {
        likedMenus,
        updateLikedMenus: (newMenus: CardItem[]) => setLikedMenus(newMenus),
      });
    }
  }, [token, likedMenusCount]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Image source={require('../../app/image/mascot_loading.gif')} style={styles.loadingImage} />
          <Text style={styles.loadingText}>กำลังหาเมนูที่ใช่ให้คุณอยู่... รอสักครู่นะ! 🍜✨</Text>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Mali-Regular',
    color: '#333',
    textAlign: 'center',
  },
});

