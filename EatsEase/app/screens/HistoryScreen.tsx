import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Header from "../components/Headers";

interface HistoryItem {
  menu_name: string;
  restaurant_name: string;
  restaurant_location: string;
  restaurant_location_link: string;
  date: string;
  _id: string;
}

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    fetchUsernameAndHistory();
  }, []);

  const fetchUsernameAndHistory = async () => {
    try {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (!storedUsername) {
        console.error("❌ No username found.");
        return;
      }
      setUsername(storedUsername);
      fetchHistory(storedUsername);
    } catch (error) {
      console.error("❌ Error fetching username:", error);
    }
  };

  const fetchHistory = async (username: string) => {
    try {
      const response = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/history/${username}`);
      console.log("✅ Fetched History:", response.data);

      if (response.data.history_detail && response.data.history_detail.length > 0) {
        setHistoryData(response.data.history_detail);
      } else {
        // console.error("❌ No history data found.");
      }
    } catch (error) {
      console.error("❌ Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const openMapLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    } else {
      alert("ไม่พบลิงก์แผนที่");
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleString()}</Text>
        <Text style={styles.menuText}>🍽 เมนู: {item.menu_name}</Text>
        <Text style={styles.text}>🏠 ร้าน: {item.restaurant_name}</Text>
        <Text style={styles.text}>📍 สถานที่: {item.restaurant_location}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.mapButton} onPress={() => openMapLink(item.restaurant_location_link)}>
            <Text style={styles.buttonText}>ไปยังแผนที่</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="EatsEase" />
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#5ECFA6" />
        ) : historyData.length > 0 ?(
            <FlatList
            data={historyData}
            keyExtractor={(item) => item._id}
            renderItem={renderHistoryItem}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }} // ✅ แก้ปัญหา Scroll Tab
            showsVerticalScrollIndicator={false}
            />
        ) : (
            // 🆕 UI เมื่อไม่มีประวัติอาหาร
            <View style={styles.centerMessage}>
            <Image source={require('../../app/image/bored.png')} style={styles.emptyImage} />
            <Text style={styles.emptyMessage}>ยังไม่มีประวัติอาหารเลย!</Text>
            <Text style={styles.emptyMessage}>ไปลองอาหารใหม่กันเถอะ</Text>
            <TouchableOpacity style={styles.swipeButton} onPress={() => navigation.navigate('HomeScreen')}>
              <Text style={styles.swipeButtonText}>ไปลองอาหารใหม่กัน !!!</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>ย้อนกลับ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
    textAlign: "right",
    fontFamily: 'Mali-Regular',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
    fontFamily: 'Mali-Regular',
    paddingTop: 5,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
    fontFamily: 'Mali-Regular',
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  mapButton: {
    backgroundColor: "#5ECFA6",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: 'Mali-Regular',
    padding: 4,
  },
  backButton: {
    backgroundColor: '#FE5266',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    width: 150,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 45,
    zIndex: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'Mali-Bold',
  },
  // 🆕 UI ใหม่เมื่อไม่มีประวัติอาหาร
  centerMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    fontFamily: 'Mali-Bold',
    paddingTop: 10,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
    marginTop: -50,
  },
  swipeButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
  },
  swipeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Mali-Bold',
    padding: 5,
  },
});
