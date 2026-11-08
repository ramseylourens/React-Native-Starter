# Platform Targeting Guide

This guide explains how to target specific platforms while working in React Native.

## Two Approaches

### 1. Platform-Specific Files (Recommended for Major Differences)

Create separate files for each platform using the naming convention:

```
Component.tsx          # Default/fallback
Component.ios.tsx      # iOS-specific
Component.android.tsx  # Android-specific
Component.macos.tsx    # macOS-specific
Component.windows.tsx  # Windows-specific
Component.web.tsx      # Web-specific
```

**When to use:** Completely different UI, layouts, or behavioral patterns.

```typescript
// Import the same way regardless of platform
import { Home } from './screens/Home';  // Automatically picks Home.ios.tsx on iOS, etc.
```

For more details, see the [Platform-Specific Files section in README.md](./README.md#platform-specific-files).

### 2. Platform Module (Recommended for Small Differences)

Use React Native's `Platform` module to target platforms within a single file.

```typescript
import { Platform, View, Text, StyleSheet } from 'react-native';
```

## Platform.select() - Easiest Method

Use `Platform.select()` to return different values based on the platform:

```typescript
// For styling
const styles = StyleSheet.create({
  container: {
    padding: Platform.select({
      ios: 16,
      android: 12,
      web: 20,
      default: 16,  // Fallback
    }),
  },
});

// For strings/content
const welcome = Platform.select({
  ios: 'Welcome to iOS',
  android: 'Welcome to Android',
  macos: 'Welcome to macOS',
  windows: 'Welcome to Windows',
  web: 'Welcome to Web',
});

// For JSX elements
<Text>{Platform.select({
  ios: <Text>iOS Version</Text>,
  android: <Text>Android Version</Text>,
  default: <Text>Other Platform</Text>,
})}</Text>
```

## Platform.OS - Conditional Logic

Use `Platform.OS` for conditional logic within your component:

```typescript
import { Platform } from 'react-native';

// Check the current platform
if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}

// Ternary operator
return Platform.OS === 'ios' ? <IOSComponent /> : <DefaultComponent />;

// Switch statement
switch (Platform.OS) {
  case 'ios':
    return <IOSComponent />;
  case 'android':
    return <AndroidComponent />;
  case 'web':
    return <WebComponent />;
  default:
    return <DefaultComponent />;
}
```

## Platform Constants

```typescript
import { Platform } from 'react-native';

// Get the current platform
Platform.OS  // 'ios' | 'android' | 'macos' | 'windows' | 'web'

// Get the platform version
Platform.Version  // Number for iOS/Android, varies for others

// Check platform versions
if (Platform.OS === 'ios') {
  const version = parseInt(Platform.Version, 10);
  if (version >= 14) {
    // Use iOS 14+ features
  }
}
```

## Useful Shortcuts

```typescript
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const isWeb = Platform.OS === 'web';
const isMacOS = Platform.OS === 'macos';
const isWindows = Platform.OS === 'windows';
const isNative = Platform.OS !== 'web';  // Any native platform
```

## Real-World Example

```typescript
import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

export const Home = () => {
  const styles = getStyles();

  const headerText = Platform.select({
    ios: 'Welcome to iOS',
    android: 'Welcome to Android',
    default: 'Welcome',
  });

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      // Use iOS-specific APIs
      console.log('iOS button pressed');
    } else if (Platform.OS === 'android') {
      // Use Android-specific APIs
      console.log('Android button pressed');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>{headerText}</Text>
      <Text 
        style={styles.button}
        onPress={handlePress}
      >
        Press me
      </Text>
    </View>
  );
};

const getStyles = () => {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: Platform.select({
        ios: '#FFF',
        android: '#FAFAFA',
        web: '#F5F5F5',
      }),
    },
    header: {
      fontSize: Platform.select({
        ios: 24,
        android: 22,
        web: 28,
      }),
      marginBottom: Platform.select({
        ios: 20,
        android: 16,
        web: 24,
      }),
    },
    button: {
      padding: Platform.select({
        ios: 12,
        android: 10,
        web: 14,
      }),
      backgroundColor: Platform.select({
        ios: '#007AFF',
        android: '#2196F3',
        web: '#1976D2',
      }),
      color: 'white',
    },
  });
};
```

## Decision Tree: Which Approach to Use?

```
Is the difference...

Small styling tweaks?
├─ YES → Use Platform.select() in same file
└─ NO → Continue...

Different values/constants?
├─ YES → Use Platform.select()
└─ NO → Continue...

Completely different component/layout?
├─ YES → Create platform-specific files (Component.ios.tsx, etc.)
└─ NO → Use Platform.OS checks in same file

Major behavioral differences?
├─ YES → Use separate platform files
└─ NO → Use Platform.select() or Platform.OS checks
```

## Tips & Best Practices

1. **Prefer `Platform.select()` over `Platform.OS`** - It's cleaner and more declarative
2. **Use platform-specific files for major UI differences** - Keeps code organized and maintainable
3. **Keep platform logic close to where it's used** - Easier to find and maintain
4. **Create helper files for platform-specific logic** - If the logic is complex
5. **Comment your platform-specific code** - Explain why it's needed
6. **Test on actual devices** - Emulators may behave differently

## React Native Platform Module Documentation

For complete documentation, see:
https://reactnative.dev/docs/platform-specific-code
