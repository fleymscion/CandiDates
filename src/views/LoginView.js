import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Image, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function LoginView({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accountType, setAccountType] = useState('');

  return (
  <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
          <Pressable style={{ marginHorizontal: 50 }}>
              <AppText style={styles.activeTab}>
              Log In
              </AppText>
          </Pressable>

          <Pressable style={{ marginHorizontal: 50 }} onPress={() => onNavigate('Signup')}>
              <AppText style={styles.inactiveTab}>
              Sign Up
              </AppText>
          </Pressable>
      </View>
    <View style={styles.content}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        <Image
          source={require('../../assets/images/LOGO_dark.png')}
          style={styles.logo}
        />

      <View style={styles.welcomeContainer}>
        <AppText style={styles.welcome}>
            Welcome back!
        </AppText>

        <AppText style={styles.subtitle}>
            Login to your account
        </AppText>
      </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#777777"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#777777"
            secureTextEntry={!showPassword}
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
          <Pressable style={styles.rememberMe}>
            <View style={styles.checkbox} />

            <AppText style={styles.rememberText}>
              Remember me
            </AppText>
          </Pressable>

          <Pressable onPress={() => onNavigate('ForgotPassword')}>
            <AppText style={styles.forgotPassword}>
              Forgot Password?
            </AppText>
          </Pressable>
        </View>

        <Pressable style={styles.loginButton}>
          <AppText style={styles.loginText}>
            Log In
          </AppText>
        </Pressable>

        <View style={styles.socialTitleContainer}>
          <View style={styles.line} />

          <AppText style={styles.socialTitle}>
            Or log in with
          </AppText>

          <View style={styles.line} />
        </View>

        <View style={styles.socialButtons}>

          <Pressable style={styles.socialButton}>
            <Ionicons
              name="logo-google"
              size={24}
              color="#DB4437"
            />
          </Pressable>

          <Pressable style={styles.socialButton}>
            <Ionicons
              name="logo-x"
              size={24}
              color="#000000"
            />
          </Pressable>

          <Pressable style={styles.socialButton}>
            <Ionicons
              name="logo-facebook"
              size={25}
              color="#1877F2"
            />
          </Pressable>

        </View>

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
    height: 75,
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
    paddingTop: 20,
    paddingBottom: 30,
  },

  logo: {
    width: 115,
    height: 115,
    alignSelf: 'center',
    marginBottom: 8,
    resizeMode: 'contain',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },

  rememberText: {
    fontSize: 15,
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

  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  socialTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#B5B5B5',
  },

  socialTitle: {
    fontSize: 16,
    marginHorizontal: 8,
  },

  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  socialButton: {
    width: 59,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
