import { Alert, Platform } from 'react-native';

// Alert.alert does nothing on react-native-web, so fall back to window.alert there.
export default function showAlert(title, message, onOk) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    if (onOk) onOk();
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
  }
}