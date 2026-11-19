---
name: setup
description: 'Setup the whole project'
argument-hint: 'Enter the project name, including spaces'
user-invocable: true
---

# Initialize project

Ask the user for the project name. Keep both the original name with spaces and a version with spaces removed for the steps below.

Ask the user for the package version and whether the package should be private. Present the current `package.json` values as defaults.

Ask the user for the Android build namespace and application ID, separately, with `com.reactnativestarter` as the default for each.

Update the root `package.json` with the answers:
- Set `name` to the project name with spaces removed.
- Set `version` to the supplied version.
- Set `private` to the supplied boolean.
- Set `react-native-windows.init-windows.name` and `react-native-windows.init-windows.namespace` to the project name with spaces removed. Leave `template` unchanged.

Update the root `app.json`:
- Set `name` to the project name with spaces removed.
- Set `displayName` to the original project name with spaces.

Update `android/settings.gradle`:
- Set `rootProject.name` to the project name with spaces removed.

Update `android/app/build.gradle`:
- Set `namespace` and `defaultConfig.applicationId` to the respective Android values supplied by the user.

Preserve all other settings in these files and verify the resulting JSON and updated values. Validate the Android build when its toolchain is available, and report any build errors.
