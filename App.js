import { registerRootComponent } from 'expo';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import DrawerNavigator from './src/views/DrawerNavigator';
import EmployeeOnboardingScreen from './src/views/EmployeeOnboardingScreen';
import EmployerOnboardingScreen from './src/views/EmployerOnboardingScreen';
import { EventProvider } from './src/views/EventContext';
import ForgotPassView from './src/views/ForgotPassView';
import InfoHighlightModule from './src/views/InfoHighlightModule';
import LoginView from './src/views/LoginView';
import ResetEmailView from './src/views/ResetEmailSentView';
import { AlertHost } from './src/views/showAlert';
import SignupView from './src/views/SignupView';
import SplashScreen from './src/views/SplashScreen';

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Splash');
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);

  const handleNavigate = (screen, params = {}) => {
    console.log(`Navigating to: ${screen}`, params);

    if (screen === 'ResetEmail' && params.email) {
      setEmail(params.email);
    }

    if (params?.profile) {
      setUserData(params.profile);
    } else if (params && Object.keys(params).length > 0) {
      setUserData(params);
    }

    setCurrentScreen(screen);
  };

  // Standardized navigation bridge for screens expecting React Navigation prop structure
  const navigationProp = {
    navigate: handleNavigate,
    replace: handleNavigate,
    goBack: () => setCurrentScreen('Login'),
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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#011F5B" />
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen onFinish={() => setCurrentScreen('Signup')} />;

      case 'Login':
        return <LoginView onNavigate={handleNavigate} navigation={navigationProp} />;

      case 'Signup':
        return <SignupView onNavigate={handleNavigate} navigation={navigationProp} />;

      case 'ForgotPassword':
        return <ForgotPassView onNavigate={handleNavigate} navigation={navigationProp} />;

      case 'ResetEmail':
        return <ResetEmailView onNavigate={handleNavigate} email={email} navigation={navigationProp} />;

      case 'EmployeeOnboarding':
        return <EmployeeOnboardingScreen onNavigate={handleNavigate} />;

      case 'EmployerOnboarding':
        return <EmployerOnboardingScreen onNavigate={handleNavigate} />;

      case 'InfoHighlightModule':
        return <InfoHighlightModule onNavigate={handleNavigate} userData={userData} navigation={navigationProp} />;

      case 'MainApp':
      case 'EmployeeProfile':
      case 'EmployerProfile':
        return (
          <DrawerNavigator
            userRole={userData?.role || (currentScreen === 'EmployerProfile' ? 'Employer' : 'Employee')}
            userData={userData}
            onNavigate={handleNavigate}
          />
        );

      default:
        return <SignupView onNavigate={handleNavigate} navigation={navigationProp} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <EventProvider>
        {renderScreen()}
      </EventProvider>

      {/* Renders every showAlert() popup, on top of all screens */}
      <AlertHost />
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);