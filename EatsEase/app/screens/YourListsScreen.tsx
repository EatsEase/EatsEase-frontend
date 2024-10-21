import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface CardItem {
  id: string;
  menuTitle: string;
  imageUrl: string;
}

const initialSelectedMenus: CardItem[] = [
  { id: '1', menuTitle: 'hahahaha', imageUrl: 'https://via.placeholder.com/150' },
  { id: '2', menuTitle: 'ข้าวผัดต้มยำทะเล', imageUrl: 'https://via.placeholder.com/150' },
  { id: '3', menuTitle: 'ข้าวกะเพราหมูกรอบ + ไข่ดาว', imageUrl: 'https://via.placeholder.com/150' },
  { id: '4', menuTitle: 'หมาล่าทั่ง', imageUrl: 'https://via.placeholder.com/150' },
  { id: '5', menuTitle: 'ข้าวหน้าปลาไหล + ซุปมิโสะ', imageUrl: 'https://via.placeholder.com/150' },
];

const YourListScreen: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [menus, setMenus] = useState<CardItem[]>(initialSelectedMenus);

  const handleCardPress = (id: string) => {
    setSelectedCard(id);
  };

  const handleRemove = (id: string) => {
    setMenus(prevMenus => prevMenus.filter(menu => menu.id !== id));
    if (selectedCard === id) {
      setSelectedCard(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select 1 menu</Text>
      <View style={styles.gridContainer}>
        {menus.map((item) => ( // Change from selectedMenus to menus
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              selectedCard === item.id && styles.selectedCard, // Highlight selected card
            ]}
            onPress={() => handleCardPress(item.id)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.menuTitle}</Text>
            <TouchableOpacity style={styles.removeIcon} onPress={() => handleRemove(item.id)}>
              <Icon name="minus-circle" size={25} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedCard && styles.disabledButton, // Apply disabled style if no card is selected
          ]}
          disabled={!selectedCard}
          >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default YourListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Mali SemiBold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  card: {
    width: '45%',
    marginBottom: 20,
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
    height: 100,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: 'Mali SemiBold',
    textAlign: 'center',
    marginVertical: 5,
  },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
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
  },
  disabledButton: {
    backgroundColor: 'gray', // Gray color for the disabled state
  },
  nextButtonText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Mali SemiBold',
  },
});

