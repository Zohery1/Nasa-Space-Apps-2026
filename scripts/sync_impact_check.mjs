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

console.log('\n🔍 ===================================================');
console.log('   NASA SPACE APPS 2026 — CROSS-ROLE IMPACT DISPATCHER');
console.log('=====================================================\n');

// 1. Fetch latest dev status
run('git fetch origin dev');

// 2. Determine diff against dev
const changedFilesRaw = run('git diff --name-only origin/dev HEAD') || '';
const changedFiles = changedFilesRaw.split('\n').filter(Boolean);

// 3. Inspect recent commits on dev
const recentCommits = run('git log origin/dev -n 3 --oneline') || 'No recent commits.';

console.log('📦 Recent commits on origin/dev:');
console.log(recentCommits.split('\n').map(l => `   • ${l}`).join('\n'));
console.log('\n-----------------------------------------------------');

const roleTasks = {
  role1: [], // Game Dev
  role2: [], // Data & Integration
  role3: [], // UI/UX
  role4: [], // Pitch & Assets
};

// Check for Store and Types changes
const touchedStore = changedFiles.some(f => f.includes('src/store/'));
const touchedTypes = changedFiles.some(f => f.includes('src/types/'));
const touchedConstants = changedFiles.some(f => f.includes('src/config/constants.ts'));
const touchedAssets = changedFiles.some(f => f.startsWith('public/assets/'));
const touchedGame = changedFiles.some(f => f.startsWith('src/game/'));
const touchedComponents = changedFiles.some(f => f.startsWith('src/components/'));

if (touchedTypes) {
  roleTasks.role1.push('⚠️ Shared contracts in `src/types/` changed. Review interface signatures and update entity models.');
  roleTasks.role2.push('⚠️ Shared contracts in `src/types/` changed. Ensure API mapper output strictly conforms to updated types.');
  roleTasks.role3.push('⚠️ Shared contracts in `src/types/` changed. Verify HUD prop bindings match interface updates.');
}

if (touchedStore) {
  roleTasks.role1.push('⚡ Store updated in `src/store/useGameStore.ts`. Check for newly added actions to invoke from Pixi ticker/collision loops.');
  roleTasks.role3.push('🎨 Store updated in `src/store/useGameStore.ts`. Subscribe to new state variables in HUD / modal components.');
}

if (touchedConstants) {
  roleTasks.role1.push('⚖️ Game balancing numbers in `constants.ts` updated. Verify entity speed, HP, and cooldown variables match latest values.');
  roleTasks.role4.push('⚖️ Balancing values updated. Playtest to confirm difficulty curve and gameplay pace.');
}

if (touchedAssets) {
  roleTasks.role1.push('🖼️ New assets detected in `public/assets/`. Load sprites using PixiJS `Assets.load()`.');
  roleTasks.role3.push('🔊 New audio/sprites detected. Load audio via Howler in `src/audio/` or render graphic assets in UI.');
}

if (touchedGame) {
  roleTasks.role3.push('🎮 Game engine changes detected in `src/game/`. Test canvas interaction and verify pointer-events pass-through.');
}

if (touchedComponents) {
  roleTasks.role1.push('🖥️ UI components updated. Verify game canvas resizing and viewports are unobstructed.');
}

// Print targeted dispatches
console.log('🎯 TARGETED ROLE ACTION DISPATCHES:\n');

console.log('👨💻 Role 1 (Lead Game Dev):');
if (roleTasks.role1.length === 0) {
  console.log('   ✅ No pending engine integration tasks. Continue current feature.');
} else {
  roleTasks.role1.forEach(t => console.log(`   👉 ${t}`));
}

console.log('\n🔌 Role 2 (Data & Integration Eng):');
if (roleTasks.role2.length === 0) {
  console.log('   ✅ No pending data integration tasks. Continue current feature.');
} else {
  roleTasks.role2.forEach(t => console.log(`   👉 ${t}`));
}

console.log('\n🎨 Role 3 (UI/UX & Web Dev):');
if (roleTasks.role3.length === 0) {
  console.log('   ✅ No pending UI integration tasks. Continue current feature.');
} else {
  roleTasks.role3.forEach(t => console.log(`   👉 ${t}`));
}

console.log('\n📝 Role 4 (Pitch, Lore, Design & Assets):');
if (roleTasks.role4.length === 0) {
  console.log('   ✅ No pending asset/lore tasks. Continue pitch preparation.');
} else {
  roleTasks.role4.forEach(t => console.log(`   👉 ${t}`));
}

// Run Build Verification
console.log('\n-----------------------------------------------------');
console.log('🛠️ Running TypeScript build verification (npm run build)...');

const buildResult = run('npm run build');
if (buildResult) {
  console.log('✅ BUILD STATUS: PASSED (Zero TypeScript or bundling errors).\n');
} else {
  console.log('❌ BUILD STATUS: FAILED! Run `npm run build` to view and fix compilation errors immediately.\n');
  process.exit(1);
}
