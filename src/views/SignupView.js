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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns an object of field -> error message. Empty object = form is valid.
const validate = ({ accountType, username, email, password, confirmPassword }) => {
  const errors = {};

  if (!accountType) {
    errors.accountType = 'Please select Employee or Employer.';
  }

  const name = username.trim();
  if (!name) {
    errors.username = 'Username is required.';
  } else if (name.length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  } else if (!/^[A-Za-z0-9._-]+$/.test(name)) {
    errors.username = 'Use only letters, numbers, dots, dashes and underscores.';
  }

  const mail = email.trim();
  if (!mail) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(mail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Password must include at least one letter and one number.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

export default function SignupView({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accountType, setAccountType] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = validate({ accountType, username, email, password, confirmPassword });
  const isFormValid = Object.keys(errors).length === 0;

  // Inline errors appear after the first sign-up attempt, then update live.
  const fieldError = (field) => (submitted && errors[field] ? errors[field] : '');

  const handleSignup = async () => {
    if (loading) return;

    setSubmitted(true);

    if (!isFormValid) {
      const first = Object.values(errors)[0];
      showAlert('Please check your details', first);
      return;
    }

    setLoading(true);
    try {
      const result = await signupUser(
        username.trim(),
        email.trim().toLowerCase(),
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

            <View
              style={[
                styles.accountTypeContainer,
                !!fieldError('accountType') && styles.inputError,
              ]}
            >
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
            {!!fieldError('accountType') && (
              <AppText style={styles.errorText}>{fieldError('accountType')}</AppText>
            )}

            <TextInput
              style={[styles.input, !!fieldError('username') && styles.inputError]}
              placeholder="Username"
              placeholderTextColor="#777777"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!!fieldError('username') && (
              <AppText style={styles.errorText}>{fieldError('username')}</AppText>
            )}

            <TextInput
              style={[styles.input, !!fieldError('email') && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#777777"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!!fieldError('email') && (
              <AppText style={styles.errorText}>{fieldError('email')}</AppText>
            )}

            <View
              style={[
                styles.passwordContainer,
                !!fieldError('password') && styles.inputError,
              ]}
            >
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
            {fieldError('password') ? (
              <AppText style={styles.errorText}>{fieldError('password')}</AppText>
            ) : (
              <AppText style={styles.hintText}>
                At least 8 characters, with a letter and a number.
              </AppText>
            )}

            <View
              style={[
                styles.passwordContainer,
                !!fieldError('confirmPassword') && styles.inputError,
              ]}
            >
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
            {!!fieldError('confirmPassword') && (
              <AppText style={styles.errorText}>{fieldError('confirmPassword')}</AppText>
            )}

            <Pressable
              style={[
                styles.signupButton,
                isFormValid && styles.signupButtonActive,
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

  inputError: {
    borderColor: '#C0392B',
  },

  errorText: {
    color: '#C0392B',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 14,
  },

  hintText: {
    color: '#777777',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 14,
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