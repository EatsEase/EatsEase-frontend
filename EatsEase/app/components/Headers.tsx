import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <LinearGradient
      colors={['#FE665D', '#FE5266', '#FD3B71']}
      locations={[0.44, 0.71, 1]}
      style={styles.header}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Icon name="bell" size={30} color="white" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="message" size={30} color="white" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'pink',
    padding: 55,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',  // Ensure content aligns horizontally
  },
  title: {
    fontSize: 36 ,
    fontWeight: 'bold',
    fontFamily: 'Jua Regular',
    color: 'white',
    position: 'absolute',
    left: 20,  // Adjust this value for padding from the left
    top: 60,   // Adjust to position properly in line with the icons
  },
  iconContainer: {
    position: 'absolute',
    right: 20,  // Aligns both icons to the right
    top: 60,    // Align with the title text
    flexDirection: 'row', // Ensures icons are next to each other
  },
  icon: {
    marginLeft: 10,  // Add some spacing between the icons
  },
});

export default Header;
