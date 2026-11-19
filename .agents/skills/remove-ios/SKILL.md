---
name: remove-ios
description: 'Remove iOS support by deleting ios/ and updating the root package.json app:dep script'
user-invocable: true
---

# Remove iOS support

When invoked, remove the `ios/` directory at the repository root, update or remove the `app:dep` script in the root `package.json`, and ask whether to delete `*.ios.ts` files under `src/` as described below. Do not modify other project configuration, platform directories, scripts, or files.

If the repository-root `macos/` directory exists, set the `app:dep` script to `yarn macos:pod:install`. If it does not exist, remove the `app:dep` script.

1. Confirm the repository root and that `ios/` is a direct child of it. If it is missing or is a symlink, stop and report that instead of deleting anything.
2. Find `*.ios.ts` files recursively under the repository-root `src/` without following directory symlinks. Show the matching paths and ask whether to delete them. If none are found, report that there are no matching files. Do not delete these files unless the user agrees.
3. Check for uncommitted changes under `ios/`, in the root `package.json`, and in any `*.ios.ts` files the user agreed to delete. If any exist, stop and ask the user before making changes.
4. Delete the repository-root `ios/` directory and its contents, update or remove `app:dep` as described above, and delete the matching `*.ios.ts` files only if the user agreed.
5. Verify that `ios/` no longer exists, that `app:dep` matches the state of `macos/`, and, if deletion was approved, that the identified `*.ios.ts` files are gone. Preserve all other `package.json` content, then report the result.
