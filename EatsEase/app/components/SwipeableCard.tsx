import React, { useState } from 'react';
import { StyleSheet, Text, Dimensions, Animated, PanResponder, GestureResponderEvent, PanResponderGestureState, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icons library

const SCREEN_WIDTH = Dimensions.get('window').width;

interface CardItem {
  id: string;
  menuTitle: string;
  backgroundColor: string;
}

interface SwipeableCardProps {
  item: CardItem;
  removeCard: () => void;
  swipedDirection: (direction: string) => void;
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
    onStartShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => false,
    onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => true,
    onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      xPosition.setValue(gestureState.dx);
      if (gestureState.dx > SCREEN_WIDTH - 250) {
        swipeDirection = 'Right';
      } else if (gestureState.dx < -SCREEN_WIDTH + 250) {
        swipeDirection = 'Left';
      }
    },
    onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (gestureState.dx < SCREEN_WIDTH - 150 && gestureState.dx > -SCREEN_WIDTH + 150) {
        swipedDirection('--');
        Animated.spring(xPosition, {
          toValue: 0,
          speed: 5,
          bounciness: 10,
          useNativeDriver: false,
        }).start();
      } else if (gestureState.dx > SCREEN_WIDTH - 150) {
        Animated.parallel([
          Animated.timing(xPosition, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(cardOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          swipedDirection(swipeDirection);
          removeCard();
        });
      } else if (gestureState.dx < -SCREEN_WIDTH + 150) {
        Animated.parallel([
          Animated.timing(xPosition, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(cardOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          swipedDirection(swipeDirection);
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
      <View style={styles.imageContainer}>
        {/* Image */}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitleStyle}> {item.menuTitle} </Text>
      </View>
    </Animated.View>
  );
};

export default SwipeableCard;

const styles = StyleSheet.create({
  cardStyle: {
    width: '85%',
    height: '85%',
    justifyContent: 'flex-end', // This will push the content to the bottom
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 20,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    // Add image style here
  },
  textContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background for text
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardTitleStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Mali SemiBold',
    textAlign: 'center',
    lineHeight: 30,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%', // Adjust based on your preference
    marginTop: -30, // Space between cards and icons
  },
  iconButton: {
    padding: 10,
  },
});
