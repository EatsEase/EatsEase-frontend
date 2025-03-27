import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { checkToken } from '../services/checkToken';

interface HeaderProps {
  title: string;
}

const { width } = Dimensions.get('window');

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isAIModalVisible, setAIModalVisible] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [recommendedMenu, setRecommendedMenu] = useState<{ name: string; image: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();

  // ✅ Fetch Username and Token
  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      const storedToken = await SecureStore.getItemAsync('token');
      if (storedUsername) {
        setUsername(storedUsername);
        setToken(storedToken);
      }
    };

    fetchUsername();
    verifyToken();
  }, []);

  // ✅ Verify Token and Set State
  const verifyToken = async () => {
    const getToken = await SecureStore.getItemAsync('token');
    if (!getToken) {
      handleSessionExpired();
      return;
    }

    const check = await checkToken(getToken);
    if (check === false) {
      await clearStoredData(); // ลบ token ที่หมดอายุ
      handleSessionExpired(); // Token expired
    } else {
      setToken(getToken);
      setTokenExpired(false); // ✅ Token is valid
    }
  };

  // ✅ Handle Modal Close and Verify Token
  const handleModalClose = async () => {
    setAIModalVisible(false);
  
    if (tokenExpired) {
      console.log('🔄 Token expired. Logging out...');
      console.log(tokenExpired);
      await handleLogout(); // เรียก handleLogout เพื่อไปยังหน้า Login
    } else {
      console.log('🔄 Modal closed. Verifying token...');
      await verifyToken();
    }
  };

  // ✅ Handle Session Expired
  const handleSessionExpired = () => {
    setTokenExpired(true);
    setAIModalVisible(true);
  };

  // ✅ Fetch Recommended Menu
  const fetchRecommendedMenu = async () => {
    if (!username) {
      console.error('Username not found');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://eatsease-backend-1jbu.onrender.com/api/recommendation/next_meal/${username}`,
        {
          timeout: 10000,
          headers: {
            authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setRecommendedMenu({
          name: response.data.recommended_menu,
          image: response.data.menu_image,
        });
      }
    } catch (error) {
      console.error('Error fetching recommended menu:', error);
      setRecommendedMenu(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Logout and Redirect
  const handleLogout = async () => {
    try {
      // ลบ token ออกจาก SecureStore
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('username');

      // เรียก API เพื่อ logout
      await axios.post(`https://eatsease-backend-1jbu.onrender.com/api/user/logout`, {
        token: token,
      });

      // รีเซ็ต navigation stack และไปยังหน้า Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // หรือ 'Signup' ตามต้องการ
      });
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  const clearStoredData = async () => {
    try {
      console.log('🧹 Clearing expired token and username...');
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('username');
      console.log('✅ Token and username cleared successfully.');
    } catch (error) {
      console.error('❌ Error clearing stored data:', error);
    }
  };
  


  return (
    <>
      {/* Header Bar */}
      <LinearGradient
        colors={['#FE665D', '#FE5266', '#FD3B71']}
        locations={[0.44, 0.71, 1]}
        style={styles.header}
      >
        <Text style={styles.title}>{title}</Text>

        {/* AI Feature Icon */}
        <TouchableOpacity
          onPress={() => {
            setAIModalVisible(true);
            fetchRecommendedMenu(); // Fetch data when modal opens
          }}
          style={styles.aiIconContainer}
        >
          <Image source={require('../../app/image/bot.png')} style={styles.aiIcon} />
        </TouchableOpacity>
      </LinearGradient>

      {/* AI Feature Modal */}
      <Modal
        visible={isAIModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleModalClose}
        onDismiss={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* ✅ Token Expired - Show Login Message */}
            {tokenExpired ? (
              <>
                <Text style={styles.modalTitle}>⚠️ Session Expired</Text>
                <Text style={styles.modalText}>
                  Your session was ended. Please log in again.
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setAIModalVisible(false);
                    navigation.navigate('Login'); // ✅ Redirect to login
                  }}
                >
                  <Text style={styles.closeButtonText}>Login Again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>เมนูแนะนำสำหรับมื้อถัดไป!</Text>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <Image
                      source={require('../../app/image/mascot_loading.gif')}
                      style={styles.loadingImage}
                    />
                    <Text style={styles.loadingText}>
                      กำลังหาเมนูที่ใช่ให้คุณอยู่... รอสักครู่นะ! 🍜✨
                    </Text>
                  </View>
                ) : recommendedMenu ? (
                  <>
                    <Image source={{ uri: recommendedMenu.image }} style={styles.menuImage} />
                    <Text style={styles.modalText}>
                      🍽 เมนูแนะนำ: {recommendedMenu.name}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.modalText}>⚠️ ไม่สามารถดึงข้อมูลเมนูแนะนำได้</Text>
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.refreshButton} onPress={fetchRecommendedMenu}>
                    <Text style={styles.refreshButtonText}>ลองอีกครั้ง</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
                    <Text style={styles.closeButtonText}>กลับหน้าหลัก</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 55,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Jua Regular',
    color: 'white',
    position: 'absolute',
    left: 20,
    top: 60,
  },
  aiIconContainer: {
    position: 'absolute',
    right: 20,
    top: 60,
  },
  aiIcon: {
    width: 30,
    height: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
    fontFamily: 'Mali-Regular',
    padding: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    fontFamily: 'Mali-Regular',
    paddingTop: 10,
    paddingBottom: 10,
  },
  menuImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#FE665D',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Mali-Regular',
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: -15,
  },
  refreshButton: {
    backgroundColor: '#FFA500',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    marginRight: 20,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Mali-Regular',
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingImage: {
    width: 120,
    height: 120,
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

export default Header;
