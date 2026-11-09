const path = require('path');

describe('asset generation', () => {
  const originalArgv = process.argv;
  let execute;
  let log;

  beforeEach(() => {
    execute = jest.fn();
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.doMock('child_process', () => ({ execFileSync: execute }));
    jest.doMock('fs', () => ({
      existsSync: jest.fn(() => true),
      mkdirSync: jest.fn(),
      writeFileSync: jest.fn(),
    }));
  });

  afterEach(() => {
    process.argv = originalArgv;
    log.mockRestore();
    jest.dontMock('child_process');
    jest.dontMock('fs');
  });

  function run(mode) {
    process.argv = ['node', 'generate-assets.js', mode];
    jest.isolateModules(() => require('./generate-assets'));
  }

  it.each(['icons', 'all'])('generates and reports icons in %s mode', mode => {
    run(mode);

    const mobileCalls = execute.mock.calls.filter(([command]) => command === 'npx');
    expect(mobileCalls.map(([, args]) => args.slice(-3))).toEqual([
      ['--platforms=ios', '-s', './ios'],
      ['--platforms=android', '-s', './android'],
    ]);

    const outputs = execute.mock.calls
      .filter(([command]) => command === 'convert')
      .map(([, args]) => path.relative(path.resolve(__dirname, '..'), args[args.length - 1]));
    for (const output of outputs) {
      expect(log).toHaveBeenCalledWith(`    Generated: ${output}`);
    }
    expect(outputs).toEqual(expect.arrayContaining([
      expect.stringContaining('mac-512x512@2x.png'),
      expect.stringContaining('Square44x44Logo.scale-200.png'),
      path.join('web', 'favicon.ico'),
      path.join('linux', 'icons', 'icon.png'),
    ]));
    expect(log).toHaveBeenCalledWith(expect.stringContaining(path.join('AppIcon.appiconset', 'Contents.json')));
    expect(outputs.some(output => output.includes('SplashScreen.scale-200.png'))).toBe(mode === 'all');
  });

  it('does not report a file when conversion fails', () => {
    execute.mockImplementation(command => {
      if (command === 'convert') {
        throw new Error('conversion failed');
      }
    });

    expect(() => run('icons')).toThrow('conversion failed');
    expect(log).not.toHaveBeenCalledWith(expect.stringContaining('Generated:'));
  });
});
