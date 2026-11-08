# Platform-Specific File Organization with Mobile/Desktop Grouping

## Overview

This project now supports grouped platform targeting through custom Metro config aliases. Instead of maintaining separate files for each platform, you can now group them logically:

- **Mobile**: iOS + Android (`Home.mobile.tsx`)
- **Desktop**: Windows + macOS + Linux (`Home.desktop.tsx`)
- **Web**: Web platform (`Home.web.tsx`)

## How It Works

The `metro.config.js` has been configured with `platformAliases` that map grouped platform names to their constituent platforms:

```javascript
platformAliases: {
  mobile: ['ios', 'android'],      // resolves to .ios.tsx and .android.tsx
  desktop: ['windows', 'macos', 'linux'],  // resolves to .windows.tsx, .macos.tsx, .linux.tsx
}
```

## File Naming Convention

When you have a component like `Home`, you can create these variations:

### Mobile Platforms (iOS & Android)
- `Home.mobile.ios.tsx` - iOS-specific implementation
- `Home.mobile.android.tsx` - Android-specific implementation

### Desktop Platforms (Windows, macOS, Linux)
- `Home.desktop.windows.tsx` - Windows implementation
- `Home.desktop.macos.tsx` - macOS implementation
- `Home.desktop.linux.tsx` - Linux implementation

### Web
- `Home.web.tsx` - Web implementation

### Fallback (Optional)
- `Home.tsx` - Used as fallback if no platform-specific file exists

## Usage Example

When you import a component, React Native's module resolver automatically picks the correct file:

```typescript
// This single import works across all platforms
import Home from './screens/Home';

// iOS: resolves to Home.mobile.ios.tsx
// Android: resolves to Home.mobile.android.tsx
// Windows: resolves to Home.desktop.windows.tsx
// macOS: resolves to Home.desktop.macos.tsx
// Linux: resolves to Home.desktop.linux.tsx
// Web: resolves to Home.web.tsx
```

## Creating New Platform-Specific Components

When you need to create a new platform-specific component:

### Step 1: Decide on Grouping
- Will this component be shared across mobile platforms? → Use `.mobile.*`
- Will this component be shared across desktop platforms? → Use `.desktop.*`
- Is it web-only? → Use `.web`
- Is it shared across all platforms? → Create a single `Component.tsx`

### Step 2: Create Files
Example: Creating a `Navigation` component for mobile and desktop:

```bash
src/components/Navigation/
├── Navigation.mobile.ios.tsx
├── Navigation.mobile.android.tsx
├── Navigation.desktop.windows.tsx
├── Navigation.desktop.macos.tsx
├── Navigation.desktop.linux.tsx
└── Navigation.web.tsx
```

### Step 3: Import Normally
```typescript
import Navigation from './components/Navigation';
// Metro resolver automatically selects the correct file
```

## Mixed Approach: Shared Logic + Platform-Specific UI

For components that share logic but have different UI:

```typescript
// Common logic file
// shared.ts
export const commonLogic = () => { /* ... */ };

// Platform-specific implementations
// Component.mobile.ios.tsx
import { commonLogic } from './shared';
export default () => {
  const result = commonLogic();
  return <IosUI>{result}</IosUI>;
};

// Component.mobile.android.tsx
import { commonLogic } from './shared';
export default () => {
  const result = commonLogic();
  return <AndroidUI>{result}</AndroidUI>;
};
```

## Platform Detection Within Files

Sometimes you need to detect the platform within a single file. Use React Native's Platform API:

```typescript
import { Platform } from 'react-native';

export default () => {
  // Useful when you have slight differences within a grouped platform
  if (Platform.OS === 'ios') {
    // iOS-specific code
  } else if (Platform.OS === 'android') {
    // Android-specific code
  }
  
  // Or use Platform.select() for cleaner code
  const component = Platform.select({
    ios: <IosComponent />,
    android: <AndroidComponent />,
    default: <DefaultComponent />,
  });
  
  return component;
};
```

## Best Practices

1. **Use the grouped approach first** - Create `Component.mobile.tsx` files when the logic is shared
2. **Fall back to platform detection** - Use `Platform.OS` only for minor differences
3. **Keep platform-specific files focused** - Don't mix logic for multiple platforms in one file unless they're truly identical
4. **Create unit tests** - Test shared logic separately from platform-specific rendering
5. **Document platform differences** - Add comments explaining why platform files differ

## Legacy Platform Files

This project still has legacy `.ios.tsx`, `.android.tsx`, etc. files. These work fine and will continue to be used. You can gradually migrate to the new grouped approach:

- Start using `Component.mobile.*` for new components
- When updating existing components, consider consolidating to the grouped approach
- The old files won't hurt anything; use what makes sense for your component

## Troubleshooting

**Import still resolves to wrong file?**
- Restart the Metro dev server: `yarn app:start` (or stop and restart)
- Metro caches file resolutions; restarting clears the cache

**Missing fallback causing errors?**
- If importing `Component` doesn't find any platform files, React Native will error
- Make sure you have at least one matching platform file or a `Component.tsx` fallback
- The platform resolution order is: `Component.mobile.ios.tsx` → `Component.ios.tsx` → `Component.tsx`

**Want to share code between mobile and desktop platforms?**
- Create a `Component.shared.ts` (without platform extension) for shared logic
- Import it into your platform-specific files
- Platform-specific files always resolve first, so `.shared.ts` won't conflict
