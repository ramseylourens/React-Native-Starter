---
name: setup
description: 'Setup the whole project'
argument-hint: 'Enter the project name, including spaces'
user-invocable: true
---

# Initialize project

Before asking for the project name, choose the supported platforms:

1. Ask whether the app should support mobile. If yes, offer a multi-select toggle for Android and iOS, defaulting to the platforms whose root directories exist. If no, select neither. If yes but none are selected, ask the user to confirm that neither should be kept.
2. Ask whether the app should support desktop or web. If yes, offer a multi-select toggle for Windows, macOS, Linux, and Web, defaulting to the platforms whose root directories exist. If no, select none. If yes but none are selected, ask the user to confirm that none should be kept.
3. Linux uses the web build. If Linux is selected but Web is not, explain the dependency and ask the user to revise their choices before removing either platform.
4. For each unselected platform whose directory exists, invoke its corresponding removal skill: `remove-android`, `remove-ios`, `remove-windows`, `remove-macos`, `remove-linux`, or `remove-web`. Run them sequentially so each sees the latest `package.json` and directory state. Follow each skill's confirmation, uncommitted-change, and optional source-file deletion safeguards. If a removal is declined, blocked, or fails, stop and report it rather than treating the platform as removed.
5. Report selected platforms whose directories are missing; do not recreate them. Skip removal skills for already-missing directories and report those skips. If platform selection is declined or cancelled, stop without deleting anything.

After removals, run the remaining steps only for platform directories that still exist. Ask platform-specific questions only for those platforms; do not recreate removed configuration, scripts, or files. If a remaining platform directory exists but its expected project structure is missing or cannot be identified, stop and report the problem.

Ask the user for the project name. Keep both the original name with spaces and a version with spaces removed for the steps below.

Ask the user for the package version and whether the package should be private. Present the current `package.json` values as defaults.

If `android/` exists, ask the user for the Android build namespace and application ID, separately, with `com.reactnativestarter` as the default for each.

Before making name-related changes, confirm that the space-free project name starts with an ASCII letter and contains only ASCII letters, digits, or underscores. If it does not, ask for another name. If `ios/` exists, discover the current iOS project, scheme, app target, and resolved bundle identifier instead of assuming this is the first run. Ask the user whether to retain the current iOS bundle identifier or use a different one; if changing it, ask for the new identifier. If the current identifier cannot be determined or the supplied identifier is invalid, ask the user for a valid identifier rather than guessing.

If `macos/` exists, discover the current macOS project, scheme, app target, and resolved bundle identifier as well. Ask separately whether to retain the macOS bundle identifier or use a different one; if changing it, ask for the new identifier. If the current identifier cannot be determined or the supplied identifier is invalid, ask the user for a valid identifier rather than guessing.

If `windows/` exists, discover the Windows solution, app project, packaging project, and package identity. Confirm that the space-free project name is valid for the Windows project and C++ namespace; if not, ask for another name. Ask separately whether to retain the existing Windows package identity or use a different one; if changing it, ask for a valid identity name. Preserve the publisher unless the user explicitly requests a change.

Check for uncommitted changes in files to be changed or moved, and for existing destination paths. Do not overwrite conflicting files or discard changes; stop and ask the user how to proceed.

Update the root `package.json` with the answers:
- Set `name` to the project name with spaces removed.
- Set `version` to the supplied version.
- Set `private` to the supplied boolean.
- If `windows/` exists, set `react-native-windows.init-windows.name` and `react-native-windows.init-windows.namespace` to the project name with spaces removed. Leave `template` unchanged.

Update the root `app.json`:
- Set `name` to the project name with spaces removed.
- Set `displayName` to the original project name with spaces removed.

If `android/` exists, update `android/settings.gradle`:
- Set `rootProject.name` to the project name with spaces removed.

If `android/` exists, update `android/app/build.gradle`:
- Set `namespace` and `defaultConfig.applicationId` to the respective Android values supplied by the user.

