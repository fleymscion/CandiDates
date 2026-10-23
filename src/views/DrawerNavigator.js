import React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GeneralCalendar, HighlightCalendar, HiddenCalendar } from './CalendarScreens';
import EmployeeProfileView from './EmployeeProfileView';
import EmployerProfileView from './EmployerProfileView';
import { EventProvider } from './EventContext';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ userRole = 'Employee', userData }) {
  // Dynamic profile screen wrapper that switches between Employee and Employer views
  function ProfileScreenWrapper({ navigation }) {
    if (userRole === 'Employer') {
      return <EmployerProfileView navigation={navigation} employerData={userData} />;
    }
    return <EmployeeProfileView navigation={navigation} employeeData={userData} />;
  }

  return (
    <EventProvider>
      <Drawer.Navigator
        initialRouteName="General Calendar"
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerLabelStyle: { fontSize: 22, color: '#011F5B' },
          drawerStyle: { backgroundColor: '#F5F9FF' },
        }}
      >
        <Drawer.Screen name="Dates Saved" component={HighlightCalendar} />
        <Drawer.Screen name="General Calendar" component={GeneralCalendar} />
        <Drawer.Screen name="Profile" component={ProfileScreenWrapper} />

        {/* Employer-only drawer option as seen in wireframes */}
        {userRole === 'Employer' && (
          <Drawer.Screen name="Posted Events" component={GeneralCalendar} />
        )}

        <Drawer.Screen name="Hidden Dates" component={HiddenCalendar} />
      </Drawer.Navigator>
    </EventProvider>
  );
}

const styles = StyleSheet.create({
  bodyText: { fontSize: 16, color: '#333333', padding: 16 },
});
