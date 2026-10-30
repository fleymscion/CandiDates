import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useContext } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 60;
const NO_INSETS = { top: 0, bottom: 0, left: 0, right: 0 };

// showBack = true replaces the menu icon with a back arrow (for screens opened from the Profile menu).
export default function Header({ title, children, navigation, showBack = false }) {
  // Safe-area insets keep the header out from under the notch / status bar and
  // the content clear of the home indicator. The context is null (no crash)
  // when there is no SafeAreaProvider above, and the insets are 0 on web.
  const insets = useContext(SafeAreaInsetsContext) ?? NO_INSETS;

  const handleOpenDrawer = () => {
    if (navigation?.dispatch) {
      navigation.dispatch(DrawerActions.openDrawer());
    } else if (navigation?.openDrawer) {
      navigation.openDrawer();
    }
  };

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.('Profile');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View
        style={[
          styles.headerBar,
          {
            height: HEADER_HEIGHT + insets.top,
            paddingTop: insets.top,
            paddingLeft: 16 + insets.left,
            paddingRight: 16 + insets.right,
          },
        ]}
      >
        <TouchableOpacity
          onPress={showBack ? handleBack : handleOpenDrawer}
          style={styles.iconButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name={showBack ? 'arrow-back' : 'menu'} size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
        <View style={styles.iconButton} />
      </View>

      <View
        style={[
          styles.content,
          {
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  headerBar: {
    backgroundColor: '#011F5B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 32,
    alignItems: 'center',
  },
  content: { flex: 1 },
});