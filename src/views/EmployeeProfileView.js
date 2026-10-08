import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './SafeAreaView';
import TextStyle from './AppText';

export default function EmployeeProfileView({ navigation, employeeData }) {
  const employeeName = employeeData?.name || 'Employee Name';
  const email = employeeData?.email || 'Email';

  return (
    <Template title="Profile" navigation={navigation}>
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Employee Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatar} />
          <View style={styles.profileInfo}>
            <TextStyle style={styles.employeeName}>{employeeName}</TextStyle>
            <TextStyle style={styles.employeeEmail}>{email}</TextStyle>

            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => navigation?.navigate('EditProfileFrame')}
            >
              <TextStyle style={styles.editProfileBtnText}>Edit Profile</TextStyle>
            </TouchableOpacity>
          </View>
        </View>

        {/* Employee Specific Menu Options */}
        <View style={styles.menuList}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation?.navigate('HighlightedEvents')}
          >
            <Ionicons name="heart-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Highlighted Events (Saved Dates)</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation?.navigate('ResumesAndPortfolios')}
          >
            <Ionicons name="download-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Resume & Portfolio Files</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation?.navigate('JobCategories')}
          >
            <Ionicons name="globe-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Job Categories / Interests</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation?.navigate('NotificationPreferences')}
          >
            <Ionicons name="notifications-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Notification Preferences</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation?.navigate('CalendarViewMode')}
          >
            <Ionicons name="calendar-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Calendar View Mode</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation?.navigate('LogoutModal')}
          >
            <Ionicons name="log-out-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Log Out</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Template>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#C4C4C4',
  },
  profileInfo: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  employeeEmail: {
    fontSize: 13,
    color: '#777777',
    marginVertical: 4,
  },
  editProfileBtn: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  editProfileBtnText: {
    fontSize: 11,
    color: '#555555',
  },
  menuList: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});
