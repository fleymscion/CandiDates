import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { loginUser } from '../controllers/LoginController';
import AppText from './AppText';
import showAlert from './showAlert';

export default function LoginView({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormFilled = email.trim() !== '' && password !== '';

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await loginUser(email, password);
      const role = result.profile?.role?.toLowerCase();

      if (role === 'employee') {
        onNavigate('EmployeeOnboarding');
      } else if (role === 'employer') {
        onNavigate('MainApp', { profile: result.profile });
      } else {
        showAlert('Login Failed', 'Your account role could not be identified.');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('Login Failed', error?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable style={{ marginHorizontal: 50 }}>
          <AppText style={styles.activeTab}>Log In</AppText>
        </Pressable>

        <Pressable
          style={{ marginHorizontal: 50 }}
          onPress={() => onNavigate('Signup')}
        >
          <AppText style={styles.inactiveTab}>Sign Up</AppText>
        </Pressable>
      </View>

      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Image
            source={require('../../assets/images/LOGO_dark.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.welcomeContainer}>
            <AppText style={styles.welcome}>Welcome back!</AppText>

            <AppText style={styles.subtitle}>Login to your account</AppText>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777777"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#777777"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={21}
                color="#011F5B"
              />
            </Pressable>
          </View>

          <View style={styles.rememberForgotContainer}>
            <Pressable onPress={() => onNavigate('ForgotPassword')}>
              <AppText style={styles.forgotPassword}>Forgot Password?</AppText>
            </Pressable>
          </View>

          <Pressable
            style={[
              styles.loginButton,
              isFormFilled && styles.loginButtonActive,
            ]}
            disabled={!isFormFilled || loading}
            onPress={handleLogin}
          >
            <AppText style={styles.loginText}>
              {loading ? 'Logging in...' : 'Log In'}
            </AppText>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#011F5B',
    borderRadius: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  headerContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  content: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  inactiveTab: {
    fontSize: 21,
    color: '#7891BD',
  },

  activeTab: {
    fontSize: 21,
    color: '#FFFFFF',
  },

  container: {
    alignItems: 'stretch',
    paddingTop: 10,
    paddingBottom: 30,
  },

  logo: {
    width: 115,
    height: 115,
    alignSelf: 'center',
    marginBottom: 8,
  },

  welcome: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 18,
  },

  input: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontFamily: 'Commissioner',
    fontSize: 18,
    marginBottom: 18,
  },

  welcomeContainer: {
    marginBottom: 36,
  },

  passwordContainer: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 10,
    marginBottom: 0,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: 'Commissioner',
    fontSize: 18,
  },

  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  forgotPassword: {
    fontSize: 15,
    color: '#007BFF',
  },

  loginButton: {
    height: 46,
    backgroundColor: '#7F9DD5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  loginButtonActive: {
    backgroundColor: '#2B5195',
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});