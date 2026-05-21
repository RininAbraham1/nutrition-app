// build.js — run locally with: node build.js
// GitHub Actions runs this automatically with secrets injected as env vars.
// Locally, create a .env file (never commit it) and run: node build.js

const fs = require('fs');
const path = require('path');

// ── Load .env if it exists (local development) ─────────────────────────────
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .forEach(line => {
      const [key, ...rest] = line.split('=');
      process.env[key.trim()] = rest.join('=').trim();
    });
}

// ── Read keys from environment ─────────────────────────────────────────────
const GROQ_KEY  = process.env.GROQ_API_KEY  || '';
const USDA_KEY  = process.env.USDA_API_KEY  || '';

if (!GROQ_KEY)  console.warn('⚠️  GROQ_API_KEY not set — AI features will be disabled');
if (!USDA_KEY)  console.warn('⚠️  USDA_API_KEY not set — food search will use DEMO_KEY (rate limited)');

// ── Read source HTML ───────────────────────────────────────────────────────
const src = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// ── Inject keys — replaces the placeholder strings ────────────────────────
const out = src
  .replace(/const API_KEY\s*=\s*'[^']*'/, `const API_KEY = '${GROQ_KEY}'`)
  .replace(/const USDA_KEY\s*=\s*'[^']*'/, `const USDA_KEY = '${USDA_KEY || 'DEMO_KEY'}'`);

// ── Write to dist/ ─────────────────────────────────────────────────────────
if (!fs.existsSync('dist')) fs.mkdirSync('dist');
fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), out, 'utf8');

console.log('✅ Built → dist/index.html');
if (GROQ_KEY)  console.log('   🔑 Groq key injected');
if (USDA_KEY)  console.log('   🔑 USDA key injected');
