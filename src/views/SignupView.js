import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Image, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function SignupView() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accountType, setAccountType] = useState('employee');

  return (
  <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
          <Pressable style={{ marginHorizontal: 50 }}>
              <AppText style={styles.inactiveTab}>
              Log In
              </AppText>
          </Pressable>

          <Pressable style={{ marginHorizontal: 50 }}>
              <AppText style={styles.activeTab}>
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

        <AppText style={styles.welcome}>
          Welcome!
        </AppText>

        <AppText style={styles.subtitle}>
          Create your account
        </AppText>

        <AppText style={styles.label}>
          Join CandiDates as an
        </AppText>

        <View style={styles.accountTypeContainer}>

          <Pressable
            style={[
              styles.accountTypeButton,
              accountType === 'employee' && styles.selectedAccountType,
            ]}
            onPress={() => setAccountType('employee')}
          >
            <AppText
              style={
                accountType === 'employee'
                  ? styles.selectedAccountText
                  : styles.accountText
              }
            >
              Employee
            </AppText>
          </Pressable>

          <Pressable
            style={[
              styles.accountTypeButton,
              accountType === 'employer' && styles.selectedAccountType,
            ]}
            onPress={() => setAccountType('employer')}
          >
            <AppText
              style={
                accountType === 'employer'
                  ? styles.selectedAccountText
                  : styles.accountText
              }
            >
              Employer
            </AppText>
          </Pressable>

        </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#777777"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777777"
          keyboardType="email-address"
          autoCapitalize="none"
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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#777777"
            secureTextEntry={!showConfirmPassword}
          />

          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
              size={21}
              color="#011F5B"
            />
          </Pressable>
        </View>

        <Pressable style={styles.signupButton}>
          <AppText style={styles.signupText}>
            Sign Up
          </AppText>
        </Pressable>

        <View style={styles.socialTitleContainer}>
          <View style={styles.line} />

          <AppText style={styles.socialTitle}>
            Or sign up with
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
    fontSize: 23,
    textAlign: 'center',
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    marginBottom: 8,
  },

  accountTypeContainer: {
    height: 36,
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  accountTypeButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedAccountType: {
    backgroundColor: '#2B5195',
  },

  accountText: {
    fontSize: 14,
  },

  selectedAccountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
    fontSize: 14,
    marginBottom: 18,
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
    marginBottom: 18,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: 'Commissioner',
    fontSize: 14,
  },

  signupButton: {
    height: 41,
    backgroundColor: '#7F9DD5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  signupText: {
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
    fontSize: 13,
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