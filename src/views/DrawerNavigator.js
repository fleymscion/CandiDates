import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { GeneralCalendar, HiddenCalendar, HighlightCalendar } from './CalendarScreens';
import EmployeeProfileView from './EmployeeProfileView';
import EmployerProfileView from './EmployerProfileView';
import { EventProvider } from './EventContext';

const Drawer = createDrawerNavigator();

function ProfileScreenWrapper({ navigation, userRole, userData }) {
  if (userRole === 'Employer') {
    return <EmployerProfileView navigation={navigation} employerData={userData} />;
  }
  return <EmployeeProfileView navigation={navigation} employeeData={userData} />;
}

export default function DrawerNavigator({ userRole = 'Employee', userData }) {
  return (
    <NavigationContainer>
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
          
          <Drawer.Screen name="Profile">
            {(props) => (
              <ProfileScreenWrapper 
                {...props} 
                userRole={userRole} 
                userData={userData} 
              />
            )}
          </Drawer.Screen>

          {userRole === 'Employer' && (
            <Drawer.Screen name="Posted Events" component={GeneralCalendar} />
          )}

          <Drawer.Screen name="Hidden Dates" component={HiddenCalendar} />
        </Drawer.Navigator>
      </EventProvider>
    </NavigationContainer>
  );
}