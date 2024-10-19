import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
      <Image source={require('../../app/image/message.png')} style={styles.messageIcon} />
      <Image source={require('../../app/image/notification.png')} style={styles.notificatioIcon} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'pink',
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Jua Regular',
    color: 'white',
    padding: 20,
    paddingTop: 60,
    // on the left side of the header
    position: 'absolute',
    left: 0,
  },
  messageIcon: {
    width: 28,
    height: 28,
    position: 'absolute',
    right: 20,
    top: 60
  },
  notificatioIcon: {
    width: 26,
    height: 26,
    position: 'absolute',
    right: 60,
    top: 60
  },
});

export default Header;