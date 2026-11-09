#!/usr/bin/env node
/**
 * Generates platform icons/assets from a single source image.
 *
 *   node scripts/generate-assets.js icons   # app icons for every platform
 *   node scripts/generate-assets.js all     # icons + splash screens
 *
 * Requires ImageMagick (`convert`), which `app-icon` also needs.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const SOURCE = path.join(root, 'public/assets/Icon.png');
const mode = process.argv[2] || 'icons';

if (!['icons', 'all'].includes(mode)) {
  console.error(`Unknown mode "${mode}". Use "icons" or "all".`);
  process.exit(1);
}

const abs = (...p) => path.join(root, ...p);

function convert(args) {
  execFileSync('convert', args, { stdio: 'inherit' });
  console.log(`    Generated: ${path.relative(root, args[args.length - 1])}`);
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

// Square PNG, scaled to fit.
function resizeSquare(out, size) {
  ensureDir(out);
  convert([SOURCE, '-resize', `${size}x${size}`, out]);
}

// Canvas of w x h (transparent) with the icon centered at iconSize.
function compose(out, w, h, iconSize) {
  ensureDir(out);
  convert([
    '-size', `${w}x${h}`, 'xc:none',
    '(', SOURCE, '-resize', `${iconSize}x${iconSize}`, ')',
    '-gravity', 'center', '-composite', out,
  ]);
}

function multiSizeIco(out, sizes) {
  ensureDir(out);
  convert([
    SOURCE,
    '-define', `icon:auto-resize=${sizes.join(',')}`,
    out,
  ]);
}

function log(msg) {
  console.log(`\n> ${msg}`);
}

function generateMobile() {
  for (const platform of ['ios', 'android']) {
    log(`${platform === 'ios' ? 'iOS' : 'Android'} (app-icon)`);
    execFileSync(
      'npx',
      ['app-icon', 'generate', '-i', 'public/assets/Icon.png', `--platforms=${platform}`, '-s', `./${platform}`],
      { stdio: 'inherit', cwd: root },
    );
  }
}

function generateMacos() {
  log('macOS');
  const dir = abs('macos/ReactNativeStarter-macOS/Assets.xcassets/AppIcon.appiconset');
  const images = [];
  for (const size of [16, 32, 128, 256, 512]) {
    for (const scale of [1, 2]) {
      const filename = `mac-${size}x${size}@${scale}x.png`;
      resizeSquare(path.join(dir, filename), size * scale);
      images.push({
        filename,
        idiom: 'mac',
        scale: `${scale}x`,
        size: `${size}x${size}`,
      });
    }
  }
  const contents = path.join(dir, 'Contents.json');
  fs.writeFileSync(
    contents,
    `${JSON.stringify({ images, info: { author: 'xcode', version: 1 } }, null, 2)}\n`,
  );
  console.log(`    Generated: ${path.relative(root, contents)}`);
}

function generateWindows() {
  log('Windows');
  const images = abs('windows/ReactNativeStarter.Package/Images');
  resizeSquare(path.join(images, 'Square44x44Logo.scale-200.png'), 88);
  resizeSquare(path.join(images, 'Square44x44Logo.targetsize-24_altform-unplated.png'), 24);
  resizeSquare(path.join(images, 'Square150x150Logo.scale-200.png'), 300);
  resizeSquare(path.join(images, 'LockScreenLogo.scale-200.png'), 48);
  resizeSquare(path.join(images, 'StoreLogo.png'), 50);
  compose(path.join(images, 'Wide310x150Logo.scale-200.png'), 620, 300, 300);

  const ico = [16, 24, 32, 48, 64, 128, 256];
  multiSizeIco(abs('windows/ReactNativeStarter/ReactNativeStarter.ico'), ico);
  multiSizeIco(abs('windows/ReactNativeStarter/small.ico'), ico);
}

function generateWeb() {
  log('Web');
  multiSizeIco(abs('web/favicon.ico'), [16, 32, 48]);
}

function generateLinux() {
  log('Linux');
  resizeSquare(abs('linux/icons/icon.png'), 512);
}

function generateSplashScreens() {
  log('Windows splash screen');
  compose(
    abs('windows/ReactNativeStarter.Package/Images/SplashScreen.scale-200.png'),
    1240,
    600,
    400,
  );
}

if (!fs.existsSync(SOURCE)) {
  console.error(`Source icon not found: ${SOURCE}`);
  process.exit(1);
}

generateMobile();
generateMacos();
generateWindows();
generateWeb();
generateLinux();

if (mode === 'all') {
  generateSplashScreens();
}

console.log(`\nDone (${mode}).`);
