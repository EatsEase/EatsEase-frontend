import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HeaderProps {
  title: string;
}

const { width, height } = Dimensions.get('window');

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isMessageVisible, setMessageVisible] = useState(false);

  return (
    <>
      {/* Header Bar */}
      <LinearGradient
        colors={['#FE665D', '#FE5266', '#FD3B71']}
        locations={[0.44, 0.71, 1]}
        style={styles.header}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.iconContainer}>
          {/* Bell Icon */}
          <TouchableOpacity onPress={() => setNotificationVisible(true)}>
            <Icon name="bell" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
          {/* Message Icon */}
          <TouchableOpacity onPress={() => setMessageVisible(true)}>
            <Icon name="message" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Notification Modal */}
      <Modal
        visible={isNotificationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNotificationVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <Text style={styles.modalText}>Here are your notifications...</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setNotificationVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Message Modal */}
      <Modal
        visible={isMessageVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMessageVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Messages</Text>
            <Text style={styles.modalText}>Here are your messages...</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMessageVisible(false)}
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
    flexDirection: 'row', // Ensure content aligns horizontally
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Jua Regular',
    color: 'white',
    position: 'absolute',
    left: 20, // Adjust this value for padding from the left
    top: 60, // Adjust to position properly in line with the icons
  },
  iconContainer: {
    position: 'absolute',
    right: 20, // Aligns both icons to the right
    top: 60, // Align with the title text
    flexDirection: 'row', // Ensures icons are next to each other
  },
  icon: {
    marginLeft: 10, // Add some spacing between the icons
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
