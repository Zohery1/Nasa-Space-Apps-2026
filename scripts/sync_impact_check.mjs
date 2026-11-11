#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return null;
  }
}

// 1. Determine active branch and role
const currentBranch = run('git branch --show-current') || 'dev';
const args = process.argv.slice(2);

let targetRole = null;

// A. Check command line argument: e.g. `npm run impact-check -- --role 1` or `npm run impact-check 1`
const roleArgIndex = args.findIndex(a => a === '--role' || a === '-r');
if (roleArgIndex !== -1 && args[roleArgIndex + 1]) {
  targetRole = parseInt(args[roleArgIndex + 1], 10);
} else if (args[0] && !isNaN(parseInt(args[0], 10))) {
  targetRole = parseInt(args[0], 10);
}

// B. Check persistent `.role.json` if configured via `npm run set-role <1|2|3|4>`
if (!targetRole && fs.existsSync('.role.json')) {
  try {
    const roleConfig = JSON.parse(fs.readFileSync('.role.json', 'utf-8'));
    if (roleConfig && roleConfig.role) {
      targetRole = roleConfig.role;
    }
  } catch (e) {
    // Ignore invalid json
  }
}

// C. Auto-detect from feature branch naming (e.g. feat/r1-..., feat/r2-...)
if (!targetRole && currentBranch.includes('r1')) targetRole = 1;
if (!targetRole && currentBranch.includes('r2')) targetRole = 2;
if (!targetRole && currentBranch.includes('r3')) targetRole = 3;
if (!targetRole && currentBranch.includes('r4')) targetRole = 4;

// 2. Fetch latest dev
run('git fetch origin dev');

// 3. Inspect diff against dev
const changedFilesRaw = run('git diff --name-only origin/dev HEAD') || '';
const changedFiles = changedFilesRaw.split('\n').filter(Boolean);
const recentCommits = run('git log origin/dev -n 3 --oneline') || 'No recent commits.';

// Impact detectors
const touchedStore = changedFiles.some(f => f.includes('src/store/'));
const touchedTypes = changedFiles.some(f => f.includes('src/types/'));
const touchedConstants = changedFiles.some(f => f.includes('src/config/constants.ts'));
const touchedAssets = changedFiles.some(f => f.startsWith('public/assets/'));
const touchedGame = changedFiles.some(f => f.startsWith('src/game/'));
const touchedComponents = changedFiles.some(f => f.startsWith('src/components/'));
const touchedServices = changedFiles.some(f => f.startsWith('src/services/'));

const roleDetails = {
  1: {
    title: '👨💻 Role 1 (Lead Game Dev)',
    territory: 'src/game/**',
    tasks: [],
  },
  2: {
    title: '🔌 Role 2 (Data & Integration Eng)',
    territory: 'src/services/**, src/data/**, src/store/**',
    tasks: [],
  },
  3: {
    title: '🎨 Role 3 (UI/UX & Web Dev)',
    territory: 'src/components/**, src/audio/**, src/App.tsx',
    tasks: [],
  },
  4: {
    title: '📝 Role 4 (Pitch, Lore, Design & Assets)',
    territory: 'public/assets/**, README.md, src/config/constants.ts',
    tasks: [],
  },
};

// Populate tasks
if (touchedTypes) {
  roleDetails[1].tasks.push('Shared contracts in `src/types/` changed. Review interface signatures and update entity models.');
  roleDetails[2].tasks.push('Shared contracts in `src/types/` changed. Ensure API parser and store conform to updated types.');
  roleDetails[3].tasks.push('Shared contracts in `src/types/` changed. Verify HUD prop bindings match interface updates.');
}

if (touchedStore) {
  roleDetails[1].tasks.push('Store actions updated in `src/store/useGameStore.ts`. Trigger new actions from PixiJS collision/ticker events.');
  roleDetails[3].tasks.push('Store state props updated in `src/store/useGameStore.ts`. Subscribe to new state variables in HUD / modal components.');
}

if (touchedConstants) {
  roleDetails[1].tasks.push('Game balance numbers in `constants.ts` updated. Verify entity speed, HP, and cooldown variables match latest values.');
  roleDetails[4].tasks.push('Balancing values updated. Playtest to confirm difficulty curve and gameplay pace.');
}

if (touchedAssets) {
  roleDetails[1].tasks.push('New visual assets detected in `public/assets/sprites/`. Load textures using PixiJS `Assets.load()`.');
  roleDetails[3].tasks.push('New audio detected in `public/assets/audio/`. Wire sound effects via Howler.js in `src/audio/`.');
}

if (touchedGame) {
  roleDetails[3].tasks.push('Game canvas engine updated in `src/game/`. Test overlay pass-through and click transparency.');
}

if (touchedComponents) {
  roleDetails[1].tasks.push('UI layout updated. Verify canvas resizing and ensure viewports remain unobstructed.');
}

if (touchedServices) {
  roleDetails[1].tasks.push('Data pipeline updated in `src/services/`. Ensure incoming entity data flows correctly into game spawner.');
}

console.log('\n=============================================================');
console.log(`📡 PERSONALIZED POST-SYNC BRIEFING — Branch: [${currentBranch}]`);
console.log('=============================================================\n');

console.log('📦 What landed on origin/dev:');
console.log(recentCommits.split('\n').map(l => `   • ${l}`).join('\n'));
console.log('\n-------------------------------------------------------------');

// If a specific role is targeted, display ONLY that role's briefing!
if (targetRole && roleDetails[targetRole]) {
  const role = roleDetails[targetRole];
  console.log(`🎯 YOUR PERSONAL TASKS (${role.title}):`);
  console.log(`🔒 Your Territory: ${role.territory}\n`);
  
  if (role.tasks.length === 0) {
    console.log('   ✅ No required adjustments from this merge! You can continue your current task.\n');
  } else {
    role.tasks.forEach((t, i) => console.log(`   ${i + 1}. 👉 ${t}`));
    console.log('');
  }
} else {
  console.log('💡 Tip: Set your machine role once with `npm run set-role <1|2|3|4>`\n');
  [1, 2, 3, 4].forEach(rId => {
    const role = roleDetails[rId];
    console.log(`--- [ ${role.title} ] ---`);
    if (role.tasks.length === 0) {
      console.log('   ✅ No actions needed.\n');
    } else {
      role.tasks.forEach(t => console.log(`   👉 ${t}`));
      console.log('');
    }
  });
}

// Build Check
console.log('-------------------------------------------------------------');
process.stdout.write('🛠️ Verifying build health (npm run build)... ');
const buildOutput = run('npm run build');

if (buildOutput) {
  console.log('✅ HEALTHY (0 errors)\n');
} else {
  console.log('❌ BUILD BROKEN! Immediate action required before continuing.\n');
  process.exit(1);
}
