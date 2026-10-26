import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// showBack = true replaces the menu icon with a back arrow (for screens opened from the Profile menu).
export default function Header({ title, children, navigation, showBack = false }) {
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
      <View style={styles.headerBar}>
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

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  headerBar: {
    height: 60,
    backgroundColor: '#011F5B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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