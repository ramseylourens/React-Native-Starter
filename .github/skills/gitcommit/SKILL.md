---
name: gitcommit
description: 'Generate conventional git commit title and message based on your staged changes. Use when: preparing to commit, want to generate messages from actual file changes, need conventional commit format (feat/fix/docs/style/refactor/test/chore).'
argument-hint: 'Leave blank to analyze staged changes, or describe changes manually'
user-invocable: true
---

# Git Commit Message Generator

## What This Does

Automatically analyzes your staged changes (or all modified files) and generates a conventional commit title and detailed message based on what you've actually changed. No need to describe—it detects what changed and suggests the appropriate commit type and message.

## When to Use

- **After making changes**: Before running `git commit`
- **Quick commit messages**: Don't want to think about message format
- **Conventional commits**: Want consistent `feat/fix/docs/style/refactor/test/chore` format
- **Detailed context**: Auto-generates body with affected files and changes

## Procedure

### Run the Skill

Simply type in chat:
```
/gitcommit
```

That's it! The skill will:
1. Analyze your staged changes (`git diff --cached`)
2. Detect what files were modified (source code, docs, tests, configs, etc.)
3. Generate appropriate commit type (feat, fix, docs, etc.)
4. Create a title and detailed message
5. Return ready-to-use format

### What You Get Back

The skill returns:
1. **Commit Type**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
2. **Commit Title**: Concise one-line summary (imperative mood, lowercase)
3. **Commit Message**: Detailed multi-line body listing affected files and changes
4. **Files Changed**: Summary of what changed
5. **Ready to Use**: Copy-paste directly to git

## Example

After you've staged changes to metro.config.js and added platform files:

```
/gitcommit
```

Returns:
```
Type: feat
Title: add platform-specific file grouping with metro aliases

Files Changed:
- metro.config.js (modified)
- src/screens/Home.mobile.ios.tsx (new)
- src/screens/Home.mobile.android.tsx (new)
- src/screens/Home.desktop.windows.tsx (new)
- src/screens/Home.desktop.macos.tsx (new)
- src/screens/Home.desktop.linux.tsx (new)
- PLATFORM_GROUPED_TARGETING.md (new)

Message:
Add Metro config platformAliases to support grouped platform targeting.

- Add platformAliases to metro.config.js for mobile and desktop grouping
- mobile alias resolves to iOS and Android platforms
- desktop alias resolves to Windows, macOS, and Linux platforms
- Created platform-grouped Home screen files for all supported platforms
- Added comprehensive documentation in PLATFORM_GROUPED_TARGETING.md

This enables cleaner separation of mobile and desktop implementations
while maintaining automatic platform resolution in React Native.
```

## Smart Detection

The skill automatically detects:
- **New files** vs **modified files** → helps determine feat vs fix vs chore
- **Test files** → suggests `test:` type
- **Documentation** → suggests `docs:` type
- **Package.json/config changes** → suggests `chore:` type
- **Source code changes** → suggests `feat:` or `fix:` type
- **Breaking changes** → flags in message

## Copy-Paste to Git

Once you have the generated message:

```bash
git commit -m "feat: add platform-specific file grouping with metro aliases" -m "Add Metro config platformAliases to support grouped platform targeting..."
```

Or use interactive mode:
```bash
git commit
# Paste title on first line
# Leave blank line  
# Paste body
# Save and exit
```

## Manual Description (Optional)

If you want to override auto-detection:
```
/gitcommit feat: updated error handling in auth module
```

## Commit Types Reference

- **feat**: New feature or functionality
- **fix**: Bug fix
- **docs**: Documentation changes only (README, CHANGELOG, etc)
- **style**: Code style changes (formatting, semicolons, etc) - no logic change
- **refactor**: Code refactor without feature change or bug fix
- **test**: Adding or updating tests
- **chore**: Build, dependency, tooling, CI/CD, config changes

## See Also

- [Conventional Commits](https://www.conventionalcommits.org/)
- [7 Rules of a Great Git Commit Message](https://chris.beams.io/posts/git-commit/)
