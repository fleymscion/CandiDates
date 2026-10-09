import { registerRootComponent } from 'expo';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import SignupView from './src/views/SignupView';
import SplashScreen from './src/views/SplashScreen';
import LoginView from './src/views/LoginView';
import ForgotPassView from './src/views/ForgotPassView';
import VerifyCodeView from './src/views/VerifyCodeView';
import ConfirmPassResetView from './src/views/ConfirmPassResetView';
import NewPasswordView from './src/views/NewPasswordView';

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("Splash");

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Commissioner: require('./assets/fonts/Commissioner-Regular.ttf'),
        });
      } catch (error) {
        console.error('Error loading Commissioner font:', error);
      } finally {
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>;
  }

  if (currentScreen === 'Splash') {
    return <SplashScreen onFinish={() => setCurrentScreen('Signup')} />;
  }

  if (currentScreen === 'Login') {
    return <LoginView onNavigate={setCurrentScreen} />;
  }

  if (currentScreen === 'ForgotPassword') {
    return <ForgotPassView onNavigate={setCurrentScreen} />;
  }

{/* this is just for testin to see the ui for the forgot pass stuff thngz
    remove the comment section, not the if logical condition, to see the ui for it thanks.
  if (currentScreen === 'VerifyCode') {
    return <VerifyCodeView onNavigate={setCurrentScreen} />;
  }

  if (currentScreen === 'ConfirmPass') {
    return <ConfirmPassResetView onNavigate={setCurrentScreen} />
  }

  if (currentScreen === 'NewPass') {
      return <NewPasswordView onNavigate={setCurrentScreen} />
    }
*/}

  return <SignupView onNavigate={setCurrentScreen} />;
}

registerRootComponent(App);