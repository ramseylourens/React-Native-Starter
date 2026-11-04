/** Link prefixes/domains for deep linking */
const linkingPrefixes = [
  'https://reactnativestarter.app',
  'ReactNativeStarter://',
];

// FIXME: Better type
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
