import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { EmployeeProfileController } from '../controllers/EmployeeProfileController';
import { EmployerProfileController } from '../controllers/EmployerProfileController';
import { PreferencesController } from '../controllers/PreferencesController';
import { GeneralCalendar, HiddenCalendar, HighlightCalendar } from './CalendarScreens';
import CalendarViewModeView from './CalendarViewModeView';
import DashboardView from './DashboardView';
import EditProfileView from './EditProfileView';
import EmployeeProfileView from './EmployeeProfileView';
import EmployerPostsView from './EmployerPostsView';
import EmployerProfileView from './EmployerProfileView';
import { EventProvider, useEvents } from './EventContext';
import JobCategoriesView from './JobCategoriesView';
import PostNewEventView from './PostNewEventView';
import { PreferencesProvider } from './PreferencesContext';
import ResumesPortfoliosView from './ResumesPortfoliosView';

const Drawer = createDrawerNavigator();

// Screens reachable from the Profile menu but not shown in the side drawer.
const hiddenFromDrawer = { drawerItemStyle: { display: 'none' } };

const getUserId = (userData) => userData?.id || userData?.uid;

// Accepts "employer", "Employer", "EMPLOYER", etc. and returns 'Employer' or 'Employee'
const normalizeRole = (userRole) =>
  String(userRole || '').trim().toLowerCase() === 'employer' ? 'Employer' : 'Employee';

function ProfileScreenWrapper({ navigation, userRole, userData, onNavigate }) {
  if (userRole === 'Employer') {
    return <EmployerProfileView navigation={navigation} employerData={userData} onNavigate={onNavigate} />;
  }
  return <EmployeeProfileView navigation={navigation} employeeData={userData} onNavigate={onNavigate} />;
}

function EditProfileScreen({ navigation, userRole, userData }) {
  const controller = userRole === 'Employer' ? EmployerProfileController : EmployeeProfileController;
  const userId = getUserId(userData);
  const [initial, setInitial] = useState(null);

  // Load the saved values (including tags / additional contacts) each time the screen opens
  useFocusEffect(
    useCallback(() => {
      let active = true;
      PreferencesController.loadEditableProfile(userId)
        .then((data) => {
          if (active) setInitial(data);
        })
        .catch((e) => console.warn('Could not load profile for editing:', e?.message));
      return () => {
        active = false;
      };
    }, [userId])
  );

  return (
    <EditProfileView
      navigation={navigation}
      userRole={userRole}
      userData={initial || userData}
      onSave={(data) => controller.updateProfile(userId, data)} // rejection is handled inside EditProfileView
    />
  );
}

function PostEventScreen({ navigation, userData }) {
  const { addEvent } = useEvents();
  const handleSubmit = (formData) => {
    const event = EmployerProfileController.buildEvent(getUserId(userData), formData);
    addEvent(event); // show it in the calendar right away
    EmployerProfileController.postEvent(event).catch((e) => console.error('Could not save event:', e));
  };
  return <PostNewEventView navigation={navigation} onSubmit={handleSubmit} />;
}

export default function DrawerNavigator({ userRole = 'Employee', userData, onNavigate }) {
  console.log('DrawerNavigator userRole:', userRole);
  // TEMPORARY TEST: forces the Employer screens to show.
   
const role = normalizeRole(userData?.role || userData?.userRole || userRole);  //const role = 'Employer';
  const isEmployer = role === 'Employer';

  return (
    <NavigationContainer>
      <EventProvider>
        <PreferencesProvider userId={getUserId(userData)}>
          <Drawer.Navigator
            initialRouteName="General Calendar"
            backBehavior="history" // so goBack() from a Profile sub-screen returns to Profile
            screenOptions={{
              headerShown: false,
              drawerType: 'front',
              drawerLabelStyle: { fontSize: 22, color: '#011F5B' },
              drawerStyle: { backgroundColor: '#F5F9FF' },
            }}
          >
            {/* Route name must be 'Highlight Calendar' (the profile controller navigates to it); label stays "Dates Saved" */}
            <Drawer.Screen
              name="Highlight Calendar"
              component={HighlightCalendar}
              options={{ drawerLabel: 'Dates Saved' }}
            />
            <Drawer.Screen name="General Calendar" component={GeneralCalendar} />

            <Drawer.Screen name="Profile">
              {(props) => <ProfileScreenWrapper {...props} userRole={role} userData={userData} onNavigate={onNavigate} />}
            </Drawer.Screen>

            {isEmployer && (
              <Drawer.Screen name="Posted Events">
                {(props) => <EmployerPostsView {...props} userData={userData} />}
              </Drawer.Screen>
            )}
            <Drawer.Screen name="Hidden Dates" component={HiddenCalendar} />

            {/* ---- Profile menu destinations (hidden from the drawer list) ---- */}
            <Drawer.Screen name="CalendarViewMode" component={CalendarViewModeView} options={hiddenFromDrawer} />
            <Drawer.Screen name="EditProfileFrame" options={hiddenFromDrawer}>
              {(props) => <EditProfileScreen {...props} userRole={role} userData={userData} />}
            </Drawer.Screen>

            {isEmployer ? (
              <>
                <Drawer.Screen name="PostNewEvent" options={hiddenFromDrawer}>
                  {(props) => <PostEventScreen {...props} userData={userData} />}
                </Drawer.Screen>
                <Drawer.Screen name="Dashboard" component={DashboardView} options={hiddenFromDrawer} />
              </>
            ) : (
              <>
                <Drawer.Screen name="ResumesAndPortfolios" options={hiddenFromDrawer}>
                  {(props) => <ResumesPortfoliosView {...props} userData={userData} />}
                </Drawer.Screen>
                <Drawer.Screen name="JobCategories" options={hiddenFromDrawer}>
                  {(props) => <JobCategoriesView {...props} userData={userData} />}
                </Drawer.Screen>
              </>
            )}
          </Drawer.Navigator>
        </PreferencesProvider>
      </EventProvider>
    </NavigationContainer>
  );
}