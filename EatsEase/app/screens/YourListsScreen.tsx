import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CardItem {
  id: string;
  menuTitle: string;
  imageUrl: string;
}

const YourListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [menus, setMenus] = useState<CardItem[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    const loadLikedMenus = async () => {
      try {
        const storedMenus = await AsyncStorage.getItem('likedMenus');
        if (storedMenus) {
          setMenus(JSON.parse(storedMenus));
        }
      } catch (error) {
        console.error('Failed to load liked menus:', error);
      }
    };
    loadLikedMenus();
  }, []);

  const handleCardPress = (id: string) => {
    setSelectedCard(id);
  };

  const handleRemove = async (id: string) => {
    const updatedMenus = menus.filter(menu => menu.id !== id);
    setMenus(updatedMenus);

    try {
      await AsyncStorage.setItem('likedMenus', JSON.stringify(updatedMenus)); // ✅ Update stored likedMenus
    } catch (error) {
      console.error('Failed to update liked menus:', error);
    }

    if (selectedCard === id) {
      setSelectedCard(null);
    }

    if (updatedMenus.length === 0) {
      navigation.navigate('HomeScreen'); // Go back to swiping if no menus left
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
              style={[styles.card, selectedCard === item.id && styles.selectedCard]}
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
          <View style={styles.centerMessage}>
            <Text style={styles.emptyMessage}>ยังไม่มีเมนูที่ถูกใจ</Text>
            <Text style={styles.emptyMessage}>"ชอบ" ก็ปัดขวาเลย!</Text>
            <Text style={styles.emptyMessage}>"ไม่ถูกใจ" ก็ปัดซ้ายได้!</Text>
            <Image source={require('../../app/image/bored.png')} style={styles.boredImage} />
          </View>
        )}
      </View>

      {menus.length > 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, !selectedCard && styles.disabledButton]}
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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontFamily: 'Mali SemiBold', textAlign: 'center', marginBottom: 20, marginTop: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 20, marginRight: 20, marginTop: 20 },
  card: { width: '45%', marginBottom: 20, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  selectedCard: { borderColor: '#5ECFA6' },
  cardImage: { width: '100%', height: 100 },
  cardTitle: { fontSize: 12, fontFamily: 'Mali SemiBold', textAlign: 'center', marginVertical: 5 },
  removeIcon: { position: 'absolute', top: 5, right: 5 },
  centerMessage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyMessage: { textAlign: 'center', fontSize: 20, color: 'gray', fontFamily: 'Mali SemiBold', padding: 10 },
  boredImage: { width: 200, height: 200 },
  buttonContainer: { flex: 1, justifyContent: 'flex-end', marginBottom: 100 },
  nextButton: { position: 'absolute', backgroundColor: '#5ECFA6', borderRadius: 50, paddingVertical: 10, paddingHorizontal: 30, alignSelf: 'center' },
  disabledButton: { backgroundColor: 'gray' },
  nextButtonText: { fontSize: 20, color: '#fff', fontFamily: 'Mali SemiBold' },
});