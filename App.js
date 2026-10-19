import { registerRootComponent } from 'expo';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import SignupView from './src/views/SignupView';
import SplashScreen from './src/views/SplashScreen';
import LoginView from './src/views/LoginView';
import ForgotPassView from './src/views/ForgotPassView';
import ResetEmailView from './src/views/ResetEmailSentView';
import ProfileSetupView from './src/views/EmployeeOnboarding';

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("Splash");
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);

  const handleNavigate = (screen, params = {}) => {
    if (screen === 'ResetEmail' && params.email) {
      setEmail(params.email);
    }

    if (screen === 'EmployeeProfile' || screen === 'EmployerProfile') {
      setUserData(params.profile || params);
    }

    setCurrentScreen(screen);
  };

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
      </View>
  }

  if (currentScreen === 'Splash') {
    return <SplashScreen onFinish={() => setCurrentScreen('Signup')} />;
  }

  if (currentScreen === 'Login') {
    return <LoginView onNavigate={setCurrentScreen} />;
  }

  if (currentScreen === 'ForgotPassword') {
    return <ForgotPassView onNavigate={handleNavigate} />;
  }

  if (currentScreen === 'ResetEmail') {
    return <ResetEmailView onNavigate={handleNavigate} email={email} />;
  }

  if (currentScreen === 'EmployeeOnboarding') {
    return <ProfileSetupView employeeData={userData} />;
  }

  return <SignupView onNavigate={setCurrentScreen} />;
}

registerRootComponent(App);