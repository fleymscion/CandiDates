import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';

const NAVY = '#011F5B';

// Set by <AlertHost /> when it mounts. Alerts are queued if several fire at once.
let enqueue = null;

// Usage (unchanged): showAlert(title, message, onOk)
// onOk runs when the popup is closed (X or OK).
export default function showAlert(title, message, onOk) {
  const item = {
    title: message ? title : '',
    message: message || title,
    onOk,
  };

  if (enqueue) {
    enqueue(item);
    return;
  }

  // Fallback if <AlertHost /> isn't mounted yet
  if (Platform.OS === 'web') {
    window.alert(item.title ? `${item.title}\n\n${item.message}` : item.message);
    if (onOk) onOk();
  } else {
    Alert.alert(item.title || 'CandiDate notification', item.message, [
      { text: 'OK', onPress: onOk },
    ]);
  }
}

// Mount once near the root of the app (see App.js).
export function AlertHost() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    enqueue = (item) => setQueue((q) => [...q, item]);
    return () => {
      enqueue = null;
    };
  }, []);

  const current = queue[0];

  const close = () => {
    const onOk = current?.onOk;
    setQueue((q) => q.slice(1));
    if (onOk) onOk();
  };

  return (
    <Modal
      visible={!!current}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="image-outline" size={16} color="#FFFFFF" />
              <AppText style={styles.headerTitle}>CandiDate notification</AppText>
            </View>

            <Pressable onPress={close} hitSlop={10} accessibilityLabel="Close">
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.body}>
            {!!current?.title && (
              <AppText style={styles.title}>{current.title}</AppText>
            )}
            <AppText style={styles.message}>{current?.message}</AppText>

            <Pressable style={styles.okButton} onPress={close}>
              <AppText style={styles.okText}>OK</AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#B5B5B5',
  },
  header: {
    height: 40,
    backgroundColor: NAVY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#444444',
    textAlign: 'center',
  },
  okButton: {
    marginTop: 20,
    minWidth: 90,
    height: 34,
    paddingHorizontal: 20,
    backgroundColor: NAVY,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  okText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});