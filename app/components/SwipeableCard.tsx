import React, { useState } from 'react';
import { StyleSheet, Text, Dimensions, Animated, PanResponder, GestureResponderEvent, PanResponderGestureState, View, Image } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface CardItem {
  id: string;
  menuTitle: string;
  backgroundColor: string;
  image?: string; // ✅ เปลี่ยนจาก any เป็น string (URL ของภาพ), ? หมายถึงไม่จำเป็นต้องมี
}
interface SwipeableCardProps {
  item: CardItem;
  removeCard: () => void;
  swipedDirection: (dir: string) => void;
  image: any;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ item, removeCard, swipedDirection }) => {
  const [xPosition, setXPosition] = useState(new Animated.Value(0));
  let swipeDirection = '';
  const cardOpacity = new Animated.Value(1);
  
  const rotateCard = xPosition.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      xPosition.setValue(gestureState.dx);
      swipeDirection = '';

      if (gestureState.dx > 50) {
        swipeDirection = 'Right';
      } else if (gestureState.dx < -50) {
        swipeDirection = 'Left';
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < 50 && gestureState.dx > -50) {
        // Not swiped far enough, reset position
        Animated.spring(xPosition, {
          toValue: 0,
          speed: 5,
          bounciness: 10,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.parallel([
          Animated.timing(xPosition, {
            toValue: swipeDirection === 'Right' ? SCREEN_WIDTH : -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(cardOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          if (swipeDirection) {
            console.log(`Swiped ${swipeDirection}`);
            swipedDirection(swipeDirection);
          }
          removeCard();
        });
      }
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.cardStyle,
        {
          backgroundColor: item.backgroundColor,
          opacity: cardOpacity,
          transform: [{ translateX: xPosition }, { rotate: rotateCard }],
        },
      ]}
    >
      {/* แสดงรูปภาพของเมนู */}
      <View style={styles.imageContainer}>
      {item.image && item.image.trim() !== '' ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      {/* แสดงชื่อเมนู */}
      <View style={styles.textContainer}>
        <Text style={styles.cardTitleStyle}>{item.menuTitle}</Text>
      </View>
    </Animated.View>
  );
};

export default SwipeableCard;

const styles = StyleSheet.create({
  cardStyle: {
    width: '85%',
    height: '85%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 25,
    backgroundColor: '#FFF', // เพิ่มพื้นหลังให้เป็นสีขาวเพื่อความชัดเจน
    elevation: 5, // เงาสำหรับ Android
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0', // สีเทาสำหรับกรณีไม่มีรูป
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Mali-Regular',
  },
  textContainer: {
    width: '100%',
    padding: 8,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(235, 232, 232, 0.9)',
  },
  cardTitleStyle: {
    color: 'rgba(47, 47, 47, 0.82)',
    fontSize: 20,
    fontFamily: 'Mali SemiBold',
    textAlign: 'center',
    lineHeight: 30,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
