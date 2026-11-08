/** Default/Web deep linking configuration (fallback for platforms without specific linking.platform.ts) */
const linkingPrefixes = [
  'https://reactnativestarter.app',
  'ReactNativeStarter://',
];

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
