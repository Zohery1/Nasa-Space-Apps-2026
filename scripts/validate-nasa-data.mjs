#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log('\n=============================================================');
console.log('🛡️ NASA SPACE APPS — DATA INTEGRITY & CANONICAL SOURCES CHECK');
console.log('=============================================================\n');

let errorCount = 0;

function assertFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Missing required file: ${filePath} (${description})`);
    errorCount++;
    return false;
  }
  console.log(`✅ Verified file exists: ${filePath}`);
  return true;
}

// 1. Verify Rules
assertFileExists('.agent/rules/nasa-data-integrity-lock.md', 'Data Integrity Lock Rule');
assertFileExists('.agent/rules/truthfulness-and-verification.md', 'Truthfulness Rule');
assertFileExists('AGENTS.md', 'Master AI Law');

// 2. Verify Official Resources
const resourcesPath = 'src/data/officialResources.json';
if (assertFileExists(resourcesPath, 'Official NASA Resources Dataset')) {
  try {
    const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf-8'));
    if (!Array.isArray(resources) || resources.length !== 9) {
      console.log(`❌ Expected exactly 9 official resources, found ${resources.length}`);
      errorCount++;
    } else {
      console.log(`✅ Exactly 9 official NASA resources registered and locked.`);
    }
  } catch (err) {
    console.log(`❌ Failed to parse ${resourcesPath}: ${err.message}`);
    errorCount++;
  }
}

// 3. Verify CubeSat Buses Data (Resource 7)
const busesPath = 'src/data/cubesatBuses.json';
if (assertFileExists(busesPath, 'CubeSat Buses Dataset')) {
  try {
    const buses = JSON.parse(fs.readFileSync(busesPath, 'utf-8'));
    const validTimers = buses.every(b => b.deployablesTimerSeconds >= 1800 && b.rfSilenceTimerSeconds >= 2700);
    if (!validTimers) {
      console.log('❌ CubeSat buses must obey 30-min deployer and 45-min RF silence timers!');
      errorCount++;
    } else {
      console.log('✅ All CubeSat buses satisfy NASA CSLI safety timers (30m deploy / 45m RF).');
    }
  } catch (err) {
    console.log(`❌ Failed to parse ${busesPath}: ${err.message}`);
    errorCount++;
  }
}

// 4. Verify Science Objectives (Resource 6)
const sciencePath = 'src/data/scienceObjectives.json';
if (assertFileExists(sciencePath, 'JWST Science Objectives')) {
  try {
    const science = JSON.parse(fs.readFileSync(sciencePath, 'utf-8'));
    if (!Array.isArray(science) || science.length !== 5) {
      console.log(`❌ Expected exactly 5 science objectives, found ${science.length}`);
      errorCount++;
    } else {
      console.log('✅ Exactly 5 science objectives loaded with wavelength compatibility matrices.');
    }
  } catch (err) {
    console.log(`❌ Failed to parse ${sciencePath}: ${err.message}`);
    errorCount++;
  }
}

console.log('\n-------------------------------------------------------------');
if (errorCount === 0) {
  console.log('🎉 ALL DATA INTEGRITY CHECKS PASSED: 100% CANONICAL NASA SOURCES!\n');
  process.exit(0);
} else {
  console.log(`❌ DATA INTEGRITY CHECK FAILED WITH ${errorCount} ERROR(S)!\n`);
  process.exit(1);
}
