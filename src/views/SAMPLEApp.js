// (THIS IS A VIEWS SAMPLE TO VISUALIZE HOW THE APP WILL LOOK WITH A SPLASH SCREEN)

import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen'; // AGAIN THIS IS A PLACEHOLDER UNTILL ACTUAL SCREEN IS GIVEN

export default function App() {
  const [ready, setReady] = useState(false);
  return ready ? <HomeScreen /> : <SplashScreen onFinish={() => setReady(true)} />;
}
