import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import homeScreenData from '../services/homeScreenData';

interface CardItem {
  id: string;
  menuTitle: string;
  backgroundColor: string;
  image?: any;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC = () => {
  const [sampleCardArray, setSampleCardArray] = useState<CardItem[]>([]);
  const [likedMenus, setLikedMenus] = useState<CardItem[]>([]);
  const [dislikedMenus, setDislikedMenus] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<HomeScreenNavigationProp>();


  useEffect(() => {
    const fetchData = async () => {
      const data = await homeScreenData(); // Call API function
      if (data) {
        const transformedData: CardItem[] = data.map((item: any) => ({
          id: item._id,
          menuTitle: item.menu_name,
          backgroundColor: '#d9B382', // Default color, you can modify logic
        }));
        setSampleCardArray(transformedData.reverse()); // Reverse order like DEMO_CONTENT
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSwipe = (direction: string, item: CardItem) => {
    if (direction === 'Right') {
      if (likedMenus.length < 5) {
        setLikedMenus((prev) => [...prev, item]);
        removeCard(item.id);
      } else {
        Alert.alert("Limit Reached", "You can only like up to 5 menus. Manage your list first!");
        shakeCard(item.id);
      }
    } else if (direction === 'Left') {
      setDislikedMenus((prev) => [...prev, item]);
      removeCard(item.id);
    }
  };

  const removeCard = (id: string) => {
    setSampleCardArray((prev) => prev.filter((item) => item.id !== id));
  };

  const shakeCard = (id: string) => {
    console.log(`Shaking card ${id}`);
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
                removeCard={() => handleSwipe('Right', item)}
                swipedDirection={(dir) => handleSwipe(dir, item)}
                // isShaking={likedMenus.length >= 5}
              />
            ))}
          </View>

          <View style={styles.iconContainer}>
            <Icon name="close-circle" size={42} color="#FE665D" />
            <Icon name="gesture-swipe" size={40} color="#d9d9d9" />
            <Icon name="cards-heart" size={40} color="#5ECFA6" />
          </View>
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
  iconButton: {
    padding: 10,
  },
});
