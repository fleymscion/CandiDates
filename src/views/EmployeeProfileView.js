import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Template from './Header';
import { EmployeeProfileController } from '../controllers/EmployeeProfileController';
import { DEFAULT_NOTIFICATION_PREFS } from '../models/UserPreferencesModel';
import {
  LogoutModals,
  MenuDivider,
  MenuItem,
  NotificationPreferencesModal,
  ProfileHeader,
  profileStyles,
} from './ProfileParts';

export default function EmployeeProfileView({ navigation, employeeData, onNavigate }) {
  const userId = employeeData?.id || employeeData?.uid;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifPrefs, setNotifPrefs] = useState(DEFAULT_NOTIFICATION_PREFS);

  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [logoutSuccessVisible, setLogoutSuccessVisible] = useState(false);

  // Reload whenever this screen gains focus so edits made on other screens show up.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function loadProfileData() {
        try {
          const [data, prefs] = await Promise.all([
            EmployeeProfileController.fetchProfile(userId),
            EmployeeProfileController.loadNotificationPrefs(userId),
          ]);
          if (!active) return;
          setProfile(data);
          setNotifPrefs(prefs);
        } catch (err) {
          console.error(err);
        } finally {
          if (active) setLoading(false);
        }
      }
      loadProfileData();
      return () => {
        active = false;
      };
    }, [userId])
  );

  const handleNotifChange = (next) => {
    const previous = notifPrefs;
    setNotifPrefs(next);
    EmployeeProfileController.saveNotificationPrefs(userId, next).catch(() => {
      setNotifPrefs(previous);
      Alert.alert('Could not save', 'Your notification preferences were not saved. Please try again.');
    });
  };

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    const result = await EmployeeProfileController.handleLogout();
    if (result.success) setLogoutSuccessVisible(true);
    else Alert.alert('Log out failed', result.error);
  };

  const handleFinishLogout = () => {
    setLogoutSuccessVisible(false);
    onNavigate?.('Login');
  };

  if (loading) {
    return (
      <Template title="Profile" navigation={navigation}>
        <View style={profileStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#011F5B" />
        </View>
      </Template>
    );
  }

  return (
    <Template title="Profile" navigation={navigation}>
      <ScrollView style={profileStyles.mainContent} showsVerticalScrollIndicator={false}>
        <ProfileHeader
          name={profile?.name || 'Employee Name'}
          email={profile?.email}
          onEdit={() => navigation?.navigate('EditProfileFrame')}
        />

        <View style={profileStyles.menuList}>
          <MenuItem
            icon="heart-outline"
            label="Highlighted Events (Saved Dates)"
            onPress={() => EmployeeProfileController.handleHighlightedEvents(navigation)}
          />
          <MenuItem
            icon="download-outline"
            label="Resume & Portfolio Files"
            onPress={() => EmployeeProfileController.handleResumesAndPortfolios(navigation)}
          />
          <MenuItem
            icon="globe-outline"
            label="Job Categories / Interests"
            onPress={() => EmployeeProfileController.handleJobCategories(navigation)}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notification Preferences"
            onPress={() => setNotifModalVisible(true)}
          />
          <MenuItem
            icon="calendar-outline"
            label="Calendar View Mode"
            onPress={() => EmployeeProfileController.handleCalendarViewMode(navigation)}
          />
          <MenuDivider />
          <MenuItem icon="log-out-outline" label="Log Out" onPress={() => setLogoutModalVisible(true)} />
        </View>
      </ScrollView>

      <NotificationPreferencesModal
        visible={notifModalVisible}
        onClose={() => setNotifModalVisible(false)}
        prefs={notifPrefs}
        onChange={handleNotifChange}
      />
      <LogoutModals
        confirmVisible={logoutModalVisible}
        successVisible={logoutSuccessVisible}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
        onFinish={handleFinishLogout}
      />
    </Template>
  );
}
