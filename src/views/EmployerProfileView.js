import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './SafeAreaView';
import TextStyle from './AppText';

export default function EmployerProfileView({ navigation, employerData }) {
  const username = employerData?.username || 'Employer Name';
  const email = employerData?.email || 'Email';

  return (
    <Template title="Profile" navigation={navigation}>
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatar} />
          <View style={styles.profileInfo}>
            <TextStyle style={styles.employerName}>{username}</TextStyle>
            <TextStyle style={styles.employerEmail}>{email}</TextStyle>

            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => navigation?.navigate('EditProfileFrame')}
            >
              <TextStyle style={styles.editProfileBtnText}>Edit Profile</TextStyle>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options List */}
        <View style={styles.menuList}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation?.navigate('PostNewEvent')}
          >
            <Ionicons name="heart-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Post a new event</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation?.navigate('Dashboard')}
          >
            <Ionicons name="globe-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Dashboard</TextStyle>
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
            onPress={() => console.log('Clear cache pressed')}
          >
            <Ionicons name="trash-outline" size={20} color="#333" />
            <TextStyle style={styles.menuText}>Clear Offline Calendar Cache</TextStyle>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>

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
  employerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  employerEmail: {
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