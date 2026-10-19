import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function ForgotPassView({ onNavigate }) {
   const [email, setEmail] = useState('');
   const [isSending, setIsSending] = useState(false);

   const handleResetPassword = async () => {
     const normalizedEmail = email.trim();

     if (!normalizedEmail) {
       Alert.alert('Email required', 'Please enter your email address.');
       return;
     }

     try {
       setIsSending(true);

       await sendPasswordResetEmail(auth, normalizedEmail);

       onNavigate('VerifyCode', { email: normalizedEmail });
     } catch (error) {
       let message = 'Unable to send the password reset email. Please try again.';

       if (error.code === 'auth/invalid-email') {
         message = 'Please enter a valid email address.';
       } else if (error.code === 'auth/too-many-requests') {
         message = 'Too many attempts. Please try again later.';
       }

       Alert.alert('Password Reset', message);
     } finally {
       setIsSending(false);
     }
   };

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
          value={email}
          onChangeText={setEmail}
          editable={!isSending}
        />

        <Pressable
        style={styles.Button}
        onPress={handleResetPassword}
        disabled={isSending}
        >
          <AppText style={styles.ButtonText}>
            {isSending ? 'Sending...' : 'Reset Password'}
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