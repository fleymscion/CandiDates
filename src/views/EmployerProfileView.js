import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import TextStyle from './AppText';
import { EmployerProfileController } from '../controllers/EmployerProfileController';

export default function EmployerProfileView({ navigation, employerData, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [logoutSuccessVisible, setLogoutSuccessVisible] = useState(false);

  // Notification Preferences states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toggleOff, setToggleOff] = useState(false);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      try {
        const data = await EmployerProfileController.fetchProfile(employerData?.id || employerData?.uid);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [employerData]);

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    setLogoutSuccessVisible(true);
  };

  const handleFinishLogout = () => {
    setLogoutSuccessVisible(false);
    if (onNavigate) {
      onNavigate('Login');
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Login');
    }
  };

  if (loading) {
    return (
      <Template title="Profile" navigation={navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#011F5B" />
        </View>
      </Template>
    );
  }

  return (
    <Template title="Profile" navigation={navigation}>
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Employer Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatar} />
          <View style={styles.profileInfo}>
            <TextStyle style={styles.employerName}>{profile?.name || 'Employer Name'}</TextStyle>
            <TextStyle style={styles.employerEmail}>{profile?.email || 'Email'}</TextStyle>

            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => navigation?.navigate('EditProfileFrame')}
            >
              <TextStyle style={styles.editProfileBtnText}>Edit Profile</TextStyle>
            </TouchableOpacity>
          </View>
        </View>

        {/* Employer Specific Menu Options (Matching Figma exactly) */}
        <View style={styles.menuList}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => EmployerProfileController.handlePostEvent(navigation)}
          >
            <Ionicons name="heart-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Post a new event</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => EmployerProfileController.handleDashboard(navigation)}
          >
            <Ionicons name="globe-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Dashboard</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setNotifModalVisible(true)}
          >
            <Ionicons name="notifications-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Notification Preferences</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => EmployerProfileController.handleCalendarViewMode(navigation)}
          >
            <Ionicons name="calendar-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Calendar View Mode</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => EmployerProfileController.handleClearCalendarCache?.(navigation)}
          >
            <Ionicons name="trash-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Clear Offline Calendar Cache</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Ionicons name="log-out-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Log Out</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL 1: NOTIFICATION PREFERENCES */}
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

      {/* MODAL 2: LOG OUT CONFIRMATION */}
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

      {/* MODAL 3: LOGOUT SUCCESS */}
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
    </Template>
  );
}

const styles = StyleSheet.create({
  mainContent: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHeaderCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#C4C4C4' },
  profileInfo: { marginLeft: 20, justifyContent: 'center' },
  employerName: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
  employerEmail: { fontSize: 13, color: '#777777', marginVertical: 4 },
  editProfileBtn: { backgroundColor: '#E5E5E5', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', marginTop: 4 },
  editProfileBtnText: { fontSize: 11, color: '#555555' },
  menuList: { marginTop: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  menuText: { flex: 1, fontSize: 14, color: '#111111', marginLeft: 12 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: '#FFFFFF', borderRadius: 6, overflow: 'hidden', elevation: 5 },
  modalHeader: { backgroundColor: '#1E3A8A', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
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
});import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import TextStyle from './AppText';
import { EmployerProfileController } from '../controllers/EmployerProfileController';

export default function EmployerProfileView({ navigation, employerData, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [logoutSuccessVisible, setLogoutSuccessVisible] = useState(false);

  // Notification Preferences states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toggleOff, setToggleOff] = useState(false);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      try {
        const data = await EmployerProfileController.fetchProfile(employerData?.id || employerData?.uid);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [employerData]);

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    setLogoutSuccessVisible(true);
  };

  const handleFinishLogout = () => {
    setLogoutSuccessVisible(false);
    if (onNavigate) {
      onNavigate('Login');
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Login');
    }
  };

  if (loading) {
    return (
      <Template title="Profile" navigation={navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#011F5B" />
        </View>
      </Template>
    );
  }

  return (
    <Template title="Profile" navigation={navigation}>
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Employer Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatar} />
          <View style={styles.profileInfo}>
            <TextStyle style={styles.employerName}>{profile?.name || 'Employer Name'}</TextStyle>
            <TextStyle style={styles.employerEmail}>{profile?.email || 'Email'}</TextStyle>

            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => navigation?.navigate('EditProfileFrame')}
            >
              <TextStyle style={styles.editProfileBtnText}>Edit Profile</TextStyle>
            </TouchableOpacity>
          </View>
        </View>

        {/* Employer Specific Menu Options (Matching Figma exactly) */}
        <View style={styles.menuList}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => EmployerProfileController.handlePostEvent(navigation)}
          >
            <Ionicons name="heart-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Post a new event</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => EmployerProfileController.handleDashboard(navigation)}
          >
            <Ionicons name="globe-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Dashboard</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setNotifModalVisible(true)}
          >
            <Ionicons name="notifications-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Notification Preferences</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => EmployerProfileController.handleCalendarViewMode(navigation)}
          >
            <Ionicons name="calendar-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Calendar View Mode</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => EmployerProfileController.handleClearCalendarCache?.(navigation)}
          >
            <Ionicons name="trash-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Clear Offline Calendar Cache</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Ionicons name="log-out-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Log Out</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL 1: NOTIFICATION PREFERENCES */}
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

      {/* MODAL 2: LOG OUT CONFIRMATION */}
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

      {/* MODAL 3: LOGOUT SUCCESS */}
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
    </Template>
  );
}

const styles = StyleSheet.create({
  mainContent: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHeaderCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#C4C4C4' },
  profileInfo: { marginLeft: 20, justifyContent: 'center' },
  employerName: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
  employerEmail: { fontSize: 13, color: '#777777', marginVertical: 4 },
  editProfileBtn: { backgroundColor: '#E5E5E5', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', marginTop: 4 },
  editProfileBtnText: { fontSize: 11, color: '#555555' },
  menuList: { marginTop: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  menuText: { flex: 1, fontSize: 14, color: '#111111', marginLeft: 12 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: '#FFFFFF', borderRadius: 6, overflow: 'hidden', elevation: 5 },
  modalHeader: { backgroundColor: '#1E3A8A', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
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
