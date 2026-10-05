import { registerRootComponent } from "expo";
import SignupView from "./src/views/SignupView";
import React, { useState } from 'react';
import SplashScreen from './src/views/SplashScreen';

function App() {
  const [ready, setReady] = useState(false);
  return ready ? <SignupView /> : <SplashScreen onFinish={() => setReady(true)} />;
}

registerRootComponent(App);