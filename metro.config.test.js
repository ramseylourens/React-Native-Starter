/** @jest-environment node */

const fs = require("fs");
const path = require("path");
const config = require("./metro.config");

describe("Metro desktop screens tab resolution", () => {
  const screensPath = fs.realpathSync(
    path.dirname(require.resolve("react-native-screens/package.json"))
  );
  const resolveRequest = jest.fn((context, moduleName, platform) => ({
    moduleName,
    platform,
  }));
  const resolve = config.resolver.resolveRequest;

  beforeEach(() => resolveRequest.mockClear());

  test.each([
    ["macos", "host", "TabsHost"],
    ["macos", "screen", "TabsScreen"],
    ["windows", "host", "TabsHost"],
    ["windows", "screen", "TabsScreen"],
  ])("uses the web fallback on %s for %s", (platform, folder, module) => {
    const context = {
      originModulePath: path.join(
        screensPath,
        "src/components/tabs",
        folder,
        "index.ts"
      ),
      resolveRequest,
    };

    expect(resolve(context, `./${module}`, platform)).toEqual({
      moduleName: `./${module}.web`,
      platform,
    });
  });

  test.each(["ios", "android", "web"])(
    "preserves normal resolution on %s",
    (platform) => {
      const context = {
        originModulePath: path.join(
          screensPath,
          "src/components/tabs/host/index.ts"
        ),
        resolveRequest,
      };

      expect(resolve(context, "./TabsHost", platform)).toEqual({
        moduleName: "./TabsHost",
        platform,
      });
    }
  );

  test("does not redirect unrelated imports", () => {
    const context = {
      originModulePath: path.join(screensPath, "src/index.tsx"),
      resolveRequest,
    };

    expect(resolve(context, "./TabsHost", "macos")).toEqual({
      moduleName: "./TabsHost",
      platform: "macos",
    });
  });

  test.each([
    ["SafeAreaContext.tsx", "./NativeSafeAreaProvider"],
    ["index.tsx", "./SafeAreaView"],
  ])("uses the macOS safe-area fallback for %s", (origin, moduleName) => {
    const context = {
      originModulePath: path.join(
        fs.realpathSync(
          path.dirname(
            require.resolve("react-native-safe-area-context/package.json")
          )
        ),
        "src",
        origin
      ),
      resolveRequest,
    };

    expect(resolve(context, moduleName, "macos")).toEqual({
      moduleName: `${moduleName}.windows`,
      platform: "macos",
    });
    expect(resolve(context, moduleName, "ios")).toEqual({
      moduleName,
      platform: "ios",
    });
  });

  test("delegates other imports to the React Native CLI platform resolver", () => {
    jest.isolateModules(() => {
      const metroConfig = require("@react-native/metro-config");
      const platformResolver = jest.fn((context, moduleName, platform) => ({
        moduleName: "react-native-macos",
        platform,
      }));
      metroConfig.setFrameworkDefaults({
        resolver: { resolveRequest: platformResolver },
      });
      try {
        const platformConfig = require("./metro.config");
        const context = {
          originModulePath: path.join(screensPath, "src/index.tsx"),
          resolveRequest,
        };
        expect(
          platformConfig.resolver.resolveRequest(
            context,
            "react-native",
            "macos"
          )
        ).toEqual({ moduleName: "react-native-macos", platform: "macos" });
        expect(platformResolver).toHaveBeenCalledWith(
          context,
          "react-native",
          "macos"
        );
      } finally {
        metroConfig.setFrameworkDefaults({});
      }
    });
  });
});
