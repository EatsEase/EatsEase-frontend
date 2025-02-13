import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Headers';
import Tabs from '../components/NavigateBottomBar';
import { NavigationContainer } from '@react-navigation/native';

interface CardItem {
  id: string;
  menuTitle: string;
  backgroundColor: string;
  image?: any;
}

const DEMO_CONTENT: CardItem[] = [
  { id: '1', menuTitle: 'hahahaha', backgroundColor: '#d9B382' },
  { id: '2', menuTitle: 'ข้าวผัดต้มยำทะเล', backgroundColor: '#d9B382'},
  { id: '3', menuTitle: 'ข้าวกะเพราหมูกรอบ', backgroundColor: '#d9B382', image : require('../../app/image/food1.jpg') },
  { id: '4', menuTitle: 'หมาล่าทั่ง', backgroundColor: '#d9B382' },
  { id: '5', menuTitle: 'ข้าวหน้าปลาไหล + ซุปมิโสะ', backgroundColor: '#d9B382',},
  { id: '6', menuTitle: 'ก๋วยเตี๋ยวเรือ', backgroundColor: '#d9d9d9' },
  { id: '7', menuTitle: 'ข้าวหน้าหมูกรอบ', backgroundColor: '#d9d9d9'},
  { id: '8', menuTitle: 'ข้าวหน้าเป็ด', backgroundColor: '#d9d9d9'},
  { id: '9', menuTitle: 'ข้าวหน้าไก่', backgroundColor: '#d9d9d9'},
  { id: '10', menuTitle: 'ข้าวหน้าหมู', backgroundColor: '#d9d9d9'},
].reverse();

const HomeScreen: React.FC = () => {
  const [sampleCardArray, setSampleCardArray] = useState<CardItem[]>(DEMO_CONTENT);
  const [selectedMenu, setSelectedMenu] = useState<CardItem[]>([]);
  const [nonSelectedMenu, setNonSelectedMenu] = useState<CardItem[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<string>('');
  const navigation = useNavigation();

  const removeCard = (id: string) => {
    const newArray = sampleCardArray.filter((item) => item.id !== id);
    setSampleCardArray(newArray);
    if (newArray.length === 0) {
      // If no more cards, shuffle and reset
      resetCards();
    }
  };

  const lastSwipedDirection = (direction: string) => {
    setSwipeDirection(direction);
  };

  const shuffleArray = (array: CardItem[]) => {
    return array
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  };

  const resetCards = () => {
    const shuffledCards = shuffleArray(DEMO_CONTENT);
    setSampleCardArray(shuffledCards);
  };


  // Function to handle swipe direction
  const handleSwipe = (direction: string, item: CardItem) => {
    if (direction === 'Right') {
      setSelectedMenu((prev) => [...prev, item]);
    } else if (direction === 'Left') {
      setNonSelectedMenu((prev) => [...prev, item]);
    }

    if (selectedMenu.length >= 4) {
      navigation.navigate('YourListScreen');
    }
  };

  // get only the right swipe
  const rightSwipe = sampleCardArray.filter((item) => swipeDirection === 'Right');


  return (
    // Add Header
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.container}>
        {sampleCardArray.map((item) => (
          <SwipeableCard
            key={item.id}
            item={item}
            removeCard={() => removeCard(item.id)}
            swipedDirection={lastSwipedDirection}
          />
        ))}
      </View>

      <View style={styles.iconContainer}>
        <Icon name="close-circle" size={42} color="#FE665D" />
        <Icon name="gesture-swipe" size={40} color="#d9d9d9" />
        <Icon name="cards-heart" size={40} color="#5ECFA6" />
      </View>
    </SafeAreaView>
  );
};

const App: React.FC = () => (
  <NavigationContainer>
    <Tabs />
  </NavigationContainer>
);

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
    marginTop: -20, // Space between cards and icons
    marginLeft: 60,
    marginRight: 60,
  },
  iconButton: {
    padding: 10,
  },
});
