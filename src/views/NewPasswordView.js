import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function ForgotPassView({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            Set a New Password
          </AppText>

          <AppText style={styles.description}>
            Create a new password. {'\n'}
            Ensure it differs from previous ones.
          </AppText>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#777777"
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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#777777"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
              size={21}
              color="#011F5B"
            />
          </Pressable>
        </View>

        <Pressable style={styles.Button} onPress={() => onNavigate('')}>
          <AppText style={styles.ButtonText}>
            Update Password
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
    fontSize: 18,
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
