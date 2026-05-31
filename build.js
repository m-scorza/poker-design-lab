const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'design_sandbox_v4');
const shellPath = path.join(baseDir, 'shell.html');
const outputPath = path.join(__dirname, 'design_sandbox_v4.html');

console.log('Starting compilation...');

// ==========================================
// 1. HELPERS
// ==========================================
const getFileContent = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error(`File missing: ${filePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
};

// Extract inner HTML of <section class="page" id="page-...">...</section>
const extractPageSectionContent = (pageName) => {
  const filePath = path.join(baseDir, 'pages', `${pageName}.html`);
  const content = getFileContent(filePath);
  if (!content) return '';
  
  const match = content.match(/<section\s+class="page[^"]*"\s+id="page-[^"]+">([\s\S]*?)<\/section>/i);
  return match ? match[1].trim() : '';
};

// ==========================================
// 2. COMPILE MAIN TEMPLATE SHELL
// ==========================================
let shell = getFileContent(shellPath);
if (!shell) {
  console.error('Master shell.html not found! Aborting.');
  process.exit(1);
}

// Ensure head loads Space Grotesk
if (!shell.includes('Space Grotesk')) {
  shell = shell.replace(
    '<link href="https://fonts.googleapis.com/css2?',
    '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&'
  );
}

// ==========================================
// 3. INJECT STYLES (components/*.css)
// ==========================================
const cssFiles = [
  'theme-system.css',
  'layout.css',
  'masthead.css',
  'ticker.css',
  'transitions.css',
  'desk.css',
  'career.css',
  'sessions.css',
  'hands.css',
  'leaks.css',
  'ranges.css',
  'villains.css',
  'arena.css',
  'theme-dock.css',
  'loader.css',
  'glow-borders.css',
  'button-glows.css',
  'cursor-follower.css'
];

let compiledCSS = '/* Compiled CSS Modules */\n';
cssFiles.forEach(file => {
  compiledCSS += `\n/* --- MODULE: ${file} --- */\n`;
  compiledCSS += getFileContent(path.join(baseDir, 'components', file)) + '\n';
});

shell = shell.replace('/* <!-- INJECT_STYLES --> */', compiledCSS);
console.log('Injected compiled CSS modules.');

// ==========================================
// 4. INJECT PAGE MARKUP (pages/*.html)
// ==========================================
const pages = ['overview', 'career', 'sessions', 'hands', 'leaks', 'ranges', 'villains', 'arena'];
pages.forEach(page => {
  const pageContent = extractPageSectionContent(page);
  const placeholder = `<!-- PAGE_${page.toUpperCase()} -->`;
  shell = shell.replace(placeholder, pageContent);
  console.log(`Injected page markup: ${page}`);
});

// ==========================================
// 5. INJECT MODULAR SCRIPTS (components/*.js)
// ==========================================
// Read all compiled datasets
const handsData = getFileContent(path.join(baseDir, 'data', 'hands.json'));
const tickerData = getFileContent(path.join(baseDir, 'data', 'ticker.json'));
const villainsData = getFileContent(path.join(baseDir, 'data', 'villains.json'));
const drillsData = getFileContent(path.join(baseDir, 'data', 'arena-drills.json'));

let compiledJS = `
    // Compiled JSON Datasets
    const handsMockData = ${handsData || '[]'};
    const tickerData = ${tickerData || '[]'};
    const villainsMock = ${villainsData || '[]'};
    const trainerDrills = ${drillsData || '[]'};
`;

const jsFiles = [
  'theme-dock.js',
  'scramble.js',
  'transitions.js',
  'background.js',
  'loader.js',
  'radar.js',
  'sessions.js',
  'hands.js',
  'leaks.js',
  'ranges.js',
  'villains.js',
  'arena.js',
  '3d-tilt.js',
  'cursor-follower.js',
  'global-interactive.js'
];

jsFiles.forEach(file => {
  compiledJS += `\n    // --- MODULE: ${file} ---\n`;
  compiledJS += getFileContent(path.join(baseDir, 'components', file)) + '\n';
});

shell = shell.replace('/* <!-- INJECT_SCRIPTS --> */', compiledJS);
console.log('Injected compiled JS modules.');

// Save final compiled HTML
fs.writeFileSync(outputPath, shell, 'utf8');
console.log(`Compiled unified file written successfully: ${outputPath}`);

// ==========================================
// 6. UPDATE STANDALONE ELEMENT VIEWS
// ==========================================
// Synchronize components/background.js into elements/background.html
const bgElementPath = path.join(baseDir, 'elements', 'background.html');
let bgElementContent = getFileContent(bgElementPath);
if (bgElementContent) {
  const bgJS = getFileContent(path.join(baseDir, 'components', 'background.js'));
  let innerBgJS = bgJS.trim();
  // Strip off the DOMContentLoaded envelope if background.js has it
  if (innerBgJS.startsWith("document.addEventListener('DOMContentLoaded', () => {")) {
    innerBgJS = innerBgJS.substring(53, innerBgJS.length - 3);
  }
  bgElementContent = bgElementContent.replace('// Background JS here', innerBgJS);
  fs.writeFileSync(bgElementPath, bgElementContent, 'utf8');
  console.log('Synchronized components/background.js into elements/background.html');
}

console.log('Compilation completed successfully!');
