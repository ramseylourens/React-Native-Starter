---
name: remove-android
description: 'Remove Android support by deleting android/ and its root package.json scripts'
user-invocable: true
---

# Remove Android support

When invoked, remove the `android/` directory at the repository root and the five Android scripts listed below from the root `package.json`, and ask whether to delete `*.android.ts` files under `src/`. Do not modify other project configuration, platform directories, scripts, or files.

Remove only these keys from the `scripts` section of the root `package.json`:

```json
"android": "bash ./scripts/wait-and-run-android.sh",
"android:device": "adb -s $DEVICE reverse tcp:8081 tcp:8081 && react-native run-android --deviceId $DEVICE",
"android:studio": "studio android",
"android:build:apk": "cd android && ./gradlew clean assembleRelease",
"android:build:apk:list": "ls -la android/app/build/outputs/apk/release"
```

1. Confirm the repository root and that `android/` is a direct child of it. If it is missing or is a symlink, stop and report that instead of deleting anything.
2. Find `*.android.ts` files recursively under the repository-root `src/` without following directory symlinks. Show the matching paths and ask whether to delete them. If none are found, report that there are no matching files. Do not delete these files unless the user agrees.
3. Check for uncommitted changes under `android/`, in the root `package.json`, and in any `*.android.ts` files the user agreed to delete. If any exist, stop and ask the user before making changes.
4. Delete the repository-root `android/` directory and its contents, remove only the five listed script keys from the root `package.json`, and delete the matching `*.android.ts` files only if the user agreed.
5. Verify that `android/` no longer exists, that the five script keys are absent, and, if deletion was approved, that the identified `*.android.ts` files are gone. Preserve all other `package.json` content, then report the result.