If `ios/` exists, rename the iOS project using the space-free project name:
- Rename the app source directory, `.xcodeproj`, `.xcworkspace`, and shared scheme. Update the project file's app target, product, source and resource paths, build settings, CocoaPods references, and the workspace and scheme references to match. Preserve Xcode object identifiers and unrelated settings.
- Update the target in `ios/Podfile` and the React Native module name in `AppDelegate.swift` to match `app.json`'s `name`. Set `CFBundleDisplayName` in the app's `Info.plist` and the app-name label in `LaunchScreen.storyboard` to the original name with spaces.
- Set the app target's bundle identifier in both Debug and Release to the identifier chosen by the user. Retaining it requires preserving the previously resolved value, since the current identifier depends on the product name.
- Update the iOS archive and export script paths and scheme in the root `package.json`. Update any iOS test folder, file, class, and scheme name references that use the old project name without inventing a missing test target.
- Run `yarn ios:pod:install` to regenerate CocoaPods integration for the renamed target; report any failure instead of treating the project as ready.

If `macos/` exists, rename the macOS project using the space-free project name:
- Rename the macOS app source directory, `.xcodeproj`, `.xcworkspace`, shared scheme, and app entitlements file. Retain the `-macOS` suffix where used. Update project targets, products, source and resource paths, build settings, CocoaPods references, and workspace and scheme references to match. Preserve Xcode object identifiers and unrelated settings; do not invent missing targets or files.
- Update the target in `macos/Podfile` without changing its native module exclusions. Update `AppDelegate.swift`'s app type and React Native module name, and set its window title and the app's `CFBundleDisplayName` to the original name with spaces.
- Set the macOS app target's bundle identifier in both Debug and Release to the identifier chosen by the user. Retaining it requires preserving the previously resolved value, since the current identifier depends on the product name.
- Update the macOS icon output path in `scripts/generate-assets.js` to the renamed app directory. Update any other paths that refer to renamed macOS project files.
- Run `yarn macos:pod:install` to regenerate CocoaPods integration for the renamed target; report any failure instead of treating the project as ready.

If `windows/` exists, rename the Windows project using the space-free project name:
- Rename the solution, app and packaging directories, `.vcxproj`, `.vcxproj.filters`, `.wapproj`, and project-named source, header, resource, and icon files. Keep the `.Package` suffix where used. Update solution entries, project and packaging references, includes, resource paths, project name, and root namespace to match. Preserve project and solution GUIDs, file encodings, and unrelated settings.
- Update the native app's React Native component name to match `app.json`'s `name` and its window title to the original name with spaces. Update the package manifest's app display name and description to the original name, and set its identity name to the value chosen by the user. Preserve the publisher and signing settings.
- Update the Windows icon and package image paths in `scripts/generate-assets.js` and any other references to renamed Windows files. Preserve generated autolinking files unless their references must be regenerated by the Windows tooling.

Because `app.json` supplies the shared React Native registration name, also update the component name in Android's `MainActivity.kt` to the same space-free name if `android/` exists. Do not rename the Android project as part of the Apple or Windows project renames.

Preserve unrelated settings and verify the resulting JSON, plists, project paths, and updated references. For each remaining Apple platform, run `xcodebuild -list` for its renamed workspace and build its scheme when the required toolchain is available (use a simulator for iOS). If Windows remains, build its solution on Windows with the required Visual Studio and React Native Windows tooling. Report missing tools, build failures, and any pre-existing scheme references to missing targets. If Android remains, validate its build when its toolchain is available, and report any build errors.

As the final step, tell the user that they can describe what the app is about and how it should work in a root `app-context.md` file. Check whether that file exists:
- If it exists, offer to read it and start building the app. Only read it and begin implementation if the user confirms; otherwise finish setup without building the app.
- If it does not exist, offer a free-text response for the user to describe what the app is about and how it should work, or let them create the file later. If they provide a description, create `app-context.md` with their answer, then ask for confirmation before starting to build the app. If they decline or cancel, finish setup without creating the file or building the app.
