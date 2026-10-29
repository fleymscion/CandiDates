import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { signupUser } from '../controllers/SignupController';
import AppText from './AppText';
import showAlert from './showAlert';

export default function SignupView({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accountType, setAccountType] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormFilled =
    accountType !== '' &&
    username.trim() !== '' &&
    email.trim() !== '' &&
    password !== '' &&
    confirmPassword !== '';

  const handleSignup = async () => {
    if (loading) return;

    if (!accountType) {
      showAlert('Account Type Required', 'Please select Employee or Employer.');
      return;
    }

    setLoading(true);
    try {
      const result = await signupUser(
        username,
        email,
        password,
        confirmPassword,
        accountType
      );

      showAlert(
        'Success',
        `Your ${result.profile.role.toLowerCase()} account has been created!`,
        () => onNavigate('Login')
      );
    } catch (error) {
      console.error('Signup error:', error);
      showAlert('Signup Failed', error?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable
          style={{ marginHorizontal: 50 }}
          onPress={() => onNavigate('Login')}
        >
          <Text style={styles.inactiveTab}>Log In</Text>
        </Pressable>

        <Pressable style={{ marginHorizontal: 50 }}>
          <Text style={styles.activeTab}>Sign Up</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Image
              source={require('../../assets/images/LOGO_dark.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <AppText style={styles.welcome}>Welcome!</AppText>

            <AppText style={styles.subtitle}>Create your account</AppText>

            <AppText style={styles.label}>Join CandiDates as an</AppText>

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
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

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

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                placeholderTextColor="#777777"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={21}
                  color="#011F5B"
                />
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.signupButton,
                isFormFilled && styles.signupButtonActive,
              ]}
              onPress={handleSignup}
              disabled={loading}
            >
              <AppText style={styles.signupText}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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

  keyboardAvoidingView: {
    flex: 1,
  },

  content: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    paddingHorizontal: 20,
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },

  inactiveTab: {
    fontFamily: 'Commissioner',
    fontSize: 21,
    color: '#7891BD',
  },

  activeTab: {
    fontFamily: 'Commissioner',
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

  label: {
    fontSize: 16,
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
    fontSize: 18,
  },

  selectedAccountText: {
    fontSize: 18,
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
    fontSize: 18,
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
    fontSize: 18,
  },

  signupButton: {
    height: 46,
    backgroundColor: '#7F9DD5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  signupButtonActive: {
    backgroundColor: '#2B5195',
  },

  signupText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});