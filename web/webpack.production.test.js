/** @jest-environment node */

const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
jest.useRealTimers();
const webpack = require('webpack');
const config = require('./webpack.config');

test('production minification preserves Immer initialization', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'webpack-immer-'));
  try {
    const entry = path.join(directory, 'entry.js');
    fs.writeFileSync(
      entry,
      "import { produce } from 'immer'; globalThis.result = produce({count: 0}, draft => { draft.count = 1; });",
    );
    const compiler = webpack({
      mode: 'production',
      target: 'node',
      entry,
      output: { path: directory, filename: 'bundle.js' },
      resolve: { modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'] },
      optimization: { minimizer: config.optimization.minimizer },
    });
    const stats = await new Promise((resolve, reject) => {
      compiler.run((error, result) => {
        compiler.close(closeError => {
          if (error || closeError) {
            reject(error || closeError);
          } else {
            resolve(result);
          }
        });
      });
    });
    expect(stats.hasErrors() ? stats.toString({ all: false, errors: true }) : '').toBe('');
    const context = {};
    vm.runInNewContext(fs.readFileSync(path.join(directory, 'bundle.js'), 'utf8'), context);
    expect(context.result.count).toBe(1);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}, 30000);
