import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
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
      const data = await homeScreenData(); // Fetch API data
      if (data) {
        const transformedData: CardItem[] = data.map((item: any) => ({
          id: item._id,
          menuTitle: item.menu_name,
          backgroundColor: '#d9B382',
        }));
        setSampleCardArray(transformedData.reverse());
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSwipe = (direction: string, item: CardItem) => {
    if (direction === 'Right') {
      console.log("Right");

      // Prevent swiping right more than 5 times
      if (likedMenus.length >= 5) {
        Alert.alert("Limit Reached", "You can only like up to 5 menus. Remove some before adding more.");
        return;
      }

      setLikedMenus((prev) => {
        const updatedLikedMenus = [...prev, item];

        if (updatedLikedMenus.length === 5) {
          console.log("Navigating to YourListScreen");
          navigation.navigate('YourListScreen', {
            likedMenus: updatedLikedMenus,
            updateLikedMenus: (newMenus: CardItem[]) => setLikedMenus(newMenus),
          });
        }

        return updatedLikedMenus;
      });

      removeCard(item.id);
    } else if (direction === 'Left') {
      console.log("Left");
      setDislikedMenus((prev) => [...prev, item]);
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
              />
            ))}
          </View>

          <View style={styles.iconContainer}>
            <Icon name="close-circle" size={42} color="#FE665D" />
            <Icon name="gesture-swipe" size={40} color="#d9d9d9" />
            <Icon name="cards-heart" size={40} color="#5ECFA6" />
          </View>

          {/* Button to Navigate to YourListScreen Anytime */}
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
