/** Default/Web deep linking configuration (fallback for platforms without specific linking.platform.ts) */
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
        },
      },
      Settings: "settings",
    },
  },
};
