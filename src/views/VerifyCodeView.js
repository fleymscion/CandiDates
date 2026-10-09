import React from 'react';
import { StyleSheet, View, TextInput, Pressable, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function VerifyCodeView({ onNavigate }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <Pressable
          style={styles.backButton}
          onPress={() => onNavigate('ForgotPassword')}
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color="#FFFFFF"
          />
        </Pressable>

        <View style={styles.headingContainer}>
          <AppText style={styles.title}>
            Check your email
          </AppText>

          <AppText style={styles.description}>
            We sent a reset link to{' '}
            <AppText style={styles.email}>
              example@gmail.com
            </AppText>
            {'\n'}enter the 5-digit code mentioned in the email.
          </AppText>
        </View>

        <View style={styles.codeContainer}>
          {[0, 1, 2, 3, 4].map((item) => (
            <TextInput
              key={item}
              style={styles.codeInput}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <Pressable style={styles.Button} onPress={() => onNavigate('ConfirmPass')}>
          <AppText style={styles.ButtonText}>
            Verify Code
          </AppText>
        </Pressable>

        <View style={styles.resendContainer}>
          <AppText style={styles.resendText}>
            Haven’t got the email yet?
          </AppText>

          <Pressable>
            <AppText style={styles.resendLink}>
              Resend email
            </AppText>
          </Pressable>
        </View>

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
    borderRadius: 22,
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

  email: {
    fontSize: 18,
    fontWeight: '700',
    color: '#606060',
  },

  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 3,
    marginBottom: 34,
  },

  codeInput: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 13,
    fontFamily: 'Commissioner',
    fontSize: 24,
    color: '#011F5B',
    padding: 0,
  },

  Button: {
    height: 46,
    backgroundColor: '#284B91',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },

  resendText: {
    fontSize: 16,
    color: '#606060',
  },

  resendLink: {
    fontSize: 16,
    color: '#3985FF',
    marginLeft: 4,
  },
});