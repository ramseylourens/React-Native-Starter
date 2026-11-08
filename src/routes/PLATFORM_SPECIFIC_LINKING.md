# Platform-Specific Deep Linking Configuration

This directory now uses React Native's platform-specific file resolution to provide platform-optimized linking configurations.

## How It Works

When you import from `./linking`, the module resolver will automatically select the correct file based on the platform:

```typescript
import { linking } from './linking';
```

### File Resolution Order

- **iOS**: Uses `linking.ios.ts`
- **Android**: Uses `linking.android.ts`
- **macOS**: Uses `linking.macos.ts`
- **Windows**: Uses `linking.windows.ts`
- **Linux/Web**: Uses `linking.linux.ts` or falls back to `linking.ts`
- **Default/Fallback**: Uses `linking.ts`

## File Structure

```
linking.ts              # Default/Web fallback configuration
linking.shared.ts       # Shared constants (linkingPrefixes) used by all platforms
linking.ios.ts          # iOS-specific configuration
linking.android.ts      # Android-specific configuration
linking.macos.ts        # macOS-specific configuration
linking.windows.ts      # Windows-specific configuration
linking.linux.ts        # Linux (Electron)-specific configuration
```

## Customizing Platform-Specific Linking

Each platform file exports a `linking` const with the same structure. You can now customize the deep linking configuration per platform:

### Example: Add Platform-Specific Routes

```typescript
// linking.ios.ts - iOS-specific configuration
import { linkingPrefixes } from './linking.shared';

export const linking = {
  prefixes: linkingPrefixes,
  config: {
    screens: {
      HomeStack: {
        path: "home",
        initialRouteName: "Home",
        screens: {
          Home: "/",
          Profile: {
            path: "user/:id",
          },
          // iOS-specific screen
          IOSOnlyFeature: "ios-feature/:id",
        },
      },
      Settings: "settings",
    },
  },
};
```

### Example: Different Deep Link Domains

```typescript
// linking.android.ts - Android-specific configuration
import { linkingPrefixes } from './linking.shared';

export const linking = {
  prefixes: [
    ...linkingPrefixes,
    'android-app://reactnativestarter', // Android-specific domain
  ],
  config: {
    // ... rest of config
  },
};
```

## Benefits

✅ **Platform-Specific Behavior**: Each platform can have its own linking rules  
✅ **Code Organization**: No platform checks needed in code  
✅ **Tree-Shaking**: Only relevant platform code is bundled  
✅ **Development Efficiency**: Develop and test platform-specific features independently  
✅ **Maintainability**: Easier to manage platform differences  

## Shared Constants

Platform prefixes and other shared constants are defined in `linking.shared.ts`:

```typescript
export const linkingPrefixes = [
  'https://reactnativestarter.app',
  'ReactNativeStarter://',
];
```

Import this in any platform-specific file to maintain DRY principle.

## Notes

- The `linking.ts` file acts as a fallback for web and any platform without a specific implementation
- All platform files must export a `linking` const with the same interface
- The `linking.shared.ts` contains shared configuration that all platforms can use
