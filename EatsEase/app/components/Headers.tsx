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

const { width } = Dimensions.get('window');

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isAIModalVisible, setAIModalVisible] = useState(false);

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
          <Image source={require('../../app/image/bot.png')} style={styles.aiIcon} />
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
            <Text style={styles.modalTitle}>AI Feature</Text>
            <Text style={styles.modalText}>This is your AI assistant feature.</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAIModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FE5266',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Header;
