import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';


const LOGO = require('../../assets/images/LOGO_white.png');

const START_BG = '#000714';
const END_BG = '#011F5B';
const LOGO_SIZE = 72;
const GAP = 14;

export default function SplashScreen({ onFinish }) {
  const [textWidth, setTextWidth] = useState(0);

  const scale = useRef(new Animated.Value(0.2)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(0)).current; 
  const textOpacity = useRef(new Animated.Value(0)).current;
  const bg = useRef(new Animated.Value(0)).current;

  
  useEffect(() => {
    if (!textWidth) return;

    Animated.sequence([
      
      Animated.delay(500),

      
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(300),

      
      Animated.parallel([
        Animated.timing(slide, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 900,
          delay: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bg, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false, 
        }),
      ]),

      Animated.delay(600),
    ]).start(() => onFinish && onFinish());
  }, [textWidth]);

  const backgroundColor = bg.interpolate({
    inputRange: [0, 1],
    outputRange: [START_BG, END_BG],
  });

  
  const offset = (textWidth + GAP) / 2;
  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [offset, 0],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
        <Animated.Image
          source={LOGO}
          resizeMode="contain"
          style={[
            styles.logo,
            { opacity: logoOpacity, transform: [{ scale }] },
          ]}
        />
        <Animated.Text
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
          style={[styles.title, { opacity: textOpacity }]}
        >
          CandiDates
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  title: {
    marginLeft: GAP,
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});

/* how to use

import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';

export default function App() 
{
  const [ready, setReady] = useState(false);
  return ready ? <HomeScreen /> : <SplashScreen onFinish={() => setReady(true)} />;
}

*/
