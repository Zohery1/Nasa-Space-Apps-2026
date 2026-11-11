#!/usr/bin/env node
import fs from 'fs';

const args = process.argv.slice(2);
const roleInput = args[0];

if (!roleInput || !['1', '2', '3', '4'].includes(roleInput)) {
  console.log('\n❌ Usage: npm run set-role <1 | 2 | 3 | 4>');
  console.log('   1: Role 1 (Lead Game Dev — src/game/**)');
  console.log('   2: Role 2 (Data & Integration Eng — src/services/**, src/data/**, src/store/**)');
  console.log('   3: Role 3 (UI/UX & Web Dev — src/components/**, src/audio/**, src/App.tsx)');
  console.log('   4: Role 4 (Pitch, Lore, Design & Assets — public/assets/**, README.md, constants.ts)\n');
  process.exit(1);
}

const roleNumber = parseInt(roleInput, 10);
const rolesMap = {
  1: {
    title: 'Role 1 (Lead Game Dev)',
    territory: 'src/game/**',
    skills: ['pixijs', 'pixijs-performance'],
  },
  2: {
    title: 'Role 2 (Data & Integration Eng)',
    territory: 'src/services/**, src/data/**, src/store/**',
    skills: ['zustand'],
  },
  3: {
    title: 'Role 3 (UI/UX & Web Dev)',
    territory: 'src/components/**, src/audio/**, src/App.tsx',
    skills: ['frontend-design', 'vercel-react-best-practices', 'animation-performance'],
  },
  4: {
    title: 'Role 4 (Pitch, Lore, Design & Assets)',
    territory: 'public/assets/**, README.md, src/config/constants.ts',
    skills: ['game-design-theory', 'sound-effects'],
  },
};

const data = {
  role: roleNumber,
  ...rolesMap[roleNumber],
  configuredAt: new Date().toISOString(),
};

fs.writeFileSync('.role.json', JSON.stringify(data, null, 2), 'utf-8');

console.log('\n=============================================================');
console.log(`✅ ROLE CONFIGURED SUCCESSFULLY FOR THIS MACHINE / BRANCH!`);
console.log('=============================================================');
console.log(`👤 Active Role: ${data.title}`);
console.log(`🔒 Your Territory: ${data.territory}`);
console.log(`🧠 Your Skills: ${data.skills.join(', ')}`);
console.log('\nNow whenever you run `npm run impact-check` or `/sync-impact`,');
console.log('the system will automatically recognize your role and give you');
console.log('your personal tasks only!\n');
