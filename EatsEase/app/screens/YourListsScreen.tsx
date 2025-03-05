import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';

interface CardItem {
  id: string;
  menuTitle: string;
  imageUrl: string;
}

type YourListScreenRouteProp = RouteProp<{ params: { likedMenus?: CardItem[], setLikedMenus?: React.Dispatch<React.SetStateAction<CardItem[]>> } }, 'params'>;

const YourListScreen: React.FC = () => {
  const route = useRoute<YourListScreenRouteProp>();
  const navigation = useNavigation();

  const likedMenus = route.params?.likedMenus ?? [];
  const setLikedMenus = route.params?.setLikedMenus ?? (() => {}); // Prevents undefined errors

  const [menus, setMenus] = useState<CardItem[]>(likedMenus);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    setMenus(likedMenus); // Sync state when navigating
  }, [likedMenus]);

  const handleCardPress = (id: string) => {
    setSelectedCard(id);
  };

  const handleRemove = (id: string) => {
    const updatedMenus = menus.filter(menu => menu.id !== id);
    setMenus(updatedMenus);
    setLikedMenus(updatedMenus); // ✅ Update HomeScreen's state

    if (selectedCard === id) {
      setSelectedCard(null);
    }

    // If user removes all menus, navigate back to HomeScreen to swipe for new ones
    if (updatedMenus.length === 0) {
      setTimeout(() => {
        navigation.navigate('HomeScreen');
      }, 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select 1 menu</Text>

      <View style={styles.gridContainer}>
        {menus.length > 0 ? (
          menus.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                selectedCard === item.id && styles.selectedCard,
              ]}
              onPress={() => handleCardPress(item.id)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.menuTitle}</Text>
              <TouchableOpacity style={styles.removeIcon} onPress={() => handleRemove(item.id)}>
                <Icon name="minus-circle" size={25} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyMessage}>No menus selected. Returning to HomeScreen...</Text>
        )}
      </View>

      {menus.length > 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedCard && styles.disabledButton,
            ]}
            disabled={!selectedCard}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
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
    borderColor: '#5ECFA6', // Highlight color for selected card
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
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
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
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: 'gray', // Gray color for disabled state
  },
  nextButtonText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Mali SemiBold',
  },
});
