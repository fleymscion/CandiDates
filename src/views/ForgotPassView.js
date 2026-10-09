import React from 'react';
import { StyleSheet, View, TextInput, Pressable, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function ForgotPassView({ onNavigate }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <Pressable
          style={styles.backButton}
          onPress={() => onNavigate('Login')}
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color="#FFFFFF"
          />
        </Pressable>

        <View style={styles.headingContainer}>
          <AppText style={styles.title}>
            Forgot Password
          </AppText>

          <AppText style={styles.description}>
            Please enter your email to reset the password.
          </AppText>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777777"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable style={styles.Button} onPress={() => onNavigate('VerifyCode')}>
          <AppText style={styles.ButtonText}>
            Reset Password
          </AppText>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    paddingTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 20,
    backgroundColor: '#011F5B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },

  headingContainer: {
    marginBottom: 28,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
  },

  description: {
    fontSize: 18,
    color: '#666666',
    lineHeight: 22,
  },

  input: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 4,
    fontFamily: 'Commissioner',
    fontSize: 18,
    marginHorizontal: 2,
    marginBottom: 40,
  },

  Button: {
    height: 46,
    backgroundColor: '#284B91',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },

  ButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
