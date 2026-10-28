import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import TextStyle from './AppText';

export default function SettingsProfileView({ navigation, onNavigate }) {
  // Modal visibility states
  const [notifModalVisible, setNotifModalVisible] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [logoutSuccessVisible, setLogoutSuccessVisible] = useState(false);

  // Notification Preferences states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toggleOff, setToggleOff] = useState(false);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);

  // Handle Logout Confirmation
  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    setLogoutSuccessVisible(true);
  };

  // Close Success Modal & Navigate to Login
  const handleFinishLogout = () => {
    setLogoutSuccessVisible(false);
    if (onNavigate) {
      onNavigate('Login');
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Login');
    }
  };

  return (
    <Template title="Profile" navigation={navigation}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* User Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={48} color="#888" />
            </View>
            <View style={styles.profileInfo}>
              <TextStyle style={styles.userName}>Employer Name</TextStyle>
              <TextStyle style={styles.userEmail}>Email</TextStyle>
              <TouchableOpacity style={styles.editProfileBtn}>
                <TextStyle style={styles.editProfileText}>Edit Profile</TextStyle>
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Options List */}
          <View style={styles.menuContainer}>
            {/* Notification Preferences */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setNotifModalVisible(true)}
            >
              <TextStyle style={styles.menuText}>Notification Preferences</TextStyle>
              <Ionicons name="chevron-forward" size={18} color="#888" />
            </TouchableOpacity>

            {/* Calendar View Mode */}
            <TouchableOpacity style={styles.menuItem}>
              <TextStyle style={styles.menuText}>Calendar View Mode</TextStyle>
              <Ionicons name="chevron-forward" size={18} color="#888" />
            </TouchableOpacity>

            {/* Clear Offline Calendar Cache */}
            <TouchableOpacity style={styles.menuItem}>
              <TextStyle style={styles.menuText}>Clear Offline Calendar Cache</TextStyle>
              <Ionicons name="chevron-forward" size={18} color="#888" />
            </TouchableOpacity>

            {/* Log Out */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setLogoutModalVisible(true)}
            >
              <TextStyle style={styles.menuText}>Log Out</TextStyle>
              <Ionicons name="chevron-forward" size={18} color="#888" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ------------------ MODAL 1: NOTIFICATION PREFERENCES ------------------ */}
        <Modal
          visible={notifModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setNotifModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name="image-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <TextStyle style={styles.modalHeaderTitle}>CandiDate Notification</TextStyle>
                </View>
                <TouchableOpacity onPress={() => setNotifModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.prefRow}>
                  <View style={styles.prefLabelRow}>
                    <Ionicons name="volume-medium-outline" size={20} color="#011F5B" />
                    <TextStyle style={styles.prefLabel}>Toggle sound</TextStyle>
                  </View>
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                    trackColor={{ false: '#767577', true: '#011F5B' }}
                  />
                </View>

                <View style={styles.prefRow}>
                  <View style={styles.prefLabelRow}>
                    <Ionicons name="volume-mute-outline" size={20} color="#011F5B" />
                    <TextStyle style={styles.prefLabel}>Toggle off</TextStyle>
                  </View>
                  <Switch
                    value={toggleOff}
                    onValueChange={setToggleOff}
                    trackColor={{ false: '#767577', true: '#011F5B' }}
                  />
                </View>

                <View style={styles.prefRow}>
                  <View style={styles.prefLabelRow}>
                    <Ionicons name="notifications-outline" size={20} color="#011F5B" />
                    <TextStyle style={styles.prefLabel}>Toggle vibrate</TextStyle>
                  </View>
                  <Switch
                    value={vibrateEnabled}
                    onValueChange={setVibrateEnabled}
                    trackColor={{ false: '#767577', true: '#011F5B' }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* ------------------ MODAL 2: LOG OUT CONFIRMATION ------------------ */}
        <Modal
          visible={logoutModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name="image-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <TextStyle style={styles.modalHeaderTitle}>CandiDate notification</TextStyle>
                </View>
                <TouchableOpacity onPress={() => setLogoutModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBodyCentered}>
                <TextStyle style={styles.confirmText}>Are you sure you want to log out?</TextStyle>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.modalBtn} onPress={handleConfirmLogout}>
                    <TextStyle style={styles.modalBtnText}>Yes</TextStyle>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalBtn} onPress={() => setLogoutModalVisible(false)}>
                    <TextStyle style={styles.modalBtnText}>No</TextStyle>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* ------------------ MODAL 3: LOGOUT SUCCESS ------------------ */}
        <Modal
          visible={logoutSuccessVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleFinishLogout}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name="image-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <TextStyle style={styles.modalHeaderTitle}>CandiDate notification</TextStyle>
                </View>
                <TouchableOpacity onPress={handleFinishLogout}>
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.modalBodyCentered} onPress={handleFinishLogout}>
                <TextStyle style={styles.confirmText}>Successfully Logged Out</TextStyle>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </Template>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  editProfileBtn: {
    borderWidth: 1,
    borderColor: '#B5B5B5',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontSize: 11,
    color: '#666',
  },
  menuContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    fontSize: 13,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  modalHeader: {
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  modalBodyCentered: {
    padding: 24,
    alignItems: 'center',
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  prefLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefLabel: {
    fontSize: 13,
    marginLeft: 10,
    color: '#333',
  },
  confirmText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  modalBtn: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 4,
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
