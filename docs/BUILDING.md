# Building CandiDates

This guide explains how to set up the development environment and build the CandiDates Android application locally.

CandiDates uses React Native, Expo, and JavaScript, with Firebase integration. The instructions below cover installing dependencies, generating the native Android project, building a debug APK, and preparing a release build.

> **Note:** Build settings may vary between repository revisions. Always verify the configuration files in the exact version of the repository you are building.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting the Source Code](#getting-the-source-code)
- [Installing Dependencies](#installing-dependencies)
- [Configuring the Environment](#configuring-the-environment)
- [Generating the Android Project](#generating-the-android-project)
- [Building a Debug APK](#building-a-debug-apk)
- [Building a Release APK](#building-a-release-apk)
- [Installing the APK](#installing-the-apk)
- [Firebase Configuration](#firebase-configuration)
- [Troubleshooting](#troubleshooting)
- [Useful References](#useful-references)

## Prerequisites

Install the following tools before building the application.

| Requirement | Purpose |
|---|---|
| Git | Clone the repository |
| Node.js | Run JavaScript tooling and project scripts |
| npm | Install project dependencies |
| Java Development Kit (JDK) | Compile the Android application |
| Android Studio | Install Android SDK tools and manage the Android development environment |
| Android SDK | Compile and package the Android application |

Install Node.js from the [official Node.js download page](https://nodejs.org/en/download).

Install Android Studio and the required SDK components using the [Android Studio installation guide](https://developer.android.com/studio/install). For React Native development requirements, see the [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment).

Use Node.js and Java versions compatible with the project's dependencies and Android build configuration. JDK 17 is a recommended starting point for the Android build environment, provided it is compatible with the Gradle and Android Gradle Plugin versions in the project.

Verify your installations with:

```bash
git --version
node --version
npm --version
java -version
```

If the Android SDK is installed, ensure that your environment is configured to locate it. The `ANDROID_HOME` environment variable is commonly used for this purpose.

## Getting the Source Code

Clone the repository:

```bash
git clone https://github.com/fleymscion/CandiDates.git
```

Navigate to the project directory:

```bash
cd CandiDates
```

If you need to build a specific branch or release, check out the intended revision before continuing.

To inspect the available branches:

```bash
git branch -a
```

To check the current revision:

```bash
git status
git log -1 --oneline
```

## Installing Dependencies

Install the dependencies declared by the project.

If the repository includes a `package-lock.json`, use:

```bash
npm ci
```

The `npm ci` command installs the exact dependency versions recorded in the lockfile and is recommended for clean installations.

Alternatively, use:

```bash
npm install
```

This command installs the dependencies declared in `package.json` and may update the lockfile when necessary.

Use the package manager and lockfile intended for the repository. Avoid changing dependency versions unless necessary to resolve a documented compatibility issue.

To inspect the available project scripts, open `package.json` and review its `scripts` section.

For additional information about Expo and React Native dependencies, refer to the [Expo documentation](https://docs.expo.dev/) and the [React Native documentation](https://reactnative.dev/docs/getting-started).

## Configuring the Environment

Before generating or building the Android project, inspect the repository for configuration files used by Expo and React Native.

Common files include:

- `package.json`
- `package-lock.json`
- `app.json` or `app.config.js` / `app.config.ts`
- `eas.json`, if the project uses Expo Application Services
- `.env` files or other environment-specific configuration
- `android/`, if the native Android project is already included

If the application requires environment variables, configure them according to the project's existing implementation and documentation.

See the [Expo app configuration documentation](https://docs.expo.dev/workflow/configuration/) for information about application configuration and the [Expo environment variables guide](https://docs.expo.dev/guides/environment-variables/) for environment-specific settings.

Do not commit passwords, private keys, service-account credentials, or other sensitive configuration to version control.

## Generating the Android Project

If the repository does not already contain the native Android project, generate it using Expo Prebuild:

```bash
npx expo prebuild --platform android
```

This command generates the native Android project from the Expo configuration and application dependencies.

If an `android/` directory already exists, inspect it before running Prebuild. Regenerating native files can change or overwrite existing native project configuration, depending on the current project state.

After generation, the Android project should be available in the `android/` directory.

## Building a Debug APK

A debug APK is suitable for local testing and development.

### Windows

Open PowerShell or Command Prompt from the repository root:

```powershell
cd android
.\gradlew.bat assembleDebug
```

### macOS and Linux

Open a terminal from the repository root:

```bash
cd android
./gradlew assembleDebug
```

The Gradle build may take several minutes the first time because it needs to resolve dependencies and compile the application.

If the build succeeds, the debug APK is typically generated at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

The debug APK is signed with a debug key and is intended for testing. It is not a substitute for a properly signed production release.

## Building a Release APK

A release APK is intended for distribution and must be signed with an appropriate release key.

Before building, verify the following:

- The Android application ID is correct.
- The release signing configuration is properly set up.
- Required environment variables and configuration files are available.
- The generated APK can be installed and tested on a target device.
- Production-specific application settings are configured correctly.

### Configure Release Signing

Android release signing typically requires:

- A keystore file
- A keystore password
- A key alias
- A key password

Follow the signing configuration already used by the project.

If the project does not yet have a release signing configuration, consult the [Android app signing guide](https://developer.android.com/studio/publish/app-signing) before adding one.

Store signing credentials securely. Do not commit the keystore or passwords to the repository.

### Run the Release Build

From the repository root:

**Windows:**

```powershell
cd android
.\gradlew.bat assembleRelease
```

**macOS and Linux:**

```bash
cd android
./gradlew assembleRelease
```

If the release signing configuration is missing or incomplete, Gradle may fail or produce an APK that is not suitable for distribution.

A successful build typically produces the release APK at:

```text
android/app/build/outputs/apk/release/app-release.apk
```

The exact output location may vary if the project customizes its Gradle build configuration.

Verify that the generated APK is signed with the intended release key before distributing it.

## Installing the APK

### Install Using Android Debug Bridge (ADB)

Connect an Android device with USB debugging enabled, or start an Android emulator.

Verify that the device is detected:

```bash
adb devices
```

Install the debug APK:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

The `-r` option allows an existing installation to be replaced when Android permits the update.

If installation fails because of a signature mismatch, uninstall the existing application or use a build signed with the same key as the installed version.

### Install Manually

You can also transfer the APK to an Android device and open it to install the application.

Depending on the device's settings, Android may require permission to install applications from the source used to open the APK.

Only install APK files from sources you trust.

## Firebase Configuration

CandiDates uses the Firebase JavaScript SDK with Expo for backend services, including Firebase Authentication and Cloud Firestore.

The Firebase configuration is initialized within the application using the Firebase project settings.

Successfully building the Android application does not necessarily mean that Firebase-backed features will work correctly.

Before building and testing the application, verify that:

- The Firebase project configuration is correct.
- Firebase Authentication is properly configured and enabled.
- Cloud Firestore is configured and accessible.
- Firestore security rules allow the intended application operations.
- The application is connected to the correct Firebase project.
- Required environment variables or configuration values are available.
- Private keys, service-account credentials, and other sensitive information are not committed to GitHub.

The Android package ID configured for CandiDates is:

```text
com.mobcom.candidates
```

The package ID identifies the Android application. It does not automatically need to match the Firebase JavaScript SDK configuration, unless native Firebase configuration is also being used.

For setup instructions and additional information, refer to:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Using Firebase with Expo](https://docs.expo.dev/guides/using-firebase/)

## Troubleshooting

### Dependency Installation Fails

Try the following:

1. Verify the installed Node.js and npm versions.
2. Confirm that the repository's `package.json` and `package-lock.json` are consistent.
3. Review the error message for the dependency that failed to install.
4. Use the package manager and lockfile intended for the project.

See the [npm documentation](https://docs.npmjs.com/) for dependency-management guidance. For problems involving Expo dependencies, consult the [Expo documentation](https://docs.expo.dev/).

### Expo Prebuild Fails

Check that all project dependencies are installed and that the Expo configuration is valid.

You can inspect the project configuration with:

```bash
npx expo config
```

Review the terminal output for missing packages, invalid configuration values, or incompatible dependencies.

### Gradle Build Fails

Try these steps:

1. Read the first meaningful error in the Gradle output.
2. Verify that the installed JDK is compatible with the Gradle and Android Gradle Plugin versions used by the project.
3. Check the Android SDK installation and required SDK components.
4. Confirm that network access is available when Gradle needs to download dependencies.
5. Inspect the native Android configuration for missing properties or environment variables.

For additional guidance, refer to the [Android build documentation](https://developer.android.com/build) and the [Gradle user manual](https://docs.gradle.org/current/userguide/userguide.html).

To clean the Android build outputs, run the following from the repository root.

**Windows:**

```powershell
cd android
.\gradlew.bat clean
```

**macOS and Linux:**

```bash
cd android
./gradlew clean
```

Then retry the appropriate build command.

### APK Is Missing After the Build

Check whether Gradle reported a successful build.

If it did, inspect the relevant output directory:

```text
android/app/build/outputs/apk/
```

The APK's location can differ if the project defines custom build types, product flavors, or output paths.

### Firebase Features Do Not Work

A successful compilation does not verify the runtime configuration of Firebase.

Check that the correct Firebase project and required configuration are available, the relevant services are enabled, and the configured access rules permit the intended operations.

Inspect the Android logs and application error messages for further details.

See the [Firebase documentation](https://firebase.google.com/docs) for service-specific setup and troubleshooting instructions.

### APK Cannot Be Installed

Verify that:

- The APK was built successfully.
- The device's Android version is supported by the application.
- The APK architecture and package configuration are compatible with the device.
- There is enough storage space.
- An existing installation does not conflict with the signing key or package configuration.

For more detailed installation errors, use:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Read the message returned by ADB to identify the cause.

See the [ADB documentation](https://developer.android.com/tools/adb) for additional troubleshooting commands.
