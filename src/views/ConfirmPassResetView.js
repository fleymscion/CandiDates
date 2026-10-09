import React from 'react';
import { StyleSheet, View, TextInput, Pressable, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function ConfirmPassResetView({ onNavigate }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <Pressable
          style={styles.backButton}
          onPress={() => onNavigate('VerifyCode')}
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color="#FFFFFF"
          />
        </Pressable>

        <View style={styles.headingContainer}>
          <AppText style={styles.title}>
            Password Reset
          </AppText>

          <AppText style={styles.description}>
            Your password has been successfully reset. {'\n'}
            Click confirm to set a new password.
          </AppText>
        </View>

        <Pressable style={styles.Button} onPress={() => onNavigate('NewPass')}>
          <AppText style={styles.ButtonText}>
            Confirm
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
