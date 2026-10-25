import React from 'react';
import { Modal, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextStyle from './AppText';

const NAVY = '#011F5B';

export function ProfileHeader({ name, email, onEdit }) {
  return (
    <View style={styles.profileHeaderCard}>
      <View style={styles.avatar} />
      <View style={styles.profileInfo}>
        <TextStyle style={styles.profileName}>{name}</TextStyle>
        <TextStyle style={styles.profileEmail}>{email || 'Email'}</TextStyle>
        <TouchableOpacity style={styles.editProfileBtn} onPress={onEdit}>
          <TextStyle style={styles.editProfileBtnText}>Edit Profile</TextStyle>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={20} color="#333" />
      <TextStyle style={styles.menuText}>{label}</TextStyle>
      <Ionicons name="chevron-forward" size={18} color="#888" />
    </TouchableOpacity>
  );
}

export function MenuDivider() {
  return <View style={styles.divider} />;
}

function ModalShell({ visible, onClose, children }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleRow}>
              <Ionicons name="image-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <TextStyle style={styles.modalHeaderTitle}>CandiDate Notification</TextStyle>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

function PrefRow({ icon, label, value, onValueChange, disabled }) {
  return (
    <View style={[styles.prefRow, disabled && { opacity: 0.45 }]}>
      <View style={styles.prefLabelRow}>
        <Ionicons name={icon} size={20} color={NAVY} />
        <TextStyle style={styles.prefLabel}>{label}</TextStyle>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#767577', true: NAVY }}
      />
    </View>
  );
}

// prefs = { sound, mute, vibrate }. "Toggle off" mutes everything, so it disables the other two.
export function NotificationPreferencesModal({ visible, onClose, prefs, onChange }) {
  return (
    <ModalShell visible={visible} onClose={onClose}>
      <View style={styles.modalBody}>
        <PrefRow
          icon="volume-medium-outline"
          label="Toggle sound"
          value={prefs.sound && !prefs.mute}
          disabled={prefs.mute}
          onValueChange={(v) => onChange({ ...prefs, sound: v })}
        />
        <PrefRow
          icon="volume-mute-outline"
          label="Toggle off"
          value={prefs.mute}
          onValueChange={(v) => onChange({ ...prefs, mute: v })}
        />
        <PrefRow
          icon="notifications-outline"
          label="Toggle vibrate"
          value={prefs.vibrate && !prefs.mute}
          disabled={prefs.mute}
          onValueChange={(v) => onChange({ ...prefs, vibrate: v })}
        />
      </View>
    </ModalShell>
  );
}

export function LogoutModals({ confirmVisible, successVisible, onConfirm, onCancel, onFinish }) {
  return (
    <>
      <ModalShell visible={confirmVisible} onClose={onCancel}>
        <View style={styles.modalBodyCentered}>
          <TextStyle style={styles.confirmText}>Are you sure you want to log out?</TextStyle>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.modalBtn} onPress={onConfirm}>
              <TextStyle style={styles.modalBtnText}>Yes</TextStyle>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={onCancel}>
              <TextStyle style={styles.modalBtnText}>No</TextStyle>
            </TouchableOpacity>
          </View>
        </View>
      </ModalShell>

      <ModalShell visible={successVisible} onClose={onFinish}>
        <TouchableOpacity style={styles.modalBodyCentered} onPress={onFinish}>
          <TextStyle style={styles.confirmText}>Successfully Logged Out</TextStyle>
        </TouchableOpacity>
      </ModalShell>
    </>
  );
}

export const profileStyles = StyleSheet.create({
  mainContent: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuList: { marginTop: 10 },
});

const styles = StyleSheet.create({
  profileHeaderCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#C4C4C4' },
  profileInfo: { marginLeft: 20, justifyContent: 'center', flexShrink: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
  profileEmail: { fontSize: 13, color: '#777777', marginVertical: 4 },
  editProfileBtn: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  editProfileBtnText: { fontSize: 11, color: '#555555' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  menuText: { flex: 1, fontSize: 14, color: '#111111', marginLeft: 12 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: { width: '80%', backgroundColor: '#FFFFFF', borderRadius: 6, overflow: 'hidden', elevation: 5 },
  modalHeader: {
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalHeaderTitleRow: { flexDirection: 'row', alignItems: 'center' },
  modalHeaderTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  modalBody: { padding: 16 },
  modalBodyCentered: { padding: 24, alignItems: 'center' },
  prefRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  prefLabelRow: { flexDirection: 'row', alignItems: 'center' },
  prefLabel: { fontSize: 13, marginLeft: 10, color: '#333' },
  confirmText: { fontSize: 13, color: '#333', marginBottom: 20, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' },
  modalBtn: { backgroundColor: '#1E3A8A', paddingHorizontal: 24, paddingVertical: 6, borderRadius: 4 },
  modalBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
});
