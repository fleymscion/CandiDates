# CandiDates

CandiDates is a mobile and web app that connects **employees** / **candidates** (job seekers) with **employers** through a shared calendar of hiring events. Employers post events such as interview sessions and job fairs. Employees browse the calendar, save the events they like, dismiss the ones they don't, and open a detail popup to read about the company. Employers can see how each of their posts is performing.

Built with React Native and Expo, with Firebase (Authentication and Cloud Firestore) as the backend.

---

## Features

### For everyone
- **Sign up and log in** with email and password, with form validation and clear error messages.
- **Role-based accounts:** each user signs up as an *Employee* or an *Employer*.
- **Forgot password** flow that sends a reset email.
- **Onboarding that runs once.** A completion flag (`onboardingComplete`) is stored on the user's profile, so finished users go straight to the app and a saved profile is never overwritten.
- **General calendar** showing events as cards, in grid or list view (Calendar View Mode).
- **Event detail popup:** tap any card to see the image, tags, company, contact details, location and date.
- **Save and dismiss:** heart an event to keep it in *Dates Saved*, or dismiss it into *Hidden Dates*. These choices are private to each user.
- **Drawer navigation** and a shared header that respects phone safe areas (notch, status bar, home indicator).
- **Formal notification popup** used for every alert in the app.
- **Profile screens** with notification preferences and calendar view mode.

### Employees
- 6-step onboarding: resume (skippable), profile photo (skippable), work experience, education, skills, review.
- Drawer: Dates Saved, General Calendar, Profile, Hidden Dates.
- Profile links: saved dates, resume and portfolio files, interest tags, notification preferences, calendar view mode, log out.

### Employers
- 4-step onboarding: company info, business verification (skippable), about and contact, review. Required fields can't be left blank.
- **Post new events** (title, date, location, description, contact phone, tags). Company name and contact email are copied from the employer's profile automatically.
- **Posted Events** screen listing only the events that employer created, with delete.
- **Stats button** on each of the employer's own posts, opening analytics for that post: views, saves, and the candidates behind them.
- Drawer: Dates Saved, General Calendar, Profile, Posted Events, Hidden Dates.
- Profile links: notification popup, notification preferences, calendar view mode, clear offline calendar cache, log out.

---

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | React Native with Expo |
| Navigation | React Navigation (drawer) plus a state-based screen switcher in `App.js` |
| Backend | Firebase Authentication and Cloud Firestore |
| Icons | `@expo/vector-icons` (Ionicons) |
| Font | Commissioner |
| File and image picking | `expo-document-picker`, `expo-image-picker` |
| Safe areas | `react-native-safe-area-context` |

---

## Getting started

### Prerequisites
- Node.js (LTS) and npm
- A Firebase project with **Authentication (Email/Password)** and **Cloud Firestore** enabled
- For testing on a phone: the **Expo Go** app. Its supported SDK version must match the SDK your project uses.

### Install and run

```bash
npm install
npx expo install --fix      # aligns Expo packages with the project's SDK version
npx expo start -c           # -c clears the Metro cache
```

Then:
- press `w` to open the web version, or
- scan the QR code with Expo Go (Android) or the Camera app (iPhone).

If your phone can't reach your computer, make sure both are on the same Wi-Fi and Node.js is allowed through your firewall for private networks. You can also try `npx expo start --tunnel`, which requires `npx expo login`.

### Firebase setup

1. In the Firebase console, create a project and add a web app.
2. In **Authentication**, turn on **Email/Password**.
3. Create a **Cloud Firestore** database.
4. Put your Firebase config in `src/config/firebase.js`. The file must export `auth` and `db`.
5. Publish the security rules from the section below.

On phones, Firestore can fail to connect over some networks. If reads hang on a phone but work on web, create the database with long polling enabled:

```javascript
const db = initializeFirestore(app, { experimentalForceLongPolling: true });
```

---

## Project structure

```
App.js                      Root: loads the font, switches screens, mounts the alert popup
assets/                     Images and the Commissioner font
src/
  config/firebase.js        Firebase initialization (exports auth, db)
  controllers/              Business logic (signup, login, profiles, analytics, preferences)
  models/                   Data models (e.g. SavedDate)
  views/                    Screens and components
    SplashScreen.js
    SignupView.js / LoginView.js / ForgotPassView.js / ResetEmailSentView.js
    EmployeeOnboardingScreen.js + EmployeeOnboarding.js
    EmployerOnboardingScreen.js + EmployerOnboarding.js
    DrawerNavigator.js      Role-based drawer and screen registration
    Header.js               Shared header with safe-area padding
    CalendarScreens.js      General, Saved (highlight) and Hidden calendars
    EventCard.js            Event card with tap-to-open details and the Stats button
    EventDetailModal.js     Event detail popup
    EventContext.js         Real-time events plus each user's private saved/hidden state
    EmployerPostsView.js    Employer's own posts
    PostNewEventView.js     Form for posting an event
    DashboardView.js        Per-post analytics, opened from the Stats button
    EmployeeProfileView.js / EmployerProfileView.js / EditProfileView.js
    showAlert.js            Notification popup (AlertHost mounted in App.js)
```

Onboarding is split in two on purpose. The `...Screen.js` file holds the state, validation and Firebase calls, and the plain file next to it only draws the UI.

---

## How it works

### Screen flow

```
Splash -> Sign Up -> Log In
Log In -> valid? -> No: warning popup
                 -> Yes: role?
   Employee: onboardingComplete? -> No: Employee Onboarding -> Main app
                                 -> Yes: Main app
   Employer: onboardingComplete? -> No: Employer Onboarding -> Main app
                                 -> Yes: Main app
Main app = Drawer (General Calendar, Dates Saved, Hidden Dates, Profile, and Posted Events for employers)
```

### Events and private state

- Events are **shared**: one document per posting in the `events` collection, read by every signed-in user.
- Each user's **saved and hidden** state is **private**, stored under `users/{uid}/eventPrefs/{eventId}`. `EventContext` listens to both and merges them, so saving an event never affects another user.

### Analytics

- Opening an event's detail popup records a **view** (`postViews`). Views by the post's owner aren't counted.
- Hearting an event records a **save** (`savedDates`).
- Each record stores the post owner's `employerId`, so only that employer can read the stats. They open from the **Stats** button on the employer's own posts.

---

## Known limitations

- **No file storage yet.** Resumes, profile photos, company logos and business permits are not uploaded. Only the file name is saved, and photos are shown during onboarding but not stored. Adding a paid Firebase Storage would fix this.
- **Expo Go SDK matching.** Expo Go only runs projects built for its supported SDK, so keep the project on the same SDK as the Expo Go version you test with.
