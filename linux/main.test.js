const path = require('path');

describe('Electron window icon', () => {
  const platformDescriptor = Object.getOwnPropertyDescriptor(process, 'platform');
  let app;
  let BrowserWindow;
  let nativeImage;
  let icon;

  beforeEach(() => {
    icon = { isEmpty: jest.fn(() => false) };
    app = {
      requestSingleInstanceLock: jest.fn(() => true),
      whenReady: jest.fn(() => Promise.resolve()),
      dock: { setIcon: jest.fn() },
      on: jest.fn(),
      quit: jest.fn(),
    };
    BrowserWindow = jest.fn(() => ({
      once: jest.fn(),
      webContents: {
        setWindowOpenHandler: jest.fn(),
        on: jest.fn(),
      },
      loadFile: jest.fn(),
    }));
    BrowserWindow.getAllWindows = jest.fn(() => []);
    nativeImage = { createFromPath: jest.fn(() => icon) };
    jest.doMock('electron', () => ({
      app,
      BrowserWindow,
      nativeImage,
      session: { defaultSession: { setPermissionRequestHandler: jest.fn() } },
      shell: { openExternal: jest.fn() },
    }), { virtual: true });
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', platformDescriptor);
    jest.dontMock('electron');
  });

  it.each(['darwin', 'linux'])('uses the generated icon on %s and recreates the window with it', async platform => {
    Object.defineProperty(process, 'platform', { value: platform });
    jest.isolateModules(() => require('./main'));
    await Promise.resolve();

    expect(nativeImage.createFromPath).toHaveBeenCalledWith(path.join(__dirname, 'icons', 'icon.png'));
    expect(BrowserWindow).toHaveBeenCalledWith(expect.objectContaining({ icon }));
    if (platform === 'darwin') {
      expect(app.dock.setIcon).toHaveBeenCalledWith(icon);
    } else {
      expect(app.dock.setIcon).not.toHaveBeenCalled();
    }

    const activate = app.on.mock.calls.find(([event]) => event === 'activate')[1];
    activate();
    expect(BrowserWindow).toHaveBeenLastCalledWith(expect.objectContaining({ icon }));
    expect(BrowserWindow).toHaveBeenCalledTimes(2);
  });
});
