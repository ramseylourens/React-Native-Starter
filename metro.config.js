const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const fs = require('fs');
const path = require('node:path');

const rnwPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-windows/package.json'), '..'),
);
const screensPath = fs.realpathSync(
  path.dirname(require.resolve('react-native-screens/package.json')),
);
const safeAreaPath = fs.realpathSync(
  path.dirname(require.resolve('react-native-safe-area-context/package.json')),
);
const desktopTabsFallbacks = new Map([
  [path.join(screensPath, 'src/components/tabs/host/index.ts'), './TabsHost'],
  [path.join(screensPath, 'src/components/tabs/screen/index.ts'), './TabsScreen'],
]);
const macosSafeAreaFallbacks = new Map([
  [path.join(safeAreaPath, 'src/SafeAreaContext.tsx'), './NativeSafeAreaProvider'],
  [path.join(safeAreaPath, 'src/index.tsx'), './SafeAreaView'],
]);
const defaultConfig = getDefaultConfig(__dirname);
const platformResolver = defaultConfig.resolver.resolveRequest;

//

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
  //
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      if (
        platform === 'macos' &&
        macosSafeAreaFallbacks.get(context.originModulePath) === moduleName
      ) {
        return context.resolveRequest(context, `${moduleName}.windows`, platform);
      }

      if (
        (platform === 'macos' || platform === 'windows') &&
        desktopTabsFallbacks.get(context.originModulePath) === moduleName
      ) {
        return context.resolveRequest(context, `${moduleName}.web`, platform);
      }

      return platformResolver
        ? platformResolver(context, moduleName, platform)
        : context.resolveRequest(context, moduleName, platform);
    },
    blockList: [
      // This stops "npx @react-native-community/cli run-windows" from causing the metro server to crash if its already running
      new RegExp(
        `${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`,
      ),
      // The Electron shell has its own node_modules and is not part of the JS bundle
      new RegExp(
        `${path.resolve(__dirname, 'linux').replace(/[/\\]/g, '/')}/.*`,
      ),
      // This prevents "npx @react-native-community/cli run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      /.*\.ProjectImports\.zip/,
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, config);
