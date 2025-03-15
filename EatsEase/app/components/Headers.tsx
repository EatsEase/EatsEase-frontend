import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  title: string;
}

const demoData = [
  { id: 1, name: 'Strawberry Banana Smoothie' },
  { id: 2, name: 'Green Detox Smoothie' },
  { id: 3, name: 'Mango Pineapple Smoothie' },
  { id: 4, name: 'Berry Protein Shake' },
  { id: 5, name: 'Avocado Almond Blend' },
];

const { width } = Dimensions.get('window');

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isAIModalVisible, setAIModalVisible] = useState(false);
  const [recommendedMenu, setRecommendedMenu] = useState(demoData[0]);

  const refreshRecommendedMenu = () => {
    const randomMenu = demoData[Math.floor(Math.random() * demoData.length)];
    setRecommendedMenu(randomMenu);
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
        <TouchableOpacity onPress={() => setAIModalVisible(true)} style={styles.aiIconContainer}>
          <Image source={require('../../app/image/bot.png')} style={styles.Icon} />
        </TouchableOpacity>
      </LinearGradient>

      {/* AI Feature Modal */}
      <Modal
        visible={isAIModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAIModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Icon */}
            <TouchableOpacity style={styles.closeIcon} onPress={() => setAIModalVisible(false)}>
              <Image source={require('../../app/image/close.png')} style={styles.closeImageIcon} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>AI Recommended Menu!</Text>
            <Text style={styles.modalText}>
              🍽 เมนูแนะนำ: {recommendedMenu.name} {"\n"}
              🍽 ร้านแนะนำ: ........... {"\n"}
              🍽 สถานที่: ...........
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={refreshRecommendedMenu}
              >
                <Text style={styles.refreshButtonText}>ลองอีกครั้ง</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.MapButton}
                // onPress={() => setAIModalVisible(false)}
              >
                <Text style={styles.MapButtonText}>ไปยังแผนที่</Text>
              </TouchableOpacity>
            </View>
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
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeImageIcon: {
    width: 20,
    height: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Mali-Regular',
    paddingBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Mali-Regular',
    paddingTop: 10,
    paddingBottom: 10,
  },
  MapButton: {
    backgroundColor: '#5ECFA6',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  MapButtonText: {
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
});

export default Header;
